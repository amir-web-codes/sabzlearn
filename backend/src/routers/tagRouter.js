const express = require("express")
const router = express.Router()

const tagController = require("../controllers/tagController")
const validator = require("../middlewares/validator")

const { checkToken, checkUserBan, checkRoles, limiters } = require("../middlewares")
const { slugParamSchema, createSchema, updateSchema, getTagCoursesQuerySchema, getAllTagsQuerySchema } = require("../middlewares/validations/tag.validation")

router.get("/get-all", validator(getAllTagsQuerySchema, "query"), tagController.getAllTags)

router.post("/admin/create", checkToken, checkUserBan, checkRoles(["admin"]), limiters.adminLimiter, validator(createSchema), tagController.createTag)

router.get("/:slug/courses", validator(slugParamSchema, "params"), validator(getTagCoursesQuerySchema, "query"), tagController.getTagCourses)

router.route("/:slug")
    .get(validator(slugParamSchema, "params"), tagController.getBySlug)

router.route("/admin/:slug")
    .patch(checkToken, checkUserBan, checkRoles(["admin"]), limiters.adminLimiter, validator(slugParamSchema, "params"), validator(updateSchema), tagController.updateTag)
    .delete(checkToken, checkUserBan, checkRoles(["admin"]), limiters.adminLimiter, validator(slugParamSchema, "params"), tagController.deleteTag)

module.exports = router