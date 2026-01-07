const courseService = require("../services/courseService")
const asyncWrapper = require("../utils/asyncWrapper")

async function getCourseBySlug(req, res) {
    const course = await courseService.findCourseBySlug(req.params.slug)

    res.json({
        success: true,
        message: "course found successfuly",
        data: course
    })
}

async function createCourse(req, res) {
    await courseService.createCourse(req.body, req.user.id)

    res.status(201).json({
        success: true,
        message: "course created successfuly"
    })
}

async function deleteCourse(req, res) {
    await courseService.removeCourseFromDb(req.params.slug)

    res.json({
        success: true,
        message: "course deleted successfuly"
    })
}

module.exports = {
    getCourseBySlug: asyncWrapper(getCourseBySlug),
    createCourse: asyncWrapper(createCourse),
    deleteCourse: asyncWrapper(deleteCourse)
}