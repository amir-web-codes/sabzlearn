const asyncWrapper = require("../utils/asyncWrapper")

const lessonService = require("../services/lessonService")
const courseService = require("../services/courseService")

async function getLessonById(req, res) {
    console.log("test")
    const data = await lessonService.findById(req.params.id)

    res.json({
        success: true,
        message: "lesson fetched successfully",
        data
    })
}

async function createNewLesson(req, res) {
    const foundCourse = await courseService.findCourseBySlug(req.params.slug)

    const data = await lessonService.createLesson(req.user.id, foundCourse._id, req.body, foundCourse.slug, req.file)

    res.status(201).json({
        success: true,
        message: "lesson added successfully",
        data
    })
}

async function editLesson(req, res) {
    const data = await lessonService.editById(req.params.id, req.body, req.file)

    res.json({
        success: true,
        message: "lesson edited successfully",
        data
    })
}

async function deleteLesson(req, res) {
    await lessonService.deleteById(req.params.id)

    res.json({
        success: true,
        message: "lesson deleted successfully"
    })
}

async function getAllLessons(req, res) {
    const { courseId, sortBy, sortOrder } = req.query

    const page = req.query.page || 1
    const limit = req.query.limit || 20

    const { data, totalNumber } = await lessonService.findAll(page, limit, { courseId }, { sortBy, sortOrder })

    res.json({
        success: true,
        message: "lessons fetched successfully",
        data: data.length ? data : "no lesson found",
        meta: {
            totalNumber,
            totalPages: Math.ceil(totalNumber / limit),
            page,
            limit
        }
    })
}

async function getCourseLessons(req, res) {
    const { sortBy, sortOrder } = req.query

    const page = req.query.page || 1
    const limit = req.query.limit || 20

    const foundCourse = await courseService.findCourseBySlug(req.params.slug)

    const { data, totalNumber } = await lessonService.findCourseLessons(foundCourse, page, limit, { sortBy, sortOrder })

    res.json({
        success: true,
        message: "course lessons fetched successfully",
        data,
        meta: {
            totalNumber,
            totalPages: Math.ceil(totalNumber / limit),
            page,
            limit
        }
    })
}

module.exports = {
    getLessonById: asyncWrapper(getLessonById),
    createNewLesson: asyncWrapper(createNewLesson),
    editLesson: asyncWrapper(editLesson),
    deleteLesson: asyncWrapper(deleteLesson),
    getAllLessons: asyncWrapper(getAllLessons),
    getCourseLessons: asyncWrapper(getCourseLessons)
}