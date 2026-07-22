const express = require("express")
const router = express.Router()

const categoryController = require("../controllers/categoryController")

const validator = require("../middlewares/validator")

const { checkToken, checkUserBan, checkRoles, limiters } = require("../middlewares")
const { imageUpload } = require("../middlewares/uploads")

const { createSchema, updateSchema, slugParamSchema, getAllQuerySchema } = require("../middlewares/validations/category.validation")

router.get("/admin/all", validator(getAllQuerySchema, "query"), categoryController.getAllCategories)


router.post("/admin/create", checkToken, checkUserBan, checkRoles(["admin"]), limiters.adminLimiter, imageUpload.single("icon"), validator(createSchema), categoryController.createCategory)

router.route("/:slug")
    .get(validator(slugParamSchema, "params"), categoryController.getBySlug)
    .patch(checkToken, checkUserBan, checkRoles(["admin"]), limiters.adminLimiter, imageUpload.single("newIcon"), validator(slugParamSchema, "params"), validator(updateSchema), categoryController.updateCategory)
    .delete(checkToken, checkUserBan, checkRoles(["admin"]), limiters.adminLimiter, validator(slugParamSchema, "params"), categoryController.deleteCategory)

module.exports = router