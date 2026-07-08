const express = require("express")
const router = express.Router()

const { checkToken, checkRoles, checkUserBan, checkSelfs, limiters } = require("../middlewares")

const courseController = require("../controllers/courseController")

const validator = require("../middlewares/validator")
const courseValidations = require("../middlewares/validations/course.validation")

router.get("/getAll", limiters.courseLimiter, courseController.getAllCourses)
router.get("/:slug/get-students", checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfs.checkSelfCourseAuthor(true), courseController.getCourseStudents)
router.get("/:slug/get-comments", checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfs.checkSelfCourseAuthor(true), courseController.getCourseComments)

router.route("/:slug")
    .get(limiters.courseLimiter, checkToken, courseController.getCourseBySlug) // redis
    .patch(limiters.courseLimiter, validator(courseValidations.editSchema), checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfs.checkSelfCourseAuthor(false), courseController.editCourseDetails) // redis
    .delete(limiters.courseLimiter, checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfs.checkSelfCourseAuthor(true), courseController.deleteCourse) // redis

router.post("/create", validator(courseValidations.createSchema), checkToken, checkUserBan, checkRoles(["admin", "teacher"]), courseController.createCourse) // redis

router.post("/:slug/enroll", checkToken, checkUserBan, limiters.enrollLimiter, courseController.registerUserInCourse)
router.post("/:slug/cancel-enroll", checkToken, checkUserBan, limiters.enrollLimiter, courseController.cancelEnrollment)

module.exports = router