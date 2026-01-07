const courseService = require("../services/courseService")
const asyncWrapper = require("../utils/asyncWrapper")

async function getCourseBySlug(req, res) {
    const course = await courseService.findCourseBySlug(req.slug)

    res.json({
        success: true,
        message: "course found successfuly",
        data: course
    })
}

module.exports = {
    getCourseBySlug: asyncWrapper(getCourseBySlug)
}