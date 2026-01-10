const commentService = require("../services/userService")

async function checkSelfCommentAuthor(adminAllowed = false) {
    return (req, res, next) => {
        const foundComment = commentService.findUserById(req.params.id)

        if (req.user.id === foundComment.authorId || adminAllowed) {
            return next()
        }

        res.status(403).json({
            success: false,
            message: "you don't have access to this comment"
        })
    }
}

module.exports = checkSelfCommentAuthor