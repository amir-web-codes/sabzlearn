const express = require("express")
const router = express.Router()

const { validateId, checkToken, checkRoles, checkSelfUser, checkUserBan, loginLimiter, adminLimiter } = require("../middlewares")

const userController = require("../controllers/userController")


router.route("/me")
    .get(checkToken, userController.getUserProfile)
    .patch(checkToken, checkUserBan, userController.updateUserProfile)
    .delete(checkToken, checkUserBan, userController.deleteUserProfile)

router.route("/:id")
    .get(validateId, checkToken, adminLimiter, checkRoles(["admin"]), userController.getUserById)
    .delete(validateId, checkToken, adminLimiter, checkRoles(["admin"]), userController.deleteUserById)

router.patch("/:id/ban", validateId, checkToken, adminLimiter, checkRoles(["admin"]), userController.banUser)
router.patch("/:id/unban", validateId, checkToken, adminLimiter, checkRoles(["admin"]), userController.unBanUser)


router.post("/auth/signup", loginLimiter, userController.signUp)
router.post("/auth/login", loginLimiter, userController.login)
router.post("/auth/logout", checkToken, userController.logOut)
router.post("/refresh-token", userController.refreshToken)



module.exports = router