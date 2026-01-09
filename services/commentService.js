const commentModel = require("../models/commentModel")

async function findUserComments(userId, page, limit) {
    const data = await commentModel.find({ authorId: userId }).skip((page - 1) * limit).limit(limit).lean()
    const totalNumber = data.length
    return { data, totalNumber }
}

module.exports = {
    findUserComments
}