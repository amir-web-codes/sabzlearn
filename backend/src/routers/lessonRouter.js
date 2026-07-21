const express = require("express")
const router = express.Router()

const { checkRoles, checkToken, checkUserBan, validateId, limiters, checkSelfs } = require("../middlewares")

const lessonController = require("../controllers/lessonController")

const validator = require("../middlewares/validator")
const lessonValidations = require("../middlewares/validations/lesson.validation")
const { videoUpload } = require("../middlewares/uploads")

router.get("/admin/get-all", validator(lessonValidations.getAllLessonsQuerySchema, "query"), checkToken, checkUserBan, checkRoles(["admin"]), limiters.adminLimiter, lessonController.getAllLessons)

router.get("/:slug/get-lessons", validator(lessonValidations.getCourseLessonsQuerySchema, "query"), checkToken, checkUserBan, lessonController.getCourseLessons)

router.post(
    "/courses/:slug/create",
    checkToken,
    checkUserBan,
    checkRoles(["admin", "teacher"]),
    checkSelfs.checkSelfCourseAuthor(false),
    videoUpload.single("video"),
    validator(lessonValidations.createSchema),
    lessonController.createNewLesson
)

router.route("/:id")
    .get(validateId, checkToken, checkUserBan, lessonController.getLessonById)
    .patch(
        validateId,
        checkToken,
        checkUserBan,
        checkRoles(["admin", "teacher"]),
        checkSelfs.checkSelfLessonAuthor(false),
        videoUpload.single("video"),
        validator(lessonValidations.editSchema),
        lessonController.editLesson
    )
    .delete(validateId, checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfs.checkSelfLessonAuthor(true), lessonController.deleteLesson)

module.exports = router