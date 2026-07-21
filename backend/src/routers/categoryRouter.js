const express = require("express")
const router = express.Router()

const { checkToken, checkUserBan, checkRoles, limiters } = require("../middlewares")

// const categoryController = require("../controllers/categoryController")

const validator = require("../middlewares/validator")
const categoryValidations = require("../middlewares/validations/category.validation")
const { imageUpload } = require("../middlewares/uploads/index")


router.post("/create", checkToken, checkUserBan, checkRoles(["admin"]), imageUpload.single("categoryIcon"), validator(categoryValidations.createSchema))

module.exports = router