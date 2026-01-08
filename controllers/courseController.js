const courseModel = require("../models/courseModel")
const courseService = require("../services/courseService")
const asyncWrapper = require("../utils/asyncWrapper")

async function getCourseBySlug(req, res) {
    const course = await courseService.findCourseBySlug(req.params.slug)

    res.json({
        success: true,
        message: "course found successfully",
        data: course
    })
}

async function createCourse(req, res) {
    await courseService.createCourse(req.body, req.user.id)

    res.status(201).json({
        success: true,
        message: "course created successfully"
    })
}

async function deleteCourse(req, res) {
    await courseService.removeCourseFromDb(req.params.slug)

    res.json({
        success: true,
        message: "course deleted successfully"
    })
}

async function editCourseDetails(req, res) {
    await courseService.updateCourse(req.body, req.params.slug)

    res.json({
        success: true,
        message: "course edited successfully"
    })
}

async function getAllCourses(req, res) {
    const data = await courseService.getAllCourses()

    res.json({
        success: true,
        data
    })
}

module.exports = {
    getCourseBySlug: asyncWrapper(getCourseBySlug),
    createCourse: asyncWrapper(createCourse),
    deleteCourse: asyncWrapper(deleteCourse),
    editCourseDetails: asyncWrapper(editCourseDetails),
    getAllCourses: asyncWrapper(getAllCourses)
}