const express = require("express")
const router = express.Router()

const { checkToken, checkUserBan, checkSelfs, limiters } = require("../middlewares")

const cartController = require("../controllers/cartController")

router.route("/me")
    .get(checkToken, cartController.getUserCart)
    .delete(checkToken, cartController.deleteUserCart)

router.route("/:slug")
    .post(checkToken, checkUserBan, cartController.addNewItem)
    .delete(checkToken, cartController.deleteItemBySlug)

// router.get("/checkout", limiters.cartLimiter, checkToken, checkUserBan)

module.exports = router