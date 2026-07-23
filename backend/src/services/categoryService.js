const mongoose = require("mongoose")

const categoryModel = require("../models/categoryModel")
const courseModel = require("../models/courseModel")

const { generateUniqueSlug } = require("../utils/generateUniqueSlug")
const invalidatePattern = require("../utils/invalidatePattern")
const { client } = require("../configs/redis")
const { hasUnboundedParams, buildCacheKey, resolveTTL } = require("../utils/listCache")
const { uploadImage, deleteFile } = require("./fileService")

const ICON_FOLDER = "sabzlearn/categories/icons"


function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

async function checkDuplicateSiblingName(name, parentId, excludeId = null) {
    const query = {
        parent: parentId,
        name: { $regex: `^${escapeRegex(name.trim())}$`, $options: "i" }
    }

    if (excludeId) {
        query._id = { $ne: excludeId }
    }

    const duplicate = await categoryModel.findOne(query)

    if (duplicate) {
        const err = new Error("a category with this name already exists under the same parent")
        err.status = 409
        throw err
    }
}

async function getDescendantCategoryIds(categorySlug) {
    const result = await categoryModel.aggregate([
        { $match: { slug: categorySlug } },
        {
            $graphLookup: {
                from: "categories",
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "parent",
                as: "descendants"
            }
        }
    ])

    if (!result.length) {
        const err = new Error("category not found")
        err.status = 404
        throw err
    }

    const [{ _id, descendants }] = result
    return [_id, ...descendants.map(d => d._id)]
}

async function resolveCategoryId(categorySlug) {
    const found = await categoryModel.findOne({ slug: categorySlug, status: { $ne: "inactive" } }).select("_id")

    if (!found) {
        const err = new Error("no active category found with the provided slug")
        err.status = 404
        throw err
    }

    return found._id
}

async function validateParentCategory(parentId, currentCategoryId = null) {
    if (!parentId) return null

    if (currentCategoryId && String(parentId) === String(currentCategoryId)) {
        const err = new Error("a category cannot be its own parent")
        err.status = 400
        throw err
    }

    const parentCategory = await categoryModel.findById(parentId)

    if (!parentCategory) {
        const err = new Error("parent category not found")
        err.status = 404
        throw err
    }

    if (currentCategoryId) {
        let ancestor = parentCategory
        const visited = new Set()

        while (ancestor && ancestor.parent) {
            const ancestorParentId = String(ancestor.parent)

            if (ancestorParentId === String(currentCategoryId)) {
                const err = new Error("this parent selection would create a circular category hierarchy")
                err.status = 400
                throw err
            }

            if (visited.has(ancestorParentId)) break
            visited.add(ancestorParentId)

            ancestor = await categoryModel.findById(ancestor.parent)
        }
    }

    return parentCategory
}

async function findCategoryBySlug(slug, isAdmin = false) {
    const cacheKey = `categories:bySlug:${slug}`
    const cached = await client.get(cacheKey)

    let data = cached ? JSON.parse(cached) : null

    if (!data) {
        data = await categoryModel
            .findOne({ slug })
            .populate("parent", "name slug")
            .populate("createdBy", "username email")
            .lean()

        if (!data) {
            const err = new Error("category not found")
            err.status = 404
            throw err
        }

        await client.set(cacheKey, JSON.stringify(data), { EX: 600 })
    }

    if (data.status === "inactive" && !isAdmin) {
        const err = new Error("category not found")
        err.status = 404
        throw err
    }

    return data
}

async function getAllCategories({ page = 1, limit = 20, search, inactive, sortBy = "sortOrder", sortOrder = "asc" }, isAdmin = false) {
    const includeInactive = Boolean(isAdmin && inactive)

    const skipCache = hasUnboundedParams({ search })
    const cacheKey = buildCacheKey("categories:list", {
        page, limit, search, includeInactive, sortBy, sortOrder
    })

    if (!skipCache) {
        const cached = await client.get(cacheKey)
        if (cached) return JSON.parse(cached)
    }

    const query = {}

    if (!includeInactive) {
        query.status = "active"
    }

    if (search) {
        query.name = { $regex: escapeRegex(search), $options: "i" }
    }

    const sortDirection = sortOrder === "desc" ? -1 : 1

    const data = await categoryModel
        .find(query)
        .populate("parent", "name slug")
        .populate("createdBy", "username email")
        .sort({ [sortBy]: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    const totalNumber = await categoryModel.countDocuments(query)
    const result = { data, totalNumber }

    if (!skipCache) {
        const hasNonDefaultFilters = Boolean(search || includeInactive || sortBy !== "sortOrder")
        await client.set(cacheKey, JSON.stringify(result), { EX: resolveTTL(hasNonDefaultFilters) })
    }

    return result
}

async function getCategoryCourses(slug, { page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc" }) {
    const categoryIds = await getDescendantCategoryIds(slug)

    const sortFieldMap = {
        createdAt: "createdAt",
        price: "finalPrice",
        students: "studentsCount",
        rating: "rating.average",
        title: "title"
    }
    const sortField = sortFieldMap[sortBy] || "createdAt"
    const sortDirection = sortOrder === "asc" ? 1 : -1

    const query = {
        category: { $in: categoryIds },
        isDeleted: false,
        status: "published"
    }

    const data = await courseModel
        .find(query)
        .sort({ [sortField]: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    const totalNumber = await courseModel.countDocuments(query)

    return { data, totalNumber }
}

async function createCategory({ name, description, parent, sortOrder, status }, file, userId) {
    const parentCategory = await validateParentCategory(parent)
    const parentId = parentCategory ? parentCategory._id : null

    await checkDuplicateSiblingName(name, parentId)

    const slug = await generateUniqueSlug(categoryModel, name)

    let uploadedIcon = null

    try {
        if (file) {
            const uploaded = await uploadImage(file, ICON_FOLDER)
            uploadedIcon = { url: uploaded.secure_url, publicId: uploaded.public_id }
        }

        const data = await categoryModel.create({
            name,
            slug,
            description,
            parent: parentId,
            createdBy: userId,
            icon: uploadedIcon || undefined,
            sortOrder,
            status
        })

        await invalidatePattern("categories:*")

        return data
    } catch (err) {
        if (uploadedIcon) {
            await deleteFile(uploadedIcon.publicId, "image").catch(() => { })
        }
        throw err
    }
}

async function updateCategory(slug, { name, description, parent, sortOrder, status }, file) {
    const foundCategory = await categoryModel.findOne({ slug })

    if (!foundCategory) {
        const err = new Error("category not found")
        err.status = 404
        throw err
    }

    let nextParentId = foundCategory.parent

    if (parent !== undefined) {
        if (parent === null) {
            nextParentId = null
        } else {
            const parentCategory = await validateParentCategory(parent, foundCategory._id)
            nextParentId = parentCategory._id
        }
    }

    const nextName = name !== undefined ? name : foundCategory.name

    if (name !== undefined || parent !== undefined) {
        await checkDuplicateSiblingName(nextName, nextParentId, foundCategory._id)
    }

    foundCategory.parent = nextParentId

    if (name !== undefined && name.trim() !== foundCategory.name) {
        foundCategory.name = name
        foundCategory.slug = await generateUniqueSlug(categoryModel, name)
    }

    if (description !== undefined) foundCategory.description = description
    if (sortOrder !== undefined) foundCategory.sortOrder = sortOrder
    if (status !== undefined) foundCategory.status = status

    const oldIconPublicId = foundCategory.icon?.publicId || null
    let newUploadedIcon = null

    try {
        if (file) {
            const uploaded = await uploadImage(file, ICON_FOLDER)
            newUploadedIcon = { url: uploaded.secure_url, publicId: uploaded.public_id }
            foundCategory.icon = newUploadedIcon
        }

        await foundCategory.save()
    } catch (err) {
        if (newUploadedIcon) {
            await deleteFile(newUploadedIcon.publicId, "image").catch(() => { })
        }
        throw err
    }

    if (newUploadedIcon && oldIconPublicId) {
        await deleteFile(oldIconPublicId, "image").catch(() => { })
    }

    await invalidatePattern("categories:*")
    await invalidatePattern("courses:*")

    return foundCategory
}

async function deleteCategory(slug, { force = false } = {}) {
    const foundCategory = await categoryModel.findOne({ slug })

    if (!foundCategory) {
        const err = new Error("category not found")
        err.status = 404
        throw err
    }

    const childCount = await categoryModel.countDocuments({ parent: foundCategory._id })

    if (childCount > 0) {
        const err = new Error("cannot delete a category that has child categories")
        err.status = 409
        throw err
    }

    const courseCount = await courseModel.countDocuments({ category: foundCategory._id, isDeleted: false })

    if (courseCount > 0 && !force) {
        const err = new Error("cannot delete a category that still has courses assigned to it, pass ?force=true to detach them")
        err.status = 409
        throw err
    }

    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        if (courseCount > 0 && force) {
            await courseModel.updateMany(
                { category: foundCategory._id },
                { $set: { category: null } },
                { session }
            )
        }

        await categoryModel.deleteOne({ _id: foundCategory._id }, { session })


        await session.commitTransaction()
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        session.endSession()
    }

    if (foundCategory.icon?.publicId) {
        await deleteFile(foundCategory.icon.publicId, "image").catch(() => { })
    }

    await invalidatePattern("categories:*")
    await invalidatePattern("courses:*")

    return foundCategory
}

module.exports = {
    findCategoryBySlug,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getDescendantCategoryIds,
    resolveCategoryId,
    getCategoryCourses
}