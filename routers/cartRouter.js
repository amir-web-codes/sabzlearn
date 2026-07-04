const express = require("express")
const router = express.Router()

const { checkToken, checkUserBan, checkSelfs, limiters } = require("../middlewares")

const cartController = require("../controllers/cartController")

router.route("/me")
    .get(checkToken, cartController.getUserCart)

router.post("/:slug", checkToken, checkUserBan, cartController.addNewItem)

module.exports = router