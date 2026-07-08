const express = require("express")
const router = express.Router()

const { checkRoles, checkToken, checkUserBan, validateId, limiters, checkSelfs } = require("../middlewares")

const lessonController = require("../controllers/lessonController")

const validator = require("../middlewares/validator")
const lessonValidations = require("../middlewares/validations/lesson.validation")

router.get("/getall", checkToken, checkUserBan, checkRoles(["admin"]), limiters.adminLimiter, lessonController.getAllLessons) // redis
router.get("/:slug/get-lessons", checkToken, checkUserBan, lessonController.getCourseLessons)

router.post("/courses/:slug/create", validator(lessonValidations.createSchema), checkToken, checkUserBan, checkRoles(["admin", "teacher"]), lessonController.createNewLesson)

router.route("/:id")
    .get(validateId, checkToken, checkUserBan, lessonController.getLessonById)
    .patch(validateId, validator(lessonValidations.editSchema), checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfs.checkSelfLessonAuthor(false), lessonController.editLesson)
    .delete(validateId, checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfs.checkSelfLessonAuthor(true), lessonController.deleteLesson)




module.exports = router