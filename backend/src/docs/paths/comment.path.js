module.exports = {
    "/comments/admin/{id}/comments": {
        get: {
            tags: ["Comments", "Admins"],
            operationId: "getCommentsByUserId",
            summary: "List comments authored by a user (admin only)",
            description: `Admin-only list endpoint. id is validated only as a MongoDB ObjectId; the backend does not verify that a User document with that id exists, so an unknown but valid id returns 200 with data="no comments found".

Filtering by rating is exact/case-sensitive. sortBy=rating uses semantic rating order (Very Bad=1 through Very Good=5), not lexical string ordering. Returned comments are raw documents with unpopulated authorId/courseId.`,
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    $ref: "#/components/parameters/IdParameter"
                },
                {
                    $ref: "#/components/parameters/PageParameter"
                },
                {
                    $ref: "#/components/parameters/LimitParameter"
                },
                {
                    $ref: "#/components/parameters/CommentRatingFilterParameter"
                },
                {
                    $ref: "#/components/parameters/CommentSortByParameter"
                },
                {
                    $ref: "#/components/parameters/SortOrderParameter"
                }
            ],
            responses: {
                200: {
                    $ref: "#/components/responses/AdminUserCommentsFetchedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/InvalidIdOrValidationFailed"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/AdminListCommentsForbidden"
                },
                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrAdmin"
                },
                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/comments/{slug}/create": {
        post: {
            tags: ["Comments"],
            operationId: "createNewComment",
            summary: "Create a course comment",
            description: `Creates a comment on a published Course. title/text are required; rating defaults to Medium.

There is currently no enrollment requirement and no one-comment-per-Course rule. Any authenticated non-banned user can create multiple comments on a published Course. The response contains only success/message.`,
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    $ref: "#/components/parameters/SlugParameter"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/CreateComment"
                        }
                    }
                }
            },
            responses: {
                201: {
                    $ref: "#/components/responses/CommentCreatedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/FailedValidation"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/UserBanned"
                },
                404: {
                    $ref: "#/components/responses/CourseNotFound"
                },
                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrComment"
                },
                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/comments/{id}": {
        get: {
            tags: ["Comments"],
            operationId: "getCommentById",
            summary: "Get a comment by id",
            description: "Returns one raw Comment document. Access is allowed to its author or an admin.",
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    $ref: "#/components/parameters/IdParameter"
                }
            ],
            responses: {
                200: {
                    $ref: "#/components/responses/CommentFetchedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/InvalidId"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/CommentAccessForbidden"
                },
                404: {
                    $ref: "#/components/responses/CommentNotFound"
                },
                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobal"
                },
                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        },

        patch: {
            tags: ["Comments"],
            operationId: "editCommentById",
            summary: "Edit a comment",
            description: "Edits title/text/rating. Every field is optional and {} is valid. Only the original author may edit; there is no admin override for PATCH.",
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    $ref: "#/components/parameters/IdParameter"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/UpdateComment"
                        }
                    }
                }
            },
            responses: {
                200: {
                    $ref: "#/components/responses/CommentEditedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/InvalidIdOrValidationFailed"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/CommentAccessForbidden"
                },
                404: {
                    $ref: "#/components/responses/CommentNotFound"
                },
                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobal"
                },
                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        },

        delete: {
            tags: ["Comments"],
            operationId: "deleteCommentById",
            summary: "Delete a comment",
            description: "Physically deletes a Comment. The original author or an admin may delete it. Course aggregate rating is recomputed afterwards.",
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    $ref: "#/components/parameters/IdParameter"
                }
            ],
            responses: {
                200: {
                    $ref: "#/components/responses/CommentDeletedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/InvalidId"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/CommentAccessForbidden"
                },
                404: {
                    $ref: "#/components/responses/CommentNotFound"
                },
                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobal"
                },
                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/courses/{slug}/get-comments": {
        get: {
            tags: ["Comments", "Courses", "Admins", "Teachers"],
            operationId: "getCourseComments",
            summary: "List comments for a Course",
            description: `Course-management endpoint implemented by courseRouter/courseController/courseService.

Query validation runs before authentication, then authentication -> ban check -> admin/teacher role -> checkSelfCourseAuthor(true). Admins may access any non-deleted Course; teachers may access only Courses they instruct. Course status is NOT restricted by findCourseBySlug(), so draft/archived/closed Courses are also valid for authorized management access.

rating filtering is exact/case-sensitive. sortBy=rating uses semantic score order: Very Bad=1, Bad=2, Medium=3, Good=4, Very Good=5. Returned comments are raw documents with unpopulated authorId/courseId. Empty results use the exact string "no comment found". meta.rating is the Course's { average, count } object.`,
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    $ref: "#/components/parameters/SlugParameter"
                },
                {
                    $ref: "#/components/parameters/PageParameter"
                },
                {
                    $ref: "#/components/parameters/LimitParameter"
                },
                {
                    $ref: "#/components/parameters/CommentRatingFilterParameter"
                },
                {
                    $ref: "#/components/parameters/CommentSortByParameter"
                },
                {
                    $ref: "#/components/parameters/SortOrderParameter"
                }
            ],
            responses: {
                200: {
                    $ref: "#/components/responses/CourseCommentsFetchedForManagement"
                },
                400: {
                    $ref: "#/components/responses/FailedValidation"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/CourseOwnerOrAdminForbidden"
                },
                404: {
                    $ref: "#/components/responses/CourseNotFound"
                },
                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobal"
                },
                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    }
}