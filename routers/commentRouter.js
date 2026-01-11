const express = require("express")
const router = express.Router()

const commentController = require("../controllers/commentController.js")

const { validateId, adminLimiter, checkRoles, checkToken, checkUserBan, checkSelfCommentAuthor } = require("../middlewares")

router.get("/:id/comments", validateId, checkToken, adminLimiter, checkRoles(["admin"]), checkUserBan, commentController.getUserComments)

router.route("/:id")
    .get(validateId, checkToken, checkUserBan, checkSelfCommentAuthor(true), commentController.getCommentById)
    .patch(validateId, checkToken, checkUserBan, checkSelfCommentAuthor(false), commentController.editCommentById)
    .delete(validateId, checkToken, checkUserBan, checkSelfCommentAuthor(true), commentController.deleteCommentById)

module.exports = router