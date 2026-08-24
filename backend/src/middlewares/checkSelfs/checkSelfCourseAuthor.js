const courseService = require("../../services/courseService")

function checkSelfCourseAuthor(adminAllowed = false) {
    return async (req, res, next) => {
        const foundCourse = await courseService.findCourseBySlug(req.params.slug.toLowerCase().trim(), "instructor studentsCount rating")

        if (foundCourse.instructor.equals(req.user.id) || (adminAllowed && req.user.role === "admin")) {
            req.course = foundCourse
            return next()
        }

        res.status(403).json({
            success: false,
            message: "you don't have access to this course"
        })
    }
}

module.exports = checkSelfCourseAuthor