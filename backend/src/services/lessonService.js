const lessonModel = require("../models/lessonModel")

const { client } = require("../configs/redis")
const invalidatePattern = require("../utils/invalidatePattern")

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
    const key = `lessons:page:${page}:limit:${limit}`
    const cached = await client.get(key)
    let totalNumber = 0

    let data = cached
        ? JSON.parse(cached)
        : null

    if (cached) {

        console.log("all lessons")

        totalNumber = Number(await client.get("lessons:totalNumber"))
        return { data, totalNumber }
    }


    data = await lessonModel.find().skip((page - 1) * limit).limit(limit).sort({ order: 1 }).lean()
    totalNumber = await lessonModel.countDocuments()

    await client.set(key, JSON.stringify(data), { EX: 600 })
    await client.set("lessons:totalNumber", totalNumber, { EX: 600 })

    return { data, totalNumber }
}

async function findCourseLessons(course, page = 1, limit = 20) {
    const key = `courses:${course.slug}:lessons:page:${page}:limit:${limit}`
    const cached = await client.get(key)
    let totalNumber = 0

    let data = cached
        ? JSON.parse(cached)
        : null

    if (cached) {

        console.log("course lessons")

        totalNumber = Number(await client.get("lessons:totalNumber"))
        return { data, totalNumber }
    }

    data = await lessonModel.find({ courseId: course._id }).skip((page - 1) * limit).limit(limit).lean()
    totalNumber = await lessonModel.countDocuments({ courseId: course._id })

    await client.set(key, JSON.stringify(data), { EX: 600 })
    await client.set(`courses:${course.slug}:lessons:totalNumber`, totalNumber, { EX: 600 })

    console.log(await client.keys("*"))

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