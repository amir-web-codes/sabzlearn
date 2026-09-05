const express = require("express")
const router = express.Router()

const commentController = require("../controllers/commentController.js")

const { validateId, limiters, checkRoles, checkToken, checkUserBan, checkSelfs, checkEnrollmentOrOwnership } = require("../middlewares")

const validator = require("../middlewares/validator")
const commentValidations = require("../middlewares/validations/comment.validation")

router.get(
    "/admin/:id/comments",
    validateId,
    validator(commentValidations.getUserCommentsQuerySchema, "query"),
    checkToken,
    limiters.adminLimiter,
    checkRoles(["admin"]),
    checkUserBan,
    commentController.getUserComments
)

router.route("/:id")
    .get(validateId, checkToken, checkUserBan, checkSelfs.checkSelfCommentAuthor(true), commentController.getCommentById)
    .patch(validateId, checkToken, checkUserBan, validator(commentValidations.updateSchema), checkSelfs.checkSelfCommentAuthor(false), commentController.editCommentById)
    .delete(validateId, checkToken, checkUserBan, checkSelfs.checkSelfCommentAuthor(true), commentController.deleteCommentById)

router.post("/:slug/create", validator(commentValidations.createSchema), limiters.commentLimiter, checkToken, checkUserBan, checkEnrollmentOrOwnership(false), commentController.createNewComment)

module.exports = router