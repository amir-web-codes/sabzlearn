const express = require("express")
const router = express.Router()

const courseController = require("../controllers/courseController")

const { checkToken, checkRoles, checkUserBan, checkSelfCourseAuthor, enrollLimiter } = require("../middlewares")

router.get("/getAll", checkToken, checkUserBan, checkRoles(["admin", "teacher"]), courseController.getAllCourses)
router.get("/:slug/get-students", checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfCourseAuthor(true), courseController.getCourseStudents)

router.route("/:slug")
    .get(checkToken, courseController.getCourseBySlug)
    .patch(checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfCourseAuthor(false), courseController.editCourseDetails)
    .delete(checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfCourseAuthor(true), courseController.deleteCourse)

router.post("/create", checkToken, checkUserBan, checkRoles(["admin", "teacher"]), courseController.createCourse)

router.post("/:slug/enroll", checkToken, checkUserBan, enrollLimiter, courseController.registerUserInCourse)
router.post("/:slug/cancel-enroll", checkToken, checkUserBan, enrollLimiter, courseController.cancelEnrollment)

module.exports = router