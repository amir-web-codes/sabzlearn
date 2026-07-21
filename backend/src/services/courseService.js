const commentModel = require("../models/commentModel")
const courseModel = require("../models/courseModel")
const enrollmentModel = require("../models/enrollmentModel")
const lessonModel = require("../models/lessonModel")
const userModel = require("../models/userModel")
const slugify = require("slugify")

const invalidatePattern = require("../utils/invalidatePattern")
const { client } = require("../configs/redis")
const { hasUnboundedParams, buildCacheKey, resolveTTL } = require("../utils/listCache")

function generateSlug(title) {
    return slugify(title, {
        lower: true,
        strict: true,
        trim: true
    })
}

async function generateUniqueSlug(title) {
    const baseSlug = generateSlug(title)
    let slug = baseSlug
    let counter = 1

    while (await courseModel.exists({ slug })) {
        slug = `${baseSlug}-${counter}`
        counter++
    }

    return slug
}

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

async function createCourse({ title, description, price, discountPrecentage, level, language, status }, userId) {
    const slug = await generateUniqueSlug(title)
    let selectedPrice;

    if (price) {
        selectedPrice = Number(price)
    } else {
        selectedPrice = 0
    }

    const data = await courseModel.create({
        title,
        slug,
        description,
        price: selectedPrice,
        discountPrecentage: Number(discountPrecentage) || 0,
        instructor: userId,
        level,
        language,
        status,
        studentsCount: 0,
    })

    await invalidatePattern("courses:*")

    return data
}

async function removeCourseFromDb(slug, deletedById) {
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

    if (deletedData.matchedCount === 0) {
        const err = new Error("user not found")
        err.status = 404
        throw err
    }

    await invalidatePattern("courses:*")
}

async function updateCourse({ title, description, price, level, language, status }, slug) {

    const foundCourse = await courseModel.findOne({ slug })

    if (title !== undefined && title.trim() !== foundCourse.title) {
        foundCourse.title = title
        const sluged = await generateUniqueSlug(title)
        foundCourse.slug = sluged
    }

    if (description !== undefined) foundCourse.description = description
    if (price !== undefined) foundCourse.price = price
    if (level !== undefined) foundCourse.level = level
    if (language !== undefined) foundCourse.language = language
    if (status !== undefined) foundCourse.status = status

    await foundCourse.save()

    await invalidatePattern("courses:*")

    return foundCourse
}

async function getAllCourses(page = 1, limit = 20, filters = {}, sort = {}) {
    const { level, language, status, minPrice, maxPrice } = filters
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

    const skipCache = hasUnboundedParams({ minPrice, maxPrice })
    const cacheKey = buildCacheKey("courses:list", {
        page, limit, level, language, status, sortBy, sortOrder
    })

    if (!skipCache) {
        const cached = await client.get(cacheKey)
        if (cached) return JSON.parse(cached)
    }

    const query = { isDeleted: false }

    if (level) query.level = level
    if (language) query.language = language
    if (status) query.status = status

    if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {}
        if (minPrice !== undefined) query.price.$gte = Number(minPrice)
        if (maxPrice !== undefined) query.price.$lte = Number(maxPrice)
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
        const hasNonDefaultFilters = Boolean(level || language || status || sortBy !== "createdAt")
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

        if (foundLessons.length > 0) {
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

    foundLessons = await lessonModel.find({ courseId: foundCourse._id }).select("title description order duration").sort({ order: 1 }).lean()

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

module.exports = {
    findCourseBySlug,
    createCourse,
    removeCourseFromDb,
    updateCourse,
    getAllCourses,
    findCourseById,
    enrollUserInCourse,
    findCourseStudents,
    findCourseComments,
    updateCourseRating,
    getCourseDetails
}