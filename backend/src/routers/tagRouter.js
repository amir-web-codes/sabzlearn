const express = require("express")
const router = express.Router()

const tagController = require("../controllers/tagController")
const validator = require("../middlewares/validator")

const { checkToken, checkUserBan, checkRoles, limiters } = require("../middlewares")
const { slugParamSchema, createSchema, updateSchema, getTagCoursesQuerySchema } = require("../middlewares/validations/tag.validation")

router.post("/create", checkToken, checkUserBan, checkRoles(["admin"]), limiters.adminLimiter, validator(createSchema), tagController.createTag)

router.get("/:slug/courses", validator(slugParamSchema, "params"), validator(getTagCoursesQuerySchema, "query"), tagController.getTagCourses)

router.route("/:slug")
    .get(validator(slugParamSchema, "params"), tagController.getBySlug)
    .patch(checkToken, checkUserBan, checkRoles(["admin"]), limiters.adminLimiter, validator(slugParamSchema, "params"), validator(updateSchema), tagController.updateTag)
    .delete(checkToken, checkUserBan, checkRoles(["admin"]), limiters.adminLimiter, validator(slugParamSchema, "params"), tagController.deleteTag)

module.exports = router