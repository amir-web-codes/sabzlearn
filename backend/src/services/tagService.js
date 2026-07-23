const mongoose = require("mongoose")

const tagModel = require("../models/tagModel")
const courseModel = require("../models/courseModel")

const { generateUniqueSlug, generateSlug } = require("../utils/generateUniqueSlug")
const invalidatePattern = require("../utils/invalidatePattern")
const { client } = require("../configs/redis")

const { hasUnboundedParams, buildCacheKey, resolveTTL } = require("../utils/listCache")

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

async function checkDuplicateTag(name, excludeId = null) {
    const query = {
        $or: [
            { name: { $regex: `^${escapeRegex(name.trim())}$`, $options: "i" } },
            { slug: generateSlug(name) }
        ]
    }

    if (excludeId) {
        query._id = { $ne: excludeId }
    }

    const duplicate = await tagModel.findOne(query)

    if (duplicate) {
        const err = new Error("a tag with this name already exists")
        err.status = 409
        throw err
    }
}

async function findTagBySlug(slug) {
    const cacheKey = `tags:bySlug:${slug}`
    const cached = await client.get(cacheKey)

    if (cached) return JSON.parse(cached)

    const data = await tagModel.findOne({ slug }).lean()

    if (!data) {
        const err = new Error("tag not found")
        err.status = 404
        throw err
    }

    await client.set(cacheKey, JSON.stringify(data), { EX: 600 })

    return data
}

async function createTag({ name }, userId) {
    await checkDuplicateTag(name)

    const slug = await generateUniqueSlug(tagModel, name)

    const data = await tagModel.create({
        name,
        slug,
        createdBy: userId
    })

    await invalidatePattern("tags:*")

    return data
}

async function updateTag(slug, { name }) {
    const foundTag = await tagModel.findOne({ slug })

    if (!foundTag) {
        const err = new Error("tag not found")
        err.status = 404
        throw err
    }

    if (name !== undefined && name.trim() !== foundTag.name) {
        await checkDuplicateTag(name, foundTag._id)

        foundTag.name = name
        foundTag.slug = await generateUniqueSlug(tagModel, name)
    }

    await foundTag.save()

    await invalidatePattern("tags:*")

    return foundTag
}

async function deleteTag(slug, { force = false } = {}) {
    const foundTag = await tagModel.findOne({ slug })

    if (!foundTag) {
        const err = new Error("tag not found")
        err.status = 404
        throw err
    }

    const courseCount = await courseModel.countDocuments({ tags: foundTag._id, isDeleted: false })

    if (courseCount > 0 && !force) {
        const err = new Error("cannot delete a tag that still has courses assigned to it, pass ?force=true to detach them")
        err.status = 409
        throw err
    }

    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        if (courseCount > 0 && force) {
            await courseModel.updateMany(
                { tags: foundTag._id },
                { $pull: { tags: foundTag._id } },
                { session }
            )
        }

        await tagModel.deleteOne({ _id: foundTag._id }, { session })

        await session.commitTransaction()
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        session.endSession()
    }

    await invalidatePattern("tags:*")
    await invalidatePattern("courses:*")

    return foundTag
}

async function getTagCourses(slug, { page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc" }) {
    const foundTag = await tagModel.findOne({ slug }).select("_id")

    if (!foundTag) {
        const err = new Error("tag not found")
        err.status = 404
        throw err
    }

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
        tags: foundTag._id,
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

async function getAllTags({ page = 1, limit = 20, search, sortBy = "createdAt", sortOrder = "desc" }) {
    const cacheKey = buildCacheKey("tags:list", { page, limit, search, sortBy, sortOrder })

    const cached = await client.get(cacheKey)
    if (cached) return JSON.parse(cached)

    const query = {}
    if (search) {
        query.name = { $regex: escapeRegex(search), $options: "i" }
    }

    const sortDirection = sortOrder === "asc" ? 1 : -1

    const data = await tagModel
        .find(query)
        .sort({ [sortBy]: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    const totalNumber = await tagModel.countDocuments(query)
    const result = { data, totalNumber }

    const hasNonDefaultFilters = Boolean(search || sortBy !== "createdAt")
    await client.set(cacheKey, JSON.stringify(result), { EX: resolveTTL(hasNonDefaultFilters) })

    return result
}

async function validateTags(tagIds) {
    if (!tagIds || tagIds.length === 0) return []

    const foundTags = await tagModel.find({ _id: { $in: tagIds } }).select("_id")

    if (foundTags.length !== tagIds.length) {
        const err = new Error("one or more tags not found")
        err.status = 404
        throw err
    }

    return foundTags.map(t => t._id)
}

module.exports = {
    findTagBySlug,
    createTag,
    updateTag,
    deleteTag,
    getTagCourses,
    getAllTags,
    validateTags
}