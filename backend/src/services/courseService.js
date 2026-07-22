const commentModel = require("../models/commentModel")
const courseModel = require("../models/courseModel")
const enrollmentModel = require("../models/enrollmentModel")
const lessonModel = require("../models/lessonModel")
const userModel = require("../models/userModel")
const categoryService = require("../services/categoryService")


const generateUniqueSlug = require("../utils/generateUniqueSlug")
const invalidatePattern = require("../utils/invalidatePattern")
const { client } = require("../configs/redis")
const { hasUnboundedParams, buildCacheKey, resolveTTL } = require("../utils/listCache")
const { uploadImage, uploadVideo, deleteFile } = require("./fileService")

const DEFAULT_THUMBNAIL_URL = "/images/default-thumbnail.png"



async function findCourseBySlug(slug, select) {
    let data;

    if (!slug) {
        const err = new Error("no slug provided")
        err.status = 400
        throw err
    }

    if (select) {
        data = await courseModel.findOne({ slug, isDeleted: false }).select(select)
    } else {
        data = await courseModel.findOne({ slug, isDeleted: false })
    }

    if (!data) {
        const err = new Error("course not found")
        err.status = 404
        throw err
    }

    return data
}

async function findCourseById(id) {
    const data = await courseModel.findById(id)

    if (!data) {
        const err = new Error("course not found")
        err.status = 404
        throw err
    }

    return data
}

async function updateCourseRating(id, comments) {
    const foundCourse = await courseModel.findById(id)

    let ratesNumber = 0;
    comments.forEach(comment => {
        if (comment.rating === "Very Bad") ratesNumber += 1
        else if (comment.rating === "Bad") ratesNumber += 2
        else if (comment.rating === "Medium") ratesNumber += 3
        else if (comment.rating === "Good") ratesNumber += 4
        else if (comment.rating === "Very Good") ratesNumber += 5
    })

    foundCourse.rating.average = (ratesNumber / comments.length || 0).toFixed(2)
    foundCourse.rating.count = comments.length

    await foundCourse.save()
}

async function findEnrollment(courseId, userId) {
    const foundEnrollment = await enrollmentModel.findOne({ courseId, userId })

    if (!foundEnrollment) {
        const err = new Error("user not registered in this course")
        err.status = 404
        throw err
    }

    return foundEnrollment
}

async function createCourse({ title, description, price, discountPrecentage, level, language, status, category }, userId) {
    const slug = await generateUniqueSlug(courseModel, title)
    let selectedPrice;

    if (price) {
        selectedPrice = Number(price)
    } else {
        selectedPrice = 0
    }

    let categoryId = null
    if (category) {
        categoryId = await categoryService.resolveCategoryId(category)
    }

    const data = await courseModel.create({
        title,
        slug,
        description,
        price: selectedPrice,
        discountPrecentage: Number(discountPrecentage) || 0,
        instructor: userId,
        category: categoryId,
        level,
        language,
        status,
        studentsCount: 0,
    })

    await invalidatePattern("courses:*")

    return data
}

async function deleteCourse(slug, deletedById) {

    const deletedData = await courseModel.findOneAndUpdate(
        {
            slug
        },
        {
            $set: {
                isDeleted: true,
                deletedBy: deletedById,
                deletedAt: new Date(Date.now())
            }
        }
    )

    await lessonModel.deleteMany({ courseId: deletedData._id })

    await invalidatePattern("courses:*")
}

async function updateCourse({ title, description, price, discountPrecentage, level, language, status, category }, slug) {

    const foundCourse = await courseModel.findOne({ slug })

    if (!foundCourse) {
        const err = new Error("course not found")
        err.status = 404
        throw err
    }

    if (title !== undefined && title.trim() !== foundCourse.title) {
        foundCourse.title = title
        const sluged = await generateUniqueSlug(courseModel, title)
        foundCourse.slug = sluged
    }

    if (description !== undefined) foundCourse.description = description
    if (price !== undefined) foundCourse.price = price
    if (discountPrecentage !== undefined) foundCourse.discountPrecentage = discountPrecentage
    if (level !== undefined) foundCourse.level = level
    if (language !== undefined) foundCourse.language = language
    if (status !== undefined) foundCourse.status = status

    if (category !== undefined) {
        foundCourse.category = await categoryService.resolveCategoryId(category)
    }

    await foundCourse.save()

    await invalidatePattern("courses:*")

    return foundCourse
}

async function getAllCourses(page = 1, limit = 20, filters = {}, sort = {}, isAdmin = false) {
    const { level, language, status, minPrice, maxPrice, category } = filters
    const { sortBy = "createdAt", sortOrder = "desc" } = sort

    const sortFieldMap = {
        createdAt: "createdAt",
        price: "finalPrice",
        students: "studentsCount",
        rating: "rating.average",
        title: "title"
    }
    const sortField = sortFieldMap[sortBy] || "createdAt"
    const sortDirection = sortOrder === "asc" ? 1 : -1

    let categoryIds = null
    if (category) {
        categoryIds = await categoryService.getDescendantCategoryIds(category)
    }

    const skipCache = hasUnboundedParams({ minPrice, maxPrice })
    const cacheKey = buildCacheKey("courses:list", {
        page, limit, level, language, status, category, sortBy, sortOrder
    })

    if (!skipCache) {
        const cached = await client.get(cacheKey)
        if (cached) return JSON.parse(cached)
    }

    const query = { isDeleted: false }

    if (level) query.level = level
    if (language) query.language = language

    if (status) {
        if (status !== "published" && !isAdmin) {
            const err = new Error("you don't have permission to filter by this status")
            err.status = 403
            throw err
        }
        query.status = status
    } else {
        query.status = "published"
    }

    if (categoryIds) query.category = { $in: categoryIds }

    if (minPrice !== undefined || maxPrice !== undefined) {
        query.finalPrice = {}
        if (minPrice !== undefined) query.finalPrice.$gte = Number(minPrice)
        if (maxPrice !== undefined) query.finalPrice.$lte = Number(maxPrice)
    }

    const data = await courseModel
        .find(query)
        .sort({ [sortField]: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    const totalNumber = await courseModel.countDocuments(query)
    const result = { data, totalNumber }

    if (!skipCache) {
        const hasNonDefaultFilters = Boolean(level || language || status || category || sortBy !== "createdAt")
        await client.set(cacheKey, JSON.stringify(result), { EX: resolveTTL(hasNonDefaultFilters) })
    }

    return result
}

async function enrollUserInCourse(slug, userId) {
    const foundCourse = await findCourseBySlug(slug)

    const userExists = await userModel.exists({ _id: userId })
    if (!userExists) {
        const err = new Error("user not found")
        err.status = 404
        throw err
    }

    const today = new Date()

    await enrollmentModel.findOneAndUpdate(
        { userId, courseId: foundCourse._id },
        {
            $set: { status: "active", lastAccessedAt: today },
            $setOnInsert: { userId, courseId: foundCourse._id }
        },
        { upsert: true, setDefaultsOnInsert: true, runValidators: true }
    )

    const totalNumber = await enrollmentModel.countDocuments({ courseId: foundCourse._id })

    foundCourse.studentsCount = totalNumber
    await foundCourse.save()
}

async function findCourseStudents(course, page = 1, limit = 20, sort = {}) {
    const { sortBy = "createdAt", sortOrder = "desc" } = sort

    const allowedSortFields = ["createdAt", "lastAccessedAt"]
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt"
    const sortDirection = sortOrder === "asc" ? 1 : -1

    const data = await enrollmentModel
        .find({ courseId: course._id })
        .select("userId createdAt lastAccessedAt")
        .populate("userId", "username email")
        .sort({ [sortField]: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    const totalNumber = course.studentsCount
    return { data, totalNumber }
}

async function findCourseComments(course, page = 1, limit = 20, filters = {}, sort = {}) {
    const { rating } = filters
    const { sortBy = "createdAt", sortOrder = "desc" } = sort

    const query = { courseId: course._id }
    if (rating) query.rating = rating

    const allowedSortFields = ["createdAt", "rating"]
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt"
    const sortDirection = sortOrder === "asc" ? 1 : -1

    const data = await commentModel
        .find(query)
        .sort({ [sortField]: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    const totalNumber = await commentModel.countDocuments(query)
    return { data, totalNumber }
}

async function getCourseDetails(slug, lessonsIncluded = "true") {
    const courseKey = `courses:${slug}:lessons:${lessonsIncluded}`
    const lessonsKey = `courses:${slug}:lessons`

    const cached = await client.get(courseKey)


    let foundLessons;
    let totalDuration = 0;

    let foundCourse = cached
        ? JSON.parse(cached)
        : null

    if (foundCourse) {

        const cachedLessons = await client.get(lessonsKey);

        foundLessons = cachedLessons
            ? JSON.parse(cachedLessons)
            : null

        if (foundLessons && foundLessons.length > 0) {
            totalDuration = foundLessons.reduce(
                (sum, lesson) => sum + lesson.duration,
                0
            )
        }

        if (lessonsIncluded === "true") {
            return { foundCourse, foundLessons, totalDuration }
        }

        return { foundCourse, totalDuration }
    }

    foundCourse = await findCourseBySlug(slug)

    foundLessons = await lessonModel.find({ courseId: foundCourse._id }).select("title description order duration").sort({ order: 1, createdAt: -1 }).lean()

    if (foundLessons.length > 0) {
        totalDuration = foundLessons.reduce(
            (sum, lesson) => sum + lesson.duration,
            0
        )
    }

    await client.set(courseKey, JSON.stringify(foundCourse), { EX: 600 })
    await client.set(lessonsKey, JSON.stringify(foundLessons), { EX: 600 })

    if (lessonsIncluded === "true") {
        return { foundCourse, foundLessons, totalDuration }
    }



    return { foundCourse, totalDuration }
}

async function updateCourseThumbnail(slug, file) {
    if (!file) {
        const err = new Error("thumbnail file is required")
        err.status = 400
        throw err
    }

    const foundCourse = await findCourseBySlug(slug)
    const oldPublicId = foundCourse.thumbnail.publicId

    const uploadedFile = await uploadImage(file, `sabzlearn/courses/${foundCourse._id}/thumbnail`)

    foundCourse.thumbnail = {
        url: uploadedFile.secure_url,
        publicId: uploadedFile.public_id
    }

    await foundCourse.save()

    if (oldPublicId) {
        await deleteFile(oldPublicId, "image").catch(() => { })
    }

    await invalidatePattern("courses:*")

    return foundCourse
}

async function deleteCourseThumbnail(slug) {
    const foundCourse = await findCourseBySlug(slug)

    if (!foundCourse.thumbnail.publicId) {
        const err = new Error("this course doesn't have a custom thumbnail")
        err.status = 409
        throw err
    }

    const oldPublicId = foundCourse.thumbnail.publicId

    foundCourse.thumbnail = {
        url: DEFAULT_THUMBNAIL_URL,
        publicId: null
    }

    await foundCourse.save()
    await deleteFile(oldPublicId, "image").catch(() => { })

    await invalidatePattern("courses:*")

    return foundCourse
}

async function updateCourseCoverVideo(slug, file) {
    if (!file) {
        const err = new Error("cover video file is required")
        err.status = 400
        throw err
    }

    const foundCourse = await findCourseBySlug(slug)
    const oldPublicId = foundCourse.coverVideoURL.publicId

    const uploadedFile = await uploadVideo(file, `sabzlearn/courses/${foundCourse._id}/cover`)

    foundCourse.coverVideoURL = {
        url: uploadedFile.secure_url,
        publicId: uploadedFile.public_id
    }

    await foundCourse.save()

    if (oldPublicId) {
        await deleteFile(oldPublicId, "video").catch(() => { })
    }

    await invalidatePattern("courses:*")

    return foundCourse
}

async function deleteCourseCoverVideo(slug) {
    const foundCourse = await findCourseBySlug(slug)

    if (!foundCourse.coverVideoURL.publicId) {
        const err = new Error("this course doesn't have a cover video")
        err.status = 409
        throw err
    }

    const oldPublicId = foundCourse.coverVideoURL.publicId

    foundCourse.coverVideoURL = {
        url: null,
        publicId: null
    }

    await foundCourse.save()
    await deleteFile(oldPublicId, "video").catch(() => { })

    await invalidatePattern("courses:*")

    return foundCourse
}

module.exports = {
    findCourseBySlug,
    createCourse,
    deleteCourse,
    updateCourse,
    getAllCourses,
    findCourseById,
    enrollUserInCourse,
    findCourseStudents,
    findCourseComments,
    updateCourseRating,
    getCourseDetails,
    updateCourseThumbnail,
    deleteCourseThumbnail,
    updateCourseCoverVideo,
    deleteCourseCoverVideo
}