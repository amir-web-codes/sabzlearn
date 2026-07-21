const express = require("express")
const router = express.Router()

const { validateId, checkToken, checkRoles, checkUserBan, checkSelfs, limiters } = require("../middlewares")

const courseController = require("../controllers/courseController")

const validator = require("../middlewares/validator")
const courseValidations = require("../middlewares/validations/course.validation")
const { checkSelfCourseAuthor } = require("../middlewares/checkSelfs")

const { thumbnailUpload, videoUpload } = require("../middlewares/uploads")

router.get("/get-all", limiters.courseLimiter, validator(courseValidations.getAllCoursesQuerySchema, "query"), courseController.getAllCourses)

router.get("/:slug/get-students", validator(courseValidations.getCourseStudentsQuerySchema, "query"), checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfs.checkSelfCourseAuthor(true), courseController.getCourseStudents)

router.get("/:slug/get-comments", validator(courseValidations.getCourseCommentsQuerySchema, "query"), checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfs.checkSelfCourseAuthor(true), courseController.getCourseComments)

router.route("/:slug")
    .get(limiters.courseLimiter, checkToken, courseController.getCourseBySlug)
    .patch(limiters.courseLimiter, checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfs.checkSelfCourseAuthor(false), validator(courseValidations.editSchema), courseController.editCourseDetails)
    .delete(limiters.courseLimiter, checkToken, checkUserBan, checkRoles(["admin", "teacher"]), checkSelfs.checkSelfCourseAuthor(true), courseController.deleteCourse)

router.post("/create", checkToken, validator(courseValidations.createSchema), checkUserBan, checkRoles(["admin", "teacher"]), courseController.createCourse)

router.post("/:slug/enroll/:id", validateId, checkToken, checkUserBan, limiters.enrollLimiter, checkSelfCourseAuthor(false), courseController.registerUserInCourseByTeacher)

router.patch(
    "/:slug/thumbnail",
    checkToken,
    checkUserBan,
    checkRoles(["admin", "teacher"]),
    checkSelfs.checkSelfCourseAuthor(false),
    thumbnailUpload.single("thumbnail"),
    courseController.updateCourseThumbnail
)

router.delete(
    "/:slug/thumbnail",
    checkToken,
    checkUserBan,
    checkRoles(["admin", "teacher"]),
    checkSelfs.checkSelfCourseAuthor(false),
    courseController.deleteCourseThumbnail
)

router.patch(
    "/:slug/cover-video",
    checkToken,
    checkUserBan,
    checkRoles(["admin", "teacher"]),
    checkSelfs.checkSelfCourseAuthor(false),
    videoUpload.single("coverVideo"),
    courseController.updateCourseCoverVideo
)

router.delete(
    "/:slug/cover-video",
    checkToken,
    checkUserBan,
    checkRoles(["admin", "teacher"]),
    checkSelfs.checkSelfCourseAuthor(false),
    courseController.deleteCourseCoverVideo
)

module.exports = router