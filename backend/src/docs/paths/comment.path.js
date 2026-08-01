module.exports = {
    "/comments/{id}/comments": {
        get: {
            tags: ["Comments", "Admins"],
            operationId: "getUserComments",
            summary: "Get a user's comments (admin)",
            description: "Get all comments authored by a specific user, by user id (admin only).",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/IdParameter" },
                { $ref: "#/components/parameters/PageParameter" },
                { $ref: "#/components/parameters/LimitParameter" },
                { $ref: "#/components/parameters/CommentRatingFilterParameter" },
                { $ref: "#/components/parameters/CommentSortByParameter" },
                { $ref: "#/components/parameters/SortOrderParameter" }
            ],
            responses: {
                200: {
                    description: "Comments fetched successfully",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/CommentsListResponse" } } }
                },
                400: { $ref: "#/components/responses/InvalidIdOrValidationFailed" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/AdminListCommentsForbidden" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/comments/{slug}/create": {
        post: {
            tags: ["Comments"],
            operationId: "createNewComment",
            summary: "Create a comment",
            description: "Create a new comment/review on a course. Note: no enrollment check is currently enforced — any authenticated, non-banned user can comment on any course, and there is no restriction against posting multiple comments on the same course.",
            security: [{ bearerAuth: [] }],
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
                    description: "Comment created successfully",
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
                429: { $ref: "#/components/responses/TooManyRequestsGlobalOrComment" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/comments/{id}": {
        get: {
            tags: ["Comments"],
            operationId: "getCommentById",
            summary: "Get comment by id",
            description: "Get a single comment by id (author or admin only).",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/IdParameter" }
            ],
            responses: {
                200: {
                    description: "Comment fetched successfully",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/CommentByIdResponse" } } }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/CommentAccessForbidden" },
                404: { $ref: "#/components/responses/CommentNotFound" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        },

        patch: {
            tags: ["Comments"],
            operationId: "editCommentById",
            summary: "Edit a comment",
            description: "Edit a comment. Only the comment's original author may edit it — admins cannot override this (unlike GET and DELETE).",
            security: [{ bearerAuth: [] }],
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
                    description: "Comment edited successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "comment edited successfully" }
                        }
                    }
                },
                400: { $ref: "#/components/responses/InvalidIdOrValidationFailed" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/CommentAccessForbidden" },
                404: { $ref: "#/components/responses/CommentNotFound" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        },

        delete: {
            tags: ["Comments"],
            operationId: "deleteCommentById",
            summary: "Delete a comment",
            description: "Delete a comment. Allowed for the comment's original author, or any admin.",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/IdParameter" }
            ],
            responses: {
                200: {
                    description: "Comment deleted successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "comment deleted successfully" }
                        }
                    }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/CommentAccessForbidden" },
                404: { $ref: "#/components/responses/CommentNotFound" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    }
}