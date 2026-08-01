const express = require("express")
const router = express.Router()

const categoryController = require("../controllers/categoryController")

const validator = require("../middlewares/validator")

const { checkToken, checkTokenOptional, checkUserBan, checkRoles, limiters } = require("../middlewares")
const { imageUpload } = require("../middlewares/uploads")

const { createSchema, updateSchema, slugParamSchema, getAllQuerySchema, getCategoryCoursesQuerySchema } = require("../middlewares/validations/category.validation")

router.get("/get-all", checkTokenOptional, validator(getAllQuerySchema, "query"), categoryController.getAllCategories)

router.get("/:slug/courses", validator(slugParamSchema, "params"), validator(getCategoryCoursesQuerySchema, "query"), categoryController.getCategoryCourses)

router.post("/admin/create", checkToken, checkUserBan, checkRoles(["admin"]), limiters.adminLimiter, imageUpload.single("icon"), validator(createSchema), categoryController.createCategory)

router.route("/:slug")
    .get(checkTokenOptional, validator(slugParamSchema, "params"), categoryController.getBySlug)
    .patch(checkToken, checkUserBan, checkRoles(["admin"]), limiters.adminLimiter, imageUpload.single("newIcon"), validator(slugParamSchema, "params"), validator(updateSchema), categoryController.updateCategory)
    .delete(checkToken, checkUserBan, checkRoles(["admin"]), limiters.adminLimiter, validator(slugParamSchema, "params"), categoryController.deleteCategory)

module.exports = router