const express = require("express")
const router = express.Router()

const { validateId, checkToken, checkUserBan, checkRoles, checkSelfs, limiters } = require("../middlewares")

const cartController = require("../controllers/cartController")


router.post("/checkout", limiters.cartLimiter, checkToken, checkUserBan, cartController.cartCheckout)
router.get("/admin/orders/:id", validateId, checkToken, checkUserBan, checkRoles(["admin"]), cartController.getOrderById)

router.route("/me")
    .get(checkToken, limiters.cartLimiter, cartController.getUserCart)
    .delete(checkToken, cartController.deleteUserCart)

router.route("/:slug")
    .post(checkToken, checkUserBan, cartController.addNewItem)
    .delete(checkToken, cartController.deleteItemBySlug)


module.exports = router