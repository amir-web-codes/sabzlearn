const express = require("express")
const router = express.Router()

const { checkToken, checkUserBan, checkSelfs, limiters } = require("../middlewares")

const cartController = require("../controllers/cartController")


router.post("/checkout", limiters.cartLimiter, checkToken, checkUserBan, cartController.cartCheckout)

router.route("/me")
    .get(checkToken, limiters.cartLimiter, cartController.getUserCart)
    .delete(checkToken, cartController.deleteUserCart)

router.route("/:slug")
    .post(checkToken, checkUserBan, cartController.addNewItem)
    .delete(checkToken, cartController.deleteItemBySlug)


module.exports = router