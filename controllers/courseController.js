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
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20

    const { data, totalNumber } = await courseService.getAllCourses(page, limit)

    res.json({
        success: true,
        data,
        meta: {
            totalNumber,
            totalPages: Math.ceil(totalNumber / limit),
            page,
            limit
        }
    })
}

async function registerUserInCourse(req, res) {

    await courseService.enrollUserCourse(req.params.slug, req.user.id)

    res.status(201).json({
        success: true,
        message: "enrollment successful"
    })
}

async function cancelEnrollment(req, res) {
    await courseService.cancelEnrollStatus(req.params.slug, req.user.id)

    res.json({
        success: true,
        message: "enrollment cancelled successfully"
    })
}

async function getCourseStudents(req, res) {

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20

    const { data, totalNumber } = await courseService.findCourseStudents(req.params.slug, page, limit)
    const students = data.map(object => object.userId)


    res.json({
        success: true,
        data: students.length ? students : "no student found",
        meta: {
            totalNumber,
            totalPages: Math.ceil(totalNumber / limit),
            page,
            limit
        }
    })
}

module.exports = {
    getCourseBySlug: asyncWrapper(getCourseBySlug),
    createCourse: asyncWrapper(createCourse),
    deleteCourse: asyncWrapper(deleteCourse),
    editCourseDetails: asyncWrapper(editCourseDetails),
    getAllCourses: asyncWrapper(getAllCourses),
    registerUserInCourse: asyncWrapper(registerUserInCourse),
    cancelEnrollment: asyncWrapper(cancelEnrollment),
    getCourseStudents: asyncWrapper(getCourseStudents)
}