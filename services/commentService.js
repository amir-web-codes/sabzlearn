const commentModel = require("../models/commentModel")
const courseService = require("./courseService")

async function findUserComments(userId, page, limit) {
    const data = await commentModel.find({ authorId: userId }).skip((page - 1) * limit).limit(limit).lean()
    const totalNumber = data.length
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

async function updateRating(courseId, newRating, isDeleting = false) {
    const commentsCount = await commentModel.countDocuments({ courseId })
    let ratingNumber;

    if (newRating === "Very Bad") ratingNumber = 1
    else if (newRating === "Bad") ratingNumber = 2
    else if (newRating === "Medium") ratingNumber = 3
    else if (newRating === "Good") ratingNumber = 4
    else if (newRating === "Very Good") ratingNumber = 5
    else ratingNumber = 3

    await courseService.updateCourseRating(courseId, ratingNumber, commentsCount, isDeleting)
}

async function deleteCommentById(id) {
    const result = await commentModel.findByIdAndDelete(id)
    await updateRating(result.courseId, result.rating, true)
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
        $set: {
            title,
            text,
            rating: newRating
        }
    })

    await updateRating(result.courseId, newRating)
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

    await updateRating(foundCourse._id, selectedRating)
}

module.exports = {
    findUserComments,
    findCommentById,
    deleteCommentById,
    updateCommentById,
    createComment
}