const express = require("express")
const router = express.Router()

const { checkRoles, checkToken, checkUserBan, validateId, limiters, checkSelfs } = require("../middlewares")

const lessonController = require("../controllers/lessonController")

router.get("/get-all", checkToken, checkUserBan, checkRoles(["admin"]), limiters.adminLimiter, lessonController.getAllLessons)

router.post("/courses/:slug/create", checkToken, checkUserBan, checkRoles(["admin", "teacher"]), lessonController.createNewLesson)

router.route("/:id")
    .get(validateId, checkToken, checkUserBan, lessonController.getLessonById)
    .patch(validateId, checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfs.checkSelfLessonAuthor(false), lessonController.editLesson)
    .delete(validateId, checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfs.checkSelfLessonAuthor(true), lessonController.deleteLesson)




module.exports = router