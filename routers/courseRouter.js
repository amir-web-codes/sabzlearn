const express = require("express")
const router = express.Router()

const courseController = require("../controllers/courseController")

const { validateId, checkToken, checkRoles, checkUserBan, checkSelfCourseAuthor } = require("../middlewares")


router.route("/:slug")
    .get(checkToken, courseController.getCourseBySlug)
    .patch(checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfCourseAuthor(true), courseController.editCourseDetails)
    .delete(checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfCourseAuthor(true), courseController.deleteCourse)

router.post("/create", checkToken, checkUserBan, checkRoles(["admin", "teacher"]), courseController.createCourse)

module.exports = router