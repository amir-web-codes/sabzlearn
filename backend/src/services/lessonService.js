const lessonModel = require("../models/lessonModel")

const { client } = require("../configs/redis")
const invalidatePattern = require("../utils/invalidatePattern")
const { buildCacheKey, resolveTTL } = require("../utils/listCache")
const { uploadVideo, deleteFile } = require("./fileService")

async function findById(id) {
    const data = await lessonModel.findById(id)

    if (!data) {
        const err = new Error("lesson not found")
        err.status = 404
        throw err
    }

    return data
}

async function createLesson(userId, courseId, { title, description, duration, order }, slug, file) {
    const lastOrder = await lessonModel.find({ courseId }).sort({ order: -1 }).limit(1)
    const newOrder = lastOrder.length ? lastOrder[0].order + 100 : 100

    let video = { url: null, publicId: null }

    if (file) {
        const uploadedFile = await uploadVideo(file, `sabzlearn/lessons/${courseId}`)
        video = { url: uploadedFile.secure_url, publicId: uploadedFile.public_id }
    }

    await invalidatePattern(`courses:${slug}:*`)

    return await lessonModel.create({
        title,
        description,
        courseId,
        publisherId: userId,
        duration: duration,
        order: order !== undefined ? order : newOrder,
        video
    })
}

async function editById(lessonId, { title, description, duration, order, removeVideo }, file) {
    const data = await findById(lessonId)

    if (title !== undefined) data.title = title
    if (description !== undefined) data.description = description
    if (duration !== undefined) data.duration = duration
    if (order !== undefined) data.order = order

    const oldPublicId = data.video.publicId

    if (file) {
        const uploadedFile = await uploadVideo(file, `sabzlearn/lessons/${data.courseId}`)
        data.video = { url: uploadedFile.secure_url, publicId: uploadedFile.public_id }
    } else if (removeVideo === "true" && oldPublicId) {
        data.video = { url: null, publicId: null }
    }

    await data.save()

    if (oldPublicId && (file || removeVideo === "true")) {
        await deleteFile(oldPublicId, "video").catch(() => { })
    }

    await invalidatePattern("courses:*")
    await invalidatePattern("lessons:*")

    return data
}

async function deleteById(lessonId) {
    const result = await lessonModel.findByIdAndDelete(lessonId)

    if (!result) {
        const err = new Error("lesson not found")
        err.status = 404
        throw err
    }

    if (result.video.publicId) {
        await deleteFile(result.video.publicId, "video").catch(() => { })
    }

    await invalidatePattern("courses:*")
    await invalidatePattern("lessons:*")
}

async function findAll(page = 1, limit = 20, filters = {}, sort = {}) {
    const { courseId } = filters
    const { sortBy = "order", sortOrder = "desc" } = sort

    const allowedSortFields = ["order", "duration", "createdAt"]
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "order"
    const sortDirection = sortOrder === "asc" ? 1 : -1

    const skipCache = Boolean(courseId)
    const cacheKey = buildCacheKey("lessons:list", { page, limit, sortBy, sortOrder })

    if (!skipCache) {
        const cached = await client.get(cacheKey)
        if (cached) return JSON.parse(cached)
    }

    const query = {}
    if (courseId) query.courseId = courseId

    const data = await lessonModel
        .find(query)
        .sort({ [sortField]: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    const totalNumber = await lessonModel.countDocuments(query)
    const result = { data, totalNumber }

    if (!skipCache) {
        const hasNonDefaultFilters = sortBy !== "order" || sortOrder !== "desc"
        await client.set(cacheKey, JSON.stringify(result), { EX: resolveTTL(hasNonDefaultFilters) })
    }

    return result
}

async function findCourseLessons(course, page = 1, limit = 20, sort = {}) {
    const { sortBy = "order", sortOrder = "desc" } = sort

    const allowedSortFields = ["order", "duration", "createdAt"]
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "order"
    const sortDirection = sortOrder === "asc" ? 1 : -1

    const cacheKey = buildCacheKey(`courses:${course.slug}:lessons:list`, { page, limit, sortBy, sortOrder })

    const cached = await client.get(cacheKey)
    if (cached) return JSON.parse(cached)

    const data = await lessonModel
        .find({ courseId: course._id })
        .sort({ [sortField]: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    const totalNumber = await lessonModel.countDocuments({ courseId: course._id })
    const result = { data, totalNumber }

    const hasNonDefaultFilters = sortBy !== "order" || sortOrder !== "desc"
    await client.set(cacheKey, JSON.stringify(result), { EX: resolveTTL(hasNonDefaultFilters) })

    return result
}

module.exports = {
    findById,
    createLesson,
    editById,
    deleteById,
    findAll,
    findCourseLessons
}