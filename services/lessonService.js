const lessonModel = require("../models/lessonModel")

async function findById(id) {
    const data = await lessonModel.findById(id)

    if (!data) {
        const err = new Error("lesson not found")
        err.status = 404
        throw err
    }

    return data
}

async function createLesson(userId, courseId, { title, description, duration, order }) {
    const lastOrder = await lessonModel.find({ courseId }).sort({ order: -1 }).limit(1)
    const newOrder = lastOrder.length ? lastOrder[0].order + 100 : 100

    return await lessonModel.create({
        title,
        description,
        courseId,
        publisherId: userId,
        duration: duration,
        order: order !== undefined ? order : newOrder
    })
}

async function editLesson(lessonId, { title, description, duration, order }) {
    const data = await findById(lessonId)

    if (title !== undefined) data.title = title
    if (description !== undefined) data.description = description
    if (duration !== undefined) data.duration = duration
    if (order !== undefined) data.order = order

    await data.save()

    return data
}

module.exports = {
    findById,
    createLesson,
    editLesson
}