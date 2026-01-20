const express = require("express")
const router = express.Router()

const { validateId, checkToken, checkRoles, checkSelfUser, checkUserBan, limiters } = require("../middlewares")

const userController = require("../controllers/userController")

router.route("/me")
    .get(checkToken, userController.getUserProfile)
    .delete(checkToken, checkUserBan, userController.deleteUserProfile)
    .patch(checkToken, checkUserBan, userController.updateUserProfile)


router.get("/me/get-courses", checkToken, userController.getUserCourses)
router.get("/me/get-comments", checkToken, userController.getUserComments)



router.get("/admin/requests/get-pending", checkToken, limiters.adminLimiter, checkRoles(["admin"]), userController.getPendingRequests)
router.get("/admin/requests/get-all", checkToken, limiters.adminLimiter, checkRoles(["admin"]), userController.getAllRequests)
router.get("/admin/requests/:id", validateId, checkToken, limiters.adminLimiter, checkRoles(["admin"]), userController.getRequestById)

router.patch("/request-role", checkToken, limiters.requestLimiter, userController.requestNewRole)

router.patch("/admin/requests/:id/accept", validateId, checkToken, limiters.adminLimiter, checkRoles(["admin"]), userController.acceptRequest)
router.patch("/admin/requests/:id/reject", validateId, checkToken, limiters.adminLimiter, checkRoles(["admin"]), userController.rejectRequest)



router.patch("/change-password", checkToken, userController.changeUserPassword)

router.route("/admin/:id")
    .get(validateId, checkToken, limiters.adminLimiter, checkRoles(["admin"]), userController.getUserById)
    .delete(validateId, checkToken, limiters.adminChangeLimiter, checkRoles(["admin"]), userController.deleteUserById)

router.patch("/admin/:id/ban", validateId, checkToken, limiters.adminChangeLimiter, checkRoles(["admin"]), userController.banUser)
router.patch("/admin/:id/unban", validateId, checkToken, limiters.adminChangeLimiter, checkRoles(["admin"]), userController.unBanUser)

router.patch("/admin/:id/change-role", validateId, checkToken, limiters.adminChangeLimiter, checkRoles(["admin"]), userController.changeUserRole)


router.post("/auth/signup", limiters.loginLimiter, userController.signUp)
router.post("/auth/login", limiters.loginLimiter, userController.login)
router.post("/auth/logout", checkToken, userController.logOut)
router.post("/refresh-token", userController.refreshToken)



module.exports = router