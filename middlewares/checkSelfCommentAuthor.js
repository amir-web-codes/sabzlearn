const commentService = require("../services/commentService")

function checkSelfCommentAuthor(adminAllowed = false) {
    return async (req, res, next) => {
        const foundComment = await commentService.findCommentById(req.params.id)

        if (foundComment.authorId.equals(req.user.id) || (adminAllowed && req.user.role === "admin")) {
            req.comment = foundComment
            return next()
        }

        res.status(403).json({
            success: false,
            message: "you don't have access to this comment"
        })
    }
}

module.exports = checkSelfCommentAuthor