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

async function updateCommentById(comment, id, { title, text, rating }) {
    let newRating;
    const avaiableRatings = ["Very Bad", "Bad", "Medium", "Good", "Very Good"]

    if (avaiableRatings.includes(rating)) {
        newRating = rating
    } else {
        newRating = comment.rating
    }

    const result = await commentModel.findByIdAndUpdate(id, {
        $set: { title, text, rating: newRating }
    })

    await updateRating(result.courseId)
}

async function createComment(slug, userId, { title, text, rating }) {
    const foundCourse = await courseService.findCourseBySlug(slug)

    let selectedRating;
    const avaiableRatings = ["Very Bad", "Bad", "Medium", "Good", "Very Good"]

    if (avaiableRatings.includes(rating)) {
        selectedRating = rating
    } else {
        selectedRating = "Medium"
    }

    await commentModel.create({
        title,
        text,
        authorId: userId,
        courseId: foundCourse._id,
        rating: selectedRating
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