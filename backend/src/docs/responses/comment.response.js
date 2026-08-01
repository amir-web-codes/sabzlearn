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

    CommentAccessForbidden: {
        description: "403 — either the user is banned, or the user does not have access to this specific comment",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                    permanentBan: {
                        summary: "permanent ban",
                        value: { success: false, message: "you are permanently banned. Reason: Spam" }
                    },
                    temporaryBan: {
                        summary: "temporary ban",
                        value: { success: false, message: "you are temporary banned until: 2026-08-01T12:00:00.000Z. Reason: Spam" }
                    },
                    noAccess: {
                        summary: "not the comment's author (and not an admin, where admins are allowed)",
                        value: { success: false, message: "you don't have access to this comment" }
                    }
                }
            }
        }
    },

    AdminListCommentsForbidden: {
        description: "403 — either the caller is not an admin, or the requesting admin is banned",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                    notAdmin: {
                        summary: "caller is not an admin",
                        value: { success: false, message: "you don't have permission" }
                    },
                    permanentBan: {
                        summary: "permanent ban",
                        value: { success: false, message: "you are permanently banned. Reason: Spam" }
                    },
                    temporaryBan: {
                        summary: "temporary ban",
                        value: { success: false, message: "you are temporary banned until: 2026-08-01T12:00:00.000Z. Reason: Spam" }
                    }
                }
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
    },

    TooManyRequestsGlobalOrComment: {
        description: "Rate limit exceeded — either the global limiter (100 requests / 20 minutes) or the comment-creation limiter (3 requests / 1 minute) was triggered",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                    global: {
                        summary: "global rate limit (100 requests / 20 minutes)",
                        value: { success: false, message: "you're sending too many requests, slow down cowboy🤠" }
                    },
                    comment: {
                        summary: "comment-creation rate limit",
                        value: { success: false, message: "you created comment recently, please try again later" }
                    }
                }
            }
        }
    }
}