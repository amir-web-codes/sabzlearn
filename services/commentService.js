const commentModel = require("../models/commentModel")

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

async function deleteCommentById(id) {
    await commentModel.findByIdAndDelete(id)
}

async function updateCommentById(comment, id, { title, text, rating }) {
    let newRating;
    const avaiableRatings = ["very bad", "bad", "medium", "good", "very good"]

    if (avaiableRatings.includes(rating)) {
        newRating = rating
    } else {
        rating = comment.rating
    }

    await commentModel.findByIdAndUpdate(id, {
        $set: {
            title,
            text,
            rating: newRating
        }
    })
}

module.exports = {
    findUserComments,
    findCommentById,
    deleteCommentById,
    updateCommentById
}