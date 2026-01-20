const lessonService = require("../../services/lessonService")

function checkSelfLessonAuthor(adminAllowed = false) {
    return async (req, res, next) => {
        const foundLesson = await lessonService.findById(req.params.id)

        if (foundLesson.publisherId.equals(req.user.id) || (adminAllowed && req.user.role === "admin")) {
            req.lesson = foundLesson
            return next()
        }

        res.status(403).json({
            success: false,
            message: "you don't have access to this lesson"
        })
    }
}

module.exports = checkSelfLessonAuthor