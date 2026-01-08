const express = require("express")
const router = express.Router()

const courseController = require("../controllers/courseController")

const { validateId, checkToken, checkRoles, checkUserBan, checkSelfCourseAuthor } = require("../middlewares")

router.get("/getAll", checkToken, checkUserBan, checkRoles(["admin", "teacher"]), courseController.getAllCourses)

router.route("/:slug")
    .get(checkToken, courseController.getCourseBySlug)
    .patch(checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfCourseAuthor(false), courseController.editCourseDetails)
    .delete(checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfCourseAuthor(true), courseController.deleteCourse)

router.post("/create", checkToken, checkUserBan, checkRoles(["admin", "teacher"]), courseController.createCourse)

router.post("/:slug/enroll", checkToken, checkUserBan, courseController.registerUserInCourse)

module.exports = router