const express = require("express")
const router = express.Router()

const courseController = require("../controllers/courseController")

const { validateId, checkToken, checkRoles, checkUserBan, loginLimiter, adminLimiter } = require("../middlewares")


router.route("/:slug")
    .get(checkToken, courseController.getCourseBySlug)
// .patch()
// .delete(checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkCourseAuthor)

router.post("/create", checkToken, checkUserBan, checkRoles(["admin", "teacher"]), courseController.createCourse)

module.exports = router