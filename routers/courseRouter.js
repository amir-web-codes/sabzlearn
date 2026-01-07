const express = require("express")
const router = express.Router()

const courseController = require("../controllers/courseController")

const { validateId, checkToken, checkRoles, checkUserBan, checkSelfCourseAuthor } = require("../middlewares")


router.route("/:slug")
    .get(checkToken, courseController.getCourseBySlug)
// .patch()
// .delete(checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfCourseAuthor(true))

router.post("/create", checkToken, checkUserBan, checkRoles(["admin", "teacher"]), courseController.createCourse)

module.exports = router