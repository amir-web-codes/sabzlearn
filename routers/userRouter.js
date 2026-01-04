const express = require("express")
const router = express.Router()

const { validateId, checkToken, checkRoles, checkSelfUser, checkUserBan } = require("../middlewares")

const userController = require("../controllers/userController")


router.route("/me")
    .get(checkToken, userController.getUserProfile)
    .patch(checkToken, checkUserBan, userController.updateUserProfile)
    .delete(checkToken, checkUserBan, userController.deleteUserProfile)

router.route("/:id")
    .get(validateId, checkToken, checkRoles(["admin"]), userController.getUserById)
    .delete(validateId, checkToken, checkRoles(["admin"]), userController.deleteUserById)

router.patch("/:id/ban", validateId, checkToken, checkRoles(["admin"]), userController.banUser)
router.patch("/:id/unban", validateId, checkToken, checkRoles(["admin"]), userController.unBanUser)


router.post("/auth/signup", userController.signUp)
router.post("/auth/login", userController.login)
router.post("/auth/logout", checkToken, userController.logOut)



module.exports = router