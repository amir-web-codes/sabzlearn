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

async function editById(lessonId, { title, description, duration, order }) {
    const data = await findById(lessonId)

    if (title !== undefined) data.title = title
    if (description !== undefined) data.description = description
    if (duration !== undefined) data.duration = duration
    if (order !== undefined) data.order = order

    await data.save()

    return data
}

async function deleteById(lessonId) {
    const result = await lessonModel.findByIdAndDelete(lessonId)

    if (!result) {
        const err = new Error("lesson not found")
        err.status = 404
        throw err
    }
}

async function findAll(page = 1, limit = 20) {
    const data = await lessonModel.find().skip((page - 1) * limit).limit(limit).lean()
    const totalNumber = await lessonModel.countDocuments()
    return { data, totalNumber }
}

async function findCourseLessons(course, page, limit) {
    const data = await lessonModel.find({ courseId: course._id }).skip((page - 1) * limit).limit(limit).lean()
    const totalNumber = await lessonModel.countDocuments({ courseId: course._id })

    return { data, totalNumber }
}

module.exports = {
    findById,
    createLesson,
    editById,
    deleteById,
    findAll,
    findCourseLessons
}