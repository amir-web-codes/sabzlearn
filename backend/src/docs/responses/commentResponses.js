module.exports = {
    CommentNotFound: {
        description: "Comment not found",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "comment not found" }
            }
        }
    },
    NoAccessToComment: {
        description: "User is not the author of this comment (and, depending on the route, not an admin either)",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "you don't have access to this comment" }
            }
        }
    },
    TooManyComments: {
        description: "User created a comment too recently (max 3 per minute)",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "you created comment recently, please try again later" }
            }
        }
    }
}