const asyncWrapper = require("../utils/asyncWrapper")
const sendError = require("../utils/sendError")

const lessonService = require("../services/lessonService")
const courseService = require("../services/courseService")

async function getLessonById(req, res) {
    const data = await lessonService.findById(req.params.id)

    res.json({
        success: true,
        message: "lesson fetched successfully",
        data
    })
}

async function createNewLesson(req, res) {
    const foundCourse = await courseService.findCourseBySlug(req.params.slug)

    const data = await lessonService.createLesson(req.user.id, foundCourse._id, req.body)

    res.status(201).json({
        success: true,
        message: "lesson added successfully",
        data
    })
}

async function editLesson(req, res) {
    const data = await lessonService.editLesson(req.params.id, req.body)

    res.status(201).json({
        success: true,
        message: "lesson edited successfully",
        data
    })
}

module.exports = {
    getLessonById: asyncWrapper(getLessonById),
    createNewLesson: asyncWrapper(createNewLesson),
    editLesson: asyncWrapper(editLesson)
}