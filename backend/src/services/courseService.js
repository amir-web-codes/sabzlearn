const commentModel = require("../models/commentModel")
const courseModel = require("../models/courseModel")
const enrollmentModel = require("../models/enrollmentModel")
const lessonModel = require("../models/lessonModel")
const slugify = require("slugify")

const invalidatePattern = require("../utils/invalidatePattern")
const { client } = require("../configs/redis")

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
        data = await courseModel.findOne({ slug }).select(select)
    } else {
        data = await courseModel.findOne({ slug })
    }

    if (!data) {
        const err = new Error("course not found")
        err.status = 404
        throw err
    }

    await invalidatePattern("courses:*")
    await invalidatePattern("lessons: *")

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

async function createCourse({ title, description, price, discountPrice, level, language, status }, userId) {
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
        discountPrice: discountPrice || 0,
        instructor: userId,
        level,
        language,
        status,
        studentsCount: 0,
    })

    await invalidatePattern("courses:*")

    return data
}

async function removeCourseFromDb(slug) {
    await courseModel.findOneAndDelete({ slug })

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

async function getAllCourses(page = 1, limit = 20) {
    const key = `courses:page:${page}:limit:${limit}`
    const cached = await client.get(key)
    let totalNumber = 0

    let data = cached
        ? JSON.parse(cached)
        : null

    if (cached) {

        totalNumber = Number(await client.get("courses:totalNumber"))
        return { data, totalNumber }
    }


    data = await courseModel.find().skip((page - 1) * limit).limit(limit).lean()
    totalNumber = await courseModel.countDocuments()

    await client.set(key, JSON.stringify(data), { EX: 600 })
    await client.set("courses:totalNumber", totalNumber, { EX: 600 })

    return { data, totalNumber }
}

async function enrollUserCourse(slug, userId) {
    const foundCourse = await findCourseBySlug(slug)

    const today = new Date()

    const foundEnrollment = await enrollmentModel.findOne({ courseId: foundCourse._id, userId })

    if (foundEnrollment) {
        foundEnrollment.status = "active"
        foundEnrollment.lastAccessedAt = today
        return await foundEnrollment.save()
    }

    await enrollmentModel.create({
        userId,
        courseId: foundCourse._id,
        status: "active",
        enrolledAt: today,
        lastAccessedAt: today
    })

    const totalNumber = await enrollmentModel.countDocuments({ courseId: foundCourse._id })

    foundCourse.studentsCount = totalNumber
    await foundCourse.save()
}

async function cancelEnrollStatus(slug, userId) {
    const foundCourse = await findCourseBySlug(slug)
    const foundEnrollment = await findEnrollment(foundCourse._id, userId)

    foundEnrollment.status = "cancelled"
    await foundEnrollment.save()
}

async function findCourseStudents(course, page = 1, limit = 20) {

    const data = await enrollmentModel.find({ courseId: course._id }).select("userId").populate("userId", "username email").skip((page - 1) * limit).limit(limit).lean()
    const totalNumber = course.studentsCount
    return { data, totalNumber }
}

async function findCourseComments(course, page = 1, limit = 20) {
    const data = await commentModel.find({ courseId: course._id }).skip((page - 1) * limit).limit(limit).lean()
    const totalNumber = await commentModel.countDocuments({ courseId: course._id })
    return { data, totalNumber }
}

async function getCourseDetails(slug, lessonsIncluded = "true") {
    const courseKey = `courses:${slug}:lessons:${lessonsIncluded}`
    const lessonsKey = `courses:${slug}:getLessons`

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
    enrollUserCourse,
    cancelEnrollStatus,
    findCourseStudents,
    findCourseComments,
    updateCourseRating,
    getCourseDetails
}