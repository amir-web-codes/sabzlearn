const express = require("express")
const router = express.Router()

const commentController = require("../controllers/commentController.js")

const { validateId, limiters, checkRoles, checkToken, checkUserBan, checkSelfs } = require("../middlewares")

router.get("/:id/comments", validateId, checkToken, limiters.adminLimiter, checkRoles(["admin"]), checkUserBan, commentController.getUserComments)

const validator = require("../middlewares/validator")
const commentValidations = require("../middlewares/validations/comment.validation")


router.route("/:id")
    .get(validateId, checkToken, checkUserBan, checkSelfs.checkSelfCommentAuthor(true), commentController.getCommentById)
    .patch(validateId, validator(commentValidations.updateSchema), checkToken, checkUserBan, checkSelfs.checkSelfCommentAuthor(false), commentController.editCommentById)
    .delete(validateId, checkToken, checkUserBan, checkSelfs.checkSelfCommentAuthor(true), commentController.deleteCommentById)

router.post("/:slug/create", validator(commentValidations.createSchema), limiters.commentLimiter, checkToken, checkUserBan, commentController.createNewComment)

module.exports = router