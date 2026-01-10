const express = require("express")
const router = express.Router()

const commentController = require("../controllers/commentController.js")

const { validateId, adminLimiter, checkRoles, checkToken, checkUserBan, checkSelfCommentAuthor } = require("../middlewares")

router.get("/me", checkToken, commentController.getUserComments)

router.get("/:id/comments", validateId, checkToken, adminLimiter, checkRoles(["admin"]), checkUserBan, commentController.getUserComments)


module.exports = router