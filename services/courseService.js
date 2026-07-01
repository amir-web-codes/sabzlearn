const commentModel = require("../models/commentModel")
const courseModel = require("../models/courseModel")
const enrollmentModel = require("../models/enrollmentModel")
const lessonModel = require("../models/lessonModel")
const slugify = require("slugify")

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

async function createCourse({ title, description, price, level, language }, userId) {
    const slug = await generateUniqueSlug(title)
    let selectedPrice;

    if (price) {
        selectedPrice = Number(price)
    } else {
        selectedPrice = 0
    }

    return await courseModel.create({
        title,
        slug,
        description,
        price: selectedPrice,
        instructor: userId,
        level,
        language,
        studentsCount: 0,
    })
}

async function removeCourseFromDb(slug) {
    return await courseModel.findOneAndDelete({ slug })
}

async function updateCourse({ title, description, price, level, language }, slug) {

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

    await foundCourse.save()
}

async function getAllCourses(page = 1, limit = 20) {
    const data = await courseModel.find().skip((page - 1) * limit).limit(limit).lean()
    const totalNumber = await courseModel.countDocuments()
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

async function getCourseDetails(slug, lessonsIncluded = true) {
    const foundCourse = await findCourseBySlug(slug)

    if (lessonsIncluded === "true") {
        const foundLessons = await lessonModel.find({ courseId: foundCourse._id }).select("title description order duration").sort({ order: 1 }).lean()

        let totalDuration = 0
        foundLessons.map(lesson => totalDuration += lesson.duration)

        return { foundCourse, foundLessons, totalDuration }
    }

    return { foundCourse }
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