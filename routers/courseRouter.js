const express = require("express")
const router = express.Router()

const courseController = require("../controllers/courseController")

const { checkToken, checkRoles, checkUserBan, checkSelfs, limiters } = require("../middlewares")

router.get("/getAll", courseController.getAllCourses)
router.get("/:slug/get-students", checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfs.checkSelfCourseAuthor(true), courseController.getCourseStudents)
router.get("/:slug/get-comments", checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfs.checkSelfCourseAuthor(true), courseController.getCourseComments)

router.route("/:slug")
    .get(checkToken, courseController.getCourseBySlug)
    .patch(checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfs.checkSelfCourseAuthor(false), courseController.editCourseDetails)
    .delete(checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfs.checkSelfCourseAuthor(true), courseController.deleteCourse)

router.post("/create", checkToken, checkUserBan, checkRoles(["admin", "teacher"]), courseController.createCourse)

router.post("/:slug/enroll", checkToken, checkUserBan, limiters.enrollLimiter, courseController.registerUserInCourse)
router.post("/:slug/cancel-enroll", checkToken, checkUserBan, limiters.enrollLimiter, courseController.cancelEnrollment)

module.exports = router