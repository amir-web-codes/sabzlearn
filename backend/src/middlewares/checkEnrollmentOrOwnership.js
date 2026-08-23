const courseService = require("../services/courseService")
const enrollmentModel = require("../models/enrollmentModel")

function checkEnrollmentOrOwnership(adminAllowed = false) {
    return async (req, res, next) => {
        const foundCourse = await courseService.findCourseBySlug(req.params.slug, "instructor")
        const hasEnrollment = await enrollmentModel.exists({ userId: req.user.id, courseId: foundCourse.id })
        req.course = foundCourse

        if (foundCourse.instructor.equals(req.user.id) || (adminAllowed && req.user.role === "admin")) {
            return next()
        }
        if (hasEnrollment) {
            return next()
        }

        res.status(403).json({
            success: false,
            message: "you don't have access to this course"
        })
    }
}

module.exports = checkEnrollmentOrOwnership