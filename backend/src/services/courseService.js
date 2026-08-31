const commentModel = require("../models/commentModel")
const courseModel = require("../models/courseModel")
const enrollmentModel = require("../models/enrollmentModel")
const lessonModel = require("../models/lessonModel")
const userModel = require("../models/userModel")
const categoryService = require("./categoryService")
const tagService = require("./tagService")
const mongoose = require("mongoose")
const { generateUniqueSlug } = require("../utils/generateUniqueSlug")
const invalidatePattern = require("../utils/invalidatePattern")
const { client } = require("../configs/redis")
const { hasUnboundedParams, buildCacheKey, resolveTTL } = require("../utils/listCache")
const { uploadImage, uploadVideo, deleteFile } = require("./fileService")
const logger = require("../utils/logger")
const { buildRatingSortPipeline } = require("../utils/commentRating")

const DEFAULT_THUMBNAIL_URL = "/images/default-thumbnail.png"

function normalizeSlug(slug) {
    if (typeof slug !== "string" || !slug.trim()) {
        const err = new Error("no slug provided")
        err.status = 400
        throw err
    }

    return slug.toLowerCase().trim()
}

function toObjectId(value) {
    if (!value) return null

    if (value instanceof mongoose.Types.ObjectId) {
        return value
    }

    if (mongoose.Types.ObjectId.isValid(value)) {
        return new mongoose.Types.ObjectId(value)
    }

    return value
}

async function findCourseBySlug(slug, select) {
    const normalizedSlug = normalizeSlug(slug)

    let query = courseModel.findOne({
        slug: normalizedSlug,
        isDeleted: false
    })

    if (select) {
        query = query.select(select)
    }

    const data = await query

    if (!data) {
        const err = new Error("course not found")
        err.status = 404
        throw err
    }

    return data
}

async function findPublishedCourseBySlug(slug, select) {
    const normalizedSlug = normalizeSlug(slug)

    let query = courseModel.findOne({
        slug: normalizedSlug,
        isDeleted: false,
        status: "published"
    })

    if (select) {
        query = query.select(select)
    }

    const data = await query

    if (!data) {
        const err = new Error("course not found")
        err.status = 404
        throw err
    }

    return data
}

async function syncCourseStudentsCount(courseId, session = null) {
    let countQuery = enrollmentModel.countDocuments({ courseId, status: "active" })

    if (session) {
        countQuery = countQuery.session(session)
    }

    const totalNumber = await countQuery

    await courseModel.updateOne(
        {
            _id: courseId,
            isDeleted: false
        },
        {
            $set: {
                studentsCount: totalNumber
            }
        },
        session ? { session } : {}
    )

    return totalNumber
}

async function updateCourseRating(id, comments) {
    const foundCourse = await courseModel.findById(id)

    if (!foundCourse) {
        const err = new Error("course not found")
        err.status = 404
        throw err
    }

    let ratesNumber = 0

    comments.forEach(comment => {
        if (comment.rating === "Very Bad") ratesNumber += 1
        else if (comment.rating === "Bad") ratesNumber += 2
        else if (comment.rating === "Medium") ratesNumber += 3
        else if (comment.rating === "Good") ratesNumber += 4
        else if (comment.rating === "Very Good") ratesNumber += 5
    })

    foundCourse.rating.average = Number((ratesNumber / comments.length || 0).toFixed(2))
    foundCourse.rating.count = comments.length

    await foundCourse.save()
    await invalidatePattern("courses:*")
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

async function createCourse({ title, description, price, discountPercentage, level, language, status, category, tags }, userId) {
    const slug = await generateUniqueSlug(courseModel, title)
    const selectedPrice = price !== undefined ? Number(price) : 0

    let categoryId = null
    if (category) {
        categoryId = await categoryService.resolveCategoryId(category)
    }

    const tagIds = await tagService.validateTags(tags)

    const data = await courseModel.create({
        title,
        slug,
        description,
        price: selectedPrice,
        discountPercentage: Number(discountPercentage) || 0,
        instructor: userId,
        category: categoryId,
        tags: tagIds,
        level,
        language,
        status,
        studentsCount: 0
    })

    await invalidatePattern("courses:*")

    return data
}

async function deleteCourse(slug, deletedById) {
    const normalizedSlug = normalizeSlug(slug)
    const session = await mongoose.startSession()

    let deletedData
    let lessonVideoPublicIds = []

    try {
        session.startTransaction()

        deletedData = await courseModel.findOneAndUpdate(
            {
                slug: normalizedSlug,
                isDeleted: false
            },
            {
                $set: {
                    isDeleted: true,
                    deletedBy: deletedById,
                    deletedAt: new Date()
                }
            },
            {
                new: true,
                session
            }
        )

        if (!deletedData) {
            const err = new Error("course not found")
            err.status = 404
            throw err
        }

        const lessons = await lessonModel
            .find({ courseId: deletedData._id })
            .select("video.publicId")
            .session(session)
            .lean()

        lessonVideoPublicIds = lessons
            .map(lesson => lesson.video?.publicId)
            .filter(Boolean)

        await lessonModel.deleteMany(
            { courseId: deletedData._id },
            { session }
        )

        await session.commitTransaction()
    } catch (err) {
        if (session.inTransaction()) {
            await session.abortTransaction()
        }

        throw err
    } finally {
        await session.endSession()
    }

    const invalidationResults = await Promise.allSettled([
        invalidatePattern("courses:*"),
        invalidatePattern("lessons:*")
    ])

    invalidationResults.forEach(result => {
        if (result.status === "rejected") {
            logger.error(
                { err: result.reason, courseId: deletedData?._id },
                "failed to invalidate cache after course deletion"
            )
        }
    })

    const cleanupResults = await Promise.allSettled(
        lessonVideoPublicIds.map(publicId =>
            deleteFile(publicId, "video")
        )
    )

    cleanupResults.forEach((result, index) => {
        if (result.status === "rejected") {
            logger.error(
                {
                    err: result.reason,
                    courseId: deletedData?._id,
                    publicId: lessonVideoPublicIds[index]
                },
                "failed to delete lesson video after course deletion"
            )
        }
    })

    return deletedData
}

async function updateCourse(
    {
        title,
        description,
        price,
        discountPercentage,
        level,
        language,
        status,
        category,
        tags
    },
    slug
) {
    const normalizedSlug = normalizeSlug(slug)

    const foundCourse = await courseModel.findOne({
        slug: normalizedSlug,
        isDeleted: false
    })

    if (!foundCourse) {
        const err = new Error("course not found")
        err.status = 404
        throw err
    }

    if (title !== undefined && title !== foundCourse.title) {
        foundCourse.title = title
        foundCourse.slug = await generateUniqueSlug(
            courseModel,
            title,
            foundCourse._id
        )
    }

    if (description !== undefined) foundCourse.description = description
    if (price !== undefined) foundCourse.price = price
    if (discountPercentage !== undefined) {
        foundCourse.discountPercentage = discountPercentage
    }
    if (level !== undefined) foundCourse.level = level
    if (language !== undefined) foundCourse.language = language
    if (status !== undefined) foundCourse.status = status

    if (category !== undefined) {
        foundCourse.category = await categoryService.resolveCategoryId(category)
    }

    if (tags !== undefined) {
        foundCourse.tags = await tagService.validateTags(tags)
    }

    await foundCourse.save()
    await invalidatePattern("courses:*")

    return foundCourse
}

async function getAllCourses(page = 1, limit = 20, filters = {}, sort = {}, isAdmin = false) {
    const {
        level,
        language,
        status,
        minPrice,
        maxPrice,
        category
    } = filters

    const {
        sortBy = "createdAt",
        sortOrder = "desc"
    } = sort

    if (status && status !== "published" && !isAdmin) {
        const err = new Error("you don't have permission to filter by this status")
        err.status = 403
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

    let categoryIds = null

    if (category) {
        categoryIds = await categoryService.getDescendantCategoryIds(category)
    }

    const skipCache = hasUnboundedParams({ minPrice, maxPrice })

    const cacheKey = buildCacheKey("courses:list", {
        page,
        limit,
        level,
        language,
        status,
        category,
        sortBy,
        sortOrder
    })

    if (!skipCache) {
        const cached = await client.get(cacheKey)

        if (cached) {
            return JSON.parse(cached)
        }
    }

    const query = {
        isDeleted: false
    }

    if (level) query.level = level
    if (language) query.language = language

    if (status) {
        query.status = status
    } else {
        query.status = "published"
    }

    if (categoryIds) {
        query.category = {
            $in: categoryIds
        }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        query.finalPrice = {}

        if (minPrice !== undefined) {
            query.finalPrice.$gte = Number(minPrice)
        }

        if (maxPrice !== undefined) {
            query.finalPrice.$lte = Number(maxPrice)
        }
    }

    const data = await courseModel
        .find(query)
        .sort({ [sortField]: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    const totalNumber = await courseModel.countDocuments(query)

    const result = {
        data,
        totalNumber
    }

    if (!skipCache) {
        const hasNonDefaultFilters = Boolean(
            level ||
            language ||
            status ||
            category ||
            sortBy !== "createdAt"
        )

        await client.set(
            cacheKey,
            JSON.stringify(result),
            {
                EX: resolveTTL(hasNonDefaultFilters)
            }
        )
    }

    return result
}

async function enrollUserInCourse(slug, userId) {
    const foundCourse = await findCourseBySlug(slug)

    const userExists = await userModel.exists({
        _id: userId,
        isDeleted: false,
        isBanned: false
    })

    if (!userExists) {
        const err = new Error("no active user found")
        err.status = 404
        throw err
    }

    const today = new Date()

    await enrollmentModel.findOneAndUpdate(
        {
            userId,
            courseId: foundCourse._id
        },
        {
            $set: {
                status: "active",
                lastAccessedAt: today
            },
            $setOnInsert: {
                userId,
                courseId: foundCourse._id
            }
        },
        {
            upsert: true,
            setDefaultsOnInsert: true,
            runValidators: true
        }
    )

    await syncCourseStudentsCount(foundCourse._id)

    await Promise.all([
        invalidatePattern("courses:*"),
        invalidatePattern(`courses:users:${userId}:*`)
    ])
}

async function findCourseStudents(
    course,
    page = 1,
    limit = 20,
    sort = {}
) {
    const {
        sortBy = "createdAt",
        sortOrder = "desc"
    } = sort

    const allowedSortFields = [
        "createdAt",
        "lastAccessedAt"
    ]

    const sortField = allowedSortFields.includes(sortBy)
        ? sortBy
        : "createdAt"

    const sortDirection = sortOrder === "asc" ? 1 : -1

    const query = {
        courseId: course._id,
        status: "active"
    }

    const data = await enrollmentModel
        .find(query)
        .select("userId createdAt lastAccessedAt")
        .populate("userId", "username email")
        .sort({ [sortField]: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    const totalNumber = await enrollmentModel.countDocuments(query)

    return {
        data,
        totalNumber
    }
}

async function findCourseComments(
    course,
    page = 1,
    limit = 20,
    filters = {},
    sort = {}
) {
    const { rating } = filters

    const {
        sortBy = "createdAt",
        sortOrder = "desc"
    } = sort

    const query = {
        courseId: course._id
    }

    if (rating) {
        query.rating = rating
    }

    const sortDirection = sortOrder === "asc" ? 1 : -1

    let data

    if (sortBy === "rating") {
        data = await commentModel.aggregate(
            buildRatingSortPipeline(
                query,
                page,
                limit,
                sortDirection
            )
        )
    } else {
        data = await commentModel
            .find(query)
            .sort({ createdAt: sortDirection })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()
    }

    const totalNumber = await commentModel.countDocuments(query)

    return {
        data,
        totalNumber
    }
}

async function getRelatedCourses(course) {
    const courseId = toObjectId(course._id)

    const categoryId = toObjectId(
        course.category?._id ||
        course.category ||
        null
    )

    const tagIds = (course.tags || [])
        .map(tag => toObjectId(tag._id || tag))
        .filter(Boolean)

    const instructorId = toObjectId(
        course.instructor
    )

    const pipeline = [
        {
            $match: {
                _id: {
                    $ne: courseId
                },
                isDeleted: false,
                status: "published"
            }
        },
        {
            $addFields: {
                score: {
                    $add: [
                        {
                            $cond: [
                                {
                                    $and: [
                                        {
                                            $ne: [
                                                categoryId,
                                                null
                                            ]
                                        },
                                        {
                                            $eq: [
                                                "$category",
                                                categoryId
                                            ]
                                        }
                                    ]
                                },
                                2,
                                0
                            ]
                        },
                        {
                            $size: {
                                $setIntersection: [
                                    "$tags",
                                    tagIds
                                ]
                            }
                        },
                        {
                            $cond: [
                                {
                                    $eq: [
                                        "$instructor",
                                        instructorId
                                    ]
                                },
                                2,
                                0
                            ]
                        },
                        {
                            $cond: [
                                {
                                    $eq: [
                                        "$level",
                                        course.level
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    ]
                }
            }
        },
        {
            $match: {
                score: {
                    $gt: 0
                }
            }
        },
        {
            $sort: {
                score: -1,
                "rating.average": -1
            }
        },
        {
            $limit: 15
        },
        {
            $project: {
                title: 1,
                slug: 1,
                thumbnail: 1,
                price: 1,
                finalPrice: 1,
                level: 1,
                rating: 1,
                studentsCount: 1,
                score: 1
            }
        }
    ]

    return courseModel.aggregate(pipeline)
}

async function getCourseDetails(slug, lessonsIncluded = true) {
    const normalizedSlug = normalizeSlug(slug)

    const includeLessons = lessonsIncluded === true || lessonsIncluded === "true" || lessonsIncluded === undefined

    const courseKey = `courses:${normalizedSlug}:details`
    const relatedKey = `courses:${normalizedSlug}:related`
    const lessonsKey = `courses:${normalizedSlug}:lessons`

    const cachedCourse = await client.get(courseKey)

    let foundCourse = cachedCourse
        ? JSON.parse(cachedCourse)
        : null

    if (!foundCourse) {
        foundCourse = await courseModel
            .findOne({
                slug: normalizedSlug,
                isDeleted: false,
                status: "published"
            })
            .populate("category", "name slug")
            .populate("tags", "name slug")
            .lean()

        if (!foundCourse) {
            const err = new Error("course not found")
            err.status = 404
            throw err
        }

        await client.set(
            courseKey,
            JSON.stringify(foundCourse),
            {
                EX: 600
            }
        )
    }

    const cachedLessons = await client.get(lessonsKey)

    let foundLessons = cachedLessons
        ? JSON.parse(cachedLessons)
        : null

    if (!foundLessons) {
        foundLessons = await lessonModel
            .find({
                courseId: foundCourse._id
            })
            .select("title order duration")
            .sort({
                order: 1,
                createdAt: -1
            })
            .lean()

        await client.set(
            lessonsKey,
            JSON.stringify(foundLessons),
            {
                EX: 600
            }
        )
    }

    const totalDuration = foundLessons.reduce((sum, lesson) => sum + Number(lesson.duration || 0), 0)

    const relatedCoursesCached = await client.get(relatedKey)

    let relatedCourses = relatedCoursesCached
        ? JSON.parse(relatedCoursesCached) :
        null

    if (!relatedCourses) {
        relatedCourses = await getRelatedCourses(foundCourse)

        await client.set(
            relatedKey,
            JSON.stringify(relatedCourses),
            {
                EX: 600
            }
        )
    }

    const result = {
        foundCourse,
        totalDuration,
        relatedCourses
    }

    if (includeLessons) {
        result.foundLessons = foundLessons
    }

    return result
}

async function updateCourseThumbnail(slug, file) {
    if (!file) {
        const err = new Error("thumbnail file is required")
        err.status = 400
        throw err
    }

    const foundCourse = await findCourseBySlug(slug)
    const oldPublicId = foundCourse.thumbnail.publicId

    let uploadedFile

    try {
        uploadedFile = await uploadImage(file, `sabzlearn/courses/${foundCourse._id}/thumbnail`)

        foundCourse.thumbnail = {
            url: uploadedFile.secure_url,
            publicId: uploadedFile.public_id
        }

        await foundCourse.save()
    } catch (err) {
        if (uploadedFile?.public_id) {
            await deleteFile(uploadedFile.public_id, "image").catch(cleanupErr => {
                logger.error(
                    {
                        err: cleanupErr,
                        publicId: uploadedFile.public_id
                    },
                    "failed to cleanup uploaded course thumbnail"
                )
            })
        }

        throw err
    }

    if (oldPublicId) {
        await deleteFile(oldPublicId, "image").catch(err => {
            logger.error(
                {
                    err,
                    publicId: oldPublicId
                },
                "failed to delete previous course thumbnail"
            )
        })
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

    await deleteFile(oldPublicId, "image").catch(err => {
        logger.error(
            {
                err,
                publicId: oldPublicId
            },
            "failed to delete course thumbnail"
        )
    })

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

    let uploadedFile

    try {
        uploadedFile = await uploadVideo(file, `sabzlearn/courses/${foundCourse._id}/cover`)

        foundCourse.coverVideoURL = { url: uploadedFile.secure_url, publicId: uploadedFile.public_id }

        await foundCourse.save()
    } catch (err) {
        if (uploadedFile?.public_id) {
            await deleteFile(uploadedFile.public_id, "video").catch(cleanupErr => {
                logger.error(
                    {
                        err: cleanupErr,
                        publicId: uploadedFile.public_id
                    },
                    "failed to cleanup uploaded course cover video"
                )
            })
        }

        throw err
    }

    if (oldPublicId) {
        await deleteFile(oldPublicId, "video").catch(err => {
            logger.error(
                {
                    err,
                    publicId: oldPublicId
                },
                "failed to delete previous course cover video"
            )
        })
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

    await deleteFile(oldPublicId, "video").catch(err => {
        logger.error({
            err,
            publicId: oldPublicId
        },
            "failed to delete course cover video"
        )
    })

    await invalidatePattern("courses:*")

    return foundCourse
}

module.exports = {
    findCourseBySlug,
    findPublishedCourseBySlug,
    syncCourseStudentsCount,
    createCourse,
    deleteCourse,
    updateCourse,
    getAllCourses,
    enrollUserInCourse,
    findCourseStudents,
    findCourseComments,
    updateCourseRating,
    getRelatedCourses,
    getCourseDetails,
    updateCourseThumbnail,
    deleteCourseThumbnail,
    updateCourseCoverVideo,
    deleteCourseCoverVideo
}