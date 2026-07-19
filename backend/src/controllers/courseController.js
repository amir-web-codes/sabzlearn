const courseService = require("../services/courseService")
const asyncWrapper = require("../utils/asyncWrapper")

async function getCourseBySlug(req, res) {


    const { foundCourse, foundLessons, totalDuration } = await courseService.getCourseDetails(req.params.slug.toLowerCase().trim(), req.query.lessonsIncluded)

    res.json({
        success: true,
        message: "course fetched successfully",
        data: {
            foundCourse,
            lessons: foundLessons,
        },
        meta: {
            totalStudents: foundCourse.studentsCount,
            rating: foundCourse.rating.average,
            duration: `${totalDuration || 0} minutes`
        }
    })

}

async function createCourse(req, res) {
    const data = await courseService.createCourse(req.body, req.user.id)

    res.status(201).json({
        success: true,
        message: "course created successfully",
        data
    })
}

async function deleteCourse(req, res) {
    await courseService.removeCourseFromDb(req.params.slug.toLowerCase().trim(), req.user.id)

    res.json({
        success: true,
        message: "course deleted successfully"
    })
}

async function editCourseDetails(req, res) {
    const data = await courseService.updateCourse(req.body, req.params.slug.toLowerCase().trim())

    res.json({
        success: true,
        message: "course edited successfully",
        data
    })
}

async function getAllCourses(req, res) {
    const { page, limit, level, language, status, minPrice, maxPrice, sortBy, sortOrder } = req.query

    const { data, totalNumber } = await courseService.getAllCourses(
        page,
        limit,
        { level, language, status, minPrice, maxPrice },
        { sortBy, sortOrder }
    )

    res.json({
        success: true,
        message: "courses fetched successfully",
        data,
        meta: {
            totalNumber,
            totalPages: Math.ceil(totalNumber / limit),
            page,
            limit
        }
    })
}

async function registerUserInCourseByTeacher(req, res) {

    await courseService.enrollUserInCourse(req.params.slug.toLowerCase().trim(), req.params.id)

    res.status(201).json({
        success: true,
        message: "enrollment successful"
    })
}

async function getCourseStudents(req, res) {

    const { page, limit, sortBy, sortOrder } = req.query

    const { data, totalNumber } = await courseService.findCourseStudents(req.course, page, limit, { sortBy, sortOrder })
    const students = data.map(object => object.userId)

    res.json({
        success: true,
        message: "users fetched successfully",
        data: students.length ? students : "no student found",
        meta: {
            rating: req.course.rating,
            totalNumber,
            totalPages: Math.ceil(totalNumber / limit),
            page,
            limit
        }
    })
}

async function getCourseComments(req, res) {
    const { page, limit, rating, sortBy, sortOrder } = req.query

    const { data, totalNumber } = await courseService.findCourseComments(req.course, page, limit, { rating }, { sortBy, sortOrder })

    res.json({
        success: true,
        message: "comments fetched successfully",
        data: data.length ? data : "no comment found",
        meta: {
            rating: req.course.rating,
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
    registerUserInCourseByTeacher: asyncWrapper(registerUserInCourseByTeacher),
    getCourseStudents: asyncWrapper(getCourseStudents),
    getCourseComments: asyncWrapper(getCourseComments)
}