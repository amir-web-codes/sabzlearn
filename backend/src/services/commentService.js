const commentModel = require("../models/commentModel")
const courseService = require("./courseService")

async function findUserComments(userId, page, limit, filters = {}, sort = {}) {
    const { rating } = filters
    const { sortBy = "createdAt", sortOrder = "desc" } = sort

    const query = { authorId: userId }
    if (rating) query.rating = rating

    const sortDirection = sortOrder === "asc" ? 1 : -1

    const data = await commentModel
        .find(query)
        .sort({ [sortBy]: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    const totalNumber = await commentModel.countDocuments(query)
    return { data, totalNumber }
}

async function findCommentById(id) {
    const data = await commentModel.findById(id)

    if (!data) {
        const err = new Error("comment not found")
        err.status = 404
        throw err
    }

    return data
}

async function updateRating(courseId) {
    const courseComments = await commentModel.find({ courseId }).select("rating").lean()
    await courseService.updateCourseRating(courseId, courseComments)
}

async function deleteCommentById(id) {
    const result = await commentModel.findByIdAndDelete(id)
    await updateRating(result.courseId)
}

async function updateCommentById(id, { title, text, rating }) {
    const query = {}

    if (title !== undefined) query.title = title
    if (text !== undefined) query.text = text
    if (rating !== undefined) query.rating = rating

    const result = await commentModel.findOneAndUpdate(
        { _id: id },
        { $set: query },
        { runValidators: true }
    )

    if (!result) {
        const err = new Error("comment not found")
        err.status = 404
        throw err
    }

    if (rating !== undefined) {
        await updateRating(result.courseId)
    }
}

async function createComment(slug, userId, { title, text, rating }) {
    const foundCourse = await courseService.findCourseBySlug(slug)

    await commentModel.create({
        title,
        text,
        authorId: userId,
        courseId: foundCourse._id,
        rating
    })

    await updateRating(foundCourse._id)
}

module.exports = {
    findUserComments,
    findCommentById,
    deleteCommentById,
    updateCommentById,
    createComment
}