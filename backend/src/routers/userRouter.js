const express = require("express")
const router = express.Router()

const { validateId, checkToken, checkRoles, checkUserBan, limiters } = require("../middlewares")

const userController = require("../controllers/userController")

const validator = require("../middlewares/validator")
const userValidations = require("../middlewares/validations/user.validation")

const { imageUpload } = require("../middlewares/uploads")

router.route("/me")
    .get(checkToken, userController.getUserProfile)
    .patch(checkToken, checkUserBan, imageUpload.single("newAvatar"), validator(userValidations.updateUserSchema), userController.updateUserProfile)
    .delete(checkToken, checkUserBan, userController.deleteUserProfile)

router.delete("/me/delete-avatar", checkToken, checkUserBan, userController.deleteUserAvatar)

router.get("/me/get-courses", validator(userValidations.getUserCoursesQuerySchema, "query"), checkToken, userController.getUserCourses)
router.get("/me/get-comments", validator(userValidations.getUserCommentsQuerySchema, "query"), checkToken, userController.getUserComments)
router.get("/me/dashboard", checkToken, userController.getUserDashboard)



router.get("/admin/requests/get-pending", validator(userValidations.getPendingRequestsQuerySchema, "query"), checkToken, limiters.adminLimiter, checkRoles(["admin"]), userController.getPendingRequests)
router.get("/admin/requests/get-all", validator(userValidations.getAllRequestsQuerySchema, "query"), checkToken, limiters.adminLimiter, checkRoles(["admin"]), userController.getAllRequests)
router.get("/admin/requests/:id", validateId, checkToken, limiters.adminLimiter, checkRoles(["admin"]), userController.getRequestById)

router.post("/request-role", limiters.requestLimiter, validator(userValidations.requestRoleSchema), checkToken, checkUserBan, userController.requestNewRole)

router.patch("/admin/requests/:id/accept", validateId, checkToken, limiters.adminLimiter, checkRoles(["admin"]), userController.acceptRequest)
router.patch("/admin/requests/:id/reject", validateId, checkToken, limiters.adminLimiter, checkRoles(["admin"]), userController.rejectRequest)



router.patch("/change-password", validator(userValidations.changePasswordSchema), checkToken, checkUserBan, userController.changeUserPassword)

router.route("/admin/:id")
    .get(validateId, checkToken, limiters.adminLimiter, checkRoles(["admin"]), userController.getUserById)
    .delete(validateId, checkToken, limiters.adminChangeLimiter, checkRoles(["admin"]), userController.deleteUserById)

router.patch("/admin/:id/ban", validateId, validator(userValidations.banUserSchema), checkToken, limiters.adminChangeLimiter, checkRoles(["admin"]), userController.banUser)
router.patch("/admin/:id/unban", validateId, checkToken, limiters.adminChangeLimiter, checkRoles(["admin"]), userController.unBanUser)

router.patch("/admin/:id/change-role", validateId, validator(userValidations.changeRoleSchema), checkToken, limiters.adminChangeLimiter, checkRoles(["admin"]), userController.changeUserRole)

router.post("/auth/signup", limiters.loginLimiter, imageUpload.single("avatar"), validator(userValidations.signUpSchema), userController.signUp)
router.post("/auth/login", limiters.loginLimiter, validator(userValidations.loginSchema), userController.login)
router.post("/auth/logout", checkToken, userController.logOut)
router.post("/refresh-token", validator(userValidations.refreshTokenSchema), userController.refreshToken)



module.exports = router