const express = require("express")
const router = express.Router()

const commentController = require("../controllers/commentController.js")

const { validateId, limiters, checkRoles, checkToken, checkUserBan, checkSelfCommentAuthor } = require("../middlewares")

router.get("/:id/comments", validateId, checkToken, limiters.adminLimiter, checkRoles(["admin"]), checkUserBan, commentController.getUserComments)

router.route("/:id")
    .get(validateId, checkToken, checkUserBan, checkSelfCommentAuthor(true), commentController.getCommentById)
    .patch(validateId, checkToken, checkUserBan, checkSelfCommentAuthor(false), commentController.editCommentById)
    .delete(validateId, checkToken, checkUserBan, checkSelfCommentAuthor(true), commentController.deleteCommentById)

router.post("/:slug/create", limiters.commentLimiter, checkToken, checkUserBan, commentController.createNewComment)

module.exports = router