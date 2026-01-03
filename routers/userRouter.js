const express = require("express")
const router = express.Router()

const { validateId, checkToken, checkRoles, checkSelfUser, checkUserBan } = require("../middlewares")

const userController = require("../controllers/userController")

router.route("/:id")
    .get(validateId, checkToken, checkRoles(["admin"]), userController.getUserById)
    .delete(validateId, checkToken, checkRoles(["admin"]), userController.deleteUserById)

// router.route("/me")
//     .get(validateId, checkToken, checkUserBan, checkSelfUser(true), userController.getUserById)
//     .patch(validateId, checkToken, checkUserBan, checkSelfUser(true), userController.getUserById)
//     .delete(validateId, checkToken, checkUserBan, checkSelfUser(true), userController.getUserById)


router.put("/:id/ban", validateId, checkToken, checkRoles(["admin"]), userController.banUser)


router.post("/signup", userController.signUp)
router.post("/login", userController.login)

module.exports = router