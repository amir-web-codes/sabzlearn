const courseService = require("../services/courseService")

function checkSelfCourseAuthor(adminAllowed = false) {
    return async (req, res, next) => {
        const foundCourse = await courseService.findCourseBySlug(req.params.slug, "instructor")

        if (foundCourse.instructor.equals(req.user.id) || (adminAllowed && req.user.role === "admin")) {
            req.course = course
            return next()
        }

        res.status(403).json({
            success: false,
            message: "you don't have permission to this course"
        })
    }
}

module.exports = checkSelfCourseAuthor