const courseModel = require("../models/courseModel")

async function findCourseBySlug(slug) {
    const data = await courseModel.find({ slug })

    if (!data.length) {
        const err = new Error("course not found")
        err.status = 404
        throw err
    }

    return data
}

module.exports = {
    findCourseBySlug
}