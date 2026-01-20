const express = require("express")
const router = express.Router()

const { checkRoles, checkToken, checkUserBan, validateId, limiters } = require("../middlewares")

const lessonController = require("../controllers/lessonController")

router.post("/courses/:slug/create", checkToken, checkUserBan, checkRoles(["admin", "teacher"]), lessonController.createNewLesson)

router.route("/:id")
    .get(validateId, checkToken, checkUserBan, lessonController.getLessonById)
    .patch(validateId, checkToken, checkUserBan, checkRoles(["admin", "teacher"]), lessonController.editLesson)
    .delete(validateId, checkToken, checkUserBan, checkRoles(["admin", "teacher"]), lessonController.deleteLesson)

module.exports = router


// check lesson author middleware