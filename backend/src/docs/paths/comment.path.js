module.exports = {
    "/comments/{id}/comments": {
        get: {
            description: "Get all comments authored by a specific user, by user id (admin only)",
            summary: "Get a user's comments (admin)",
            tags: ["Comments", "Admins"],
            parameters: [
                { $ref: "#/components/parameters/IdParameter" },
                { $ref: "#/components/parameters/PageParameter" },
                { $ref: "#/components/parameters/LimitParameter" }
            ],
            responses: {
                200: {
                    description: "comments fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "comments fetched successfully" },
                                    data: {
                                        oneOf: [
                                            { type: "array", items: { $ref: "#/components/schemas/Comment" } },
                                            { type: "string", example: "no comments found" }
                                        ]
                                    },
                                    meta: { $ref: "#/components/schemas/PaginationMeta" }
                                }
                            }
                        }
                    }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: {
                    description: "user is not an admin OR user (the requesting admin) is banned",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            examples: {
                                forbidden: {
                                    summary: "not an admin",
                                    value: { success: false, message: "you don't have permission" }
                                },
                                permanentBan: {
                                    summary: "permanent ban",
                                    value: { success: false, message: "you are permanently banned. Reason: violating rules" }
                                },
                                temporaryBan: {
                                    summary: "temporary ban",
                                    value: { success: false, message: "you are temporary banned until: 2026-08-01T12:00:00.000Z. Reason: spam" }
                                }
                            }
                        }
                    }
                },
                429: { $ref: "#/components/responses/TooManyAdminRequests" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/comments/{slug}/create": {
        post: {
            description: "Create a new comment/review on a course. Note: no enrollment check is currently enforced — any authenticated, non-banned user can comment on any course, and there is no restriction against posting multiple comments on the same course.",
            summary: "Create a comment",
            tags: ["Comments"],
            parameters: [
                { $ref: "#/components/parameters/SlugParameter" }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/CreateComment" },
                        example: { title: "Great course!", text: "Learned a lot, well explained.", rating: "Good" }
                    }
                }
            },
            responses: {
                201: {
                    description: "comment created successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "comment created successfully" }
                        }
                    }
                },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/UserBanned" },
                404: { $ref: "#/components/responses/CourseNotFound" },
                429: { $ref: "#/components/responses/TooManyComments" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/comments/{id}": {
        get: {
            description: "Get a single comment by id (author or admin only)",
            summary: "Get comment by id",
            tags: ["Comments"],
            parameters: [
                { $ref: "#/components/parameters/IdParameter" }
            ],
            responses: {
                200: {
                    description: "comment fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "comment fetched successfully" },
                                    data: { $ref: "#/components/schemas/Comment" }
                                }
                            }
                        }
                    }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: {
                    description: "user is banned OR user is neither the comment's author nor an admin",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            examples: {
                                permanentBan: {
                                    summary: "permanent ban",
                                    value: { success: false, message: "you are permanently banned. Reason: violating rules" }
                                },
                                temporaryBan: {
                                    summary: "temporary ban",
                                    value: { success: false, message: "you are temporary banned until: 2026-08-01T12:00:00.000Z. Reason: spam" }
                                },
                                noAccess: {
                                    summary: "not author and not admin",
                                    value: { success: false, message: "you don't have access to this comment" }
                                }
                            }
                        }
                    }
                },
                404: { $ref: "#/components/responses/CommentNotFound" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        },

        patch: {
            description: "Edit a comment. Only the comment's original author may edit it — admins cannot override this (unlike GET and DELETE).",
            summary: "Edit a comment",
            tags: ["Comments"],
            parameters: [
                { $ref: "#/components/parameters/IdParameter" }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/UpdateComment" },
                        example: { text: "Updated review text." }
                    }
                }
            },
            responses: {
                200: {
                    description: "comment edited successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "comment edited successfully" }
                        }
                    }
                },
                400: {
                    description: "invalid id path parameter OR request body failed validation",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            examples: {
                                invalidId: {
                                    summary: "invalid id",
                                    value: { success: false, message: "invalid id" }
                                },
                                failedValidation: {
                                    summary: "body validation failed",
                                    value: {
                                        success: false,
                                        message: "validation failed",
                                        errors: [
                                            { code: "too_small", path: ["text"], message: "String must contain at least 3 character(s)" }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: {
                    description: "user is banned OR user is not this comment's author (admins are NOT exempt here)",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            examples: {
                                permanentBan: {
                                    summary: "permanent ban",
                                    value: { success: false, message: "you are permanently banned. Reason: violating rules" }
                                },
                                temporaryBan: {
                                    summary: "temporary ban",
                                    value: { success: false, message: "you are temporary banned until: 2026-08-01T12:00:00.000Z. Reason: spam" }
                                },
                                notAuthor: {
                                    summary: "not the comment's author",
                                    value: { success: false, message: "you don't have access to this comment" }
                                }
                            }
                        }
                    }
                },
                404: { $ref: "#/components/responses/CommentNotFound" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        },

        delete: {
            description: "Delete a comment. Allowed for the comment's original author, or any admin.",
            summary: "Delete a comment",
            tags: ["Comments"],
            parameters: [
                { $ref: "#/components/parameters/IdParameter" }
            ],
            responses: {
                200: {
                    description: "comment deleted successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "comment deleted successfully" }
                        }
                    }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: {
                    description: "user is banned OR user is neither the comment's author nor an admin",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            examples: {
                                permanentBan: {
                                    summary: "permanent ban",
                                    value: { success: false, message: "you are permanently banned. Reason: violating rules" }
                                },
                                temporaryBan: {
                                    summary: "temporary ban",
                                    value: { success: false, message: "you are temporary banned until: 2026-08-01T12:00:00.000Z. Reason: spam" }
                                },
                                noAccess: {
                                    summary: "not author and not admin",
                                    value: { success: false, message: "you don't have access to this comment" }
                                }
                            }
                        }
                    }
                },
                404: { $ref: "#/components/responses/CommentNotFound" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    }
}