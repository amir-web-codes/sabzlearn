module.exports = {
    "/comments/{id}/comments": {
        get: {
            tags: ["Comments", "Admins"],
            operationId: "getCommentsByUserId",
            summary: "List comments authored by a user (admin only)",
            description: "Admin-only list endpoint. `id` is validated only as a MongoDB ObjectId; the backend does not verify that a User document with that id exists, so an unknown but valid id returns 200 with `data: \"no comments found\"`. Query validation runs before authentication. After authentication, the admin limiter runs before the admin-role check, and the ban check runs after the role check. Filtering by rating is exact/case-sensitive. `sortBy=rating` sorts the stored rating strings, not their semantic 1-5 score. Returned comments are lean raw documents with unpopulated `authorId` and `courseId`.",
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
            description: "Creates a comment on a course. The body validator runs first, then the comment-specific limiter (3 requests per IP per minute), then bearer authentication, then the ban check. Because of that order, an invalid body can return 400 before authentication and the comment limiter can return 429 before a missing/invalid token reaches `checkToken`. `title` and `text` are required; `rating` defaults to `Medium`. The course slug is passed to `findCourseBySlug()` as supplied, and only an exact matching, non-deleted, `published` course can be commented on. There is currently no enrollment check and no one-comment-per-course rule, so any authenticated non-banned user can create multiple comments on a published course. After creation the service recomputes the course rating average/count from all course comments. The response contains only success/message, not the created document.",
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
                        },
                        examples: {
                            explicitRating: {
                                summary: "Explicit rating",
                                value: {
                                    title: "Great course!",
                                    text: "Learned a lot, well explained.",
                                    rating: "Good"
                                }
                            },
                            defaultRating: {
                                summary: "rating omitted; backend sets Medium",
                                value: {
                                    title: "Useful course",
                                    text: "The explanations were clear."
                                }
                            }
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
            description: "Returns one raw Comment document. The id is validated before authentication. After bearer authentication and the ban check, `checkSelfCommentAuthor(true)` loads the comment and allows either its original author or any admin; otherwise it returns 403. The access middleware is also what produces the normal 404 `comment not found`. `authorId` and `courseId` remain raw ObjectIds.",
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
            description: "Edits only `title`, `text`, and/or `rating`. The id is validated before authentication. The order after that is authentication -> ban check -> body validation -> ownership check. Therefore an authenticated non-owner can receive a 400 validation error before the ownership middleware reaches its 403. All body fields are optional and `{}` is valid, returning success without changing anything. Only the original author may edit; `checkSelfCommentAuthor(false)` does not grant an admin override. If `rating` is present, the service recomputes the course aggregate rating; title/text-only edits do not. The response contains only success/message, not the updated document.",
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
                        },
                        examples: {
                            updateText: {
                                value: {
                                    text: "Updated review text."
                                }
                            },
                            updateRating: {
                                value: {
                                    rating: "Very Good"
                                }
                            },
                            noOp: {
                                summary: "Valid no-op body",
                                value: {}
                            }
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
            description: "Deletes a comment by id. The id is validated before authentication. After authentication and the ban check, access is allowed to the original author or any admin. Deletion is physical (`findByIdAndDelete`), not a soft delete. After deletion the service recomputes the course aggregate rating from the remaining comments. The response contains only success/message.",
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
            tags: ["Comments", "Courses"],
            operationId: "getCourseComments",
            summary: "List comments for a course (admin/teacher)",
            description: "Comment-related endpoint implemented in courseRouter/courseController/courseService. Query validation runs before authentication, followed by bearer authentication -> ban check -> role check (`admin` or `teacher`) -> course ownership check. Admins may access any course that `findCourseBySlug()` can resolve; teachers may access only a course whose `instructor` equals their user id. `findCourseBySlug()` requires an exact slug plus `isDeleted=false` and `status=published`, so even the owning teacher receives 404 for a draft/archived/closed/deleted course. Filtering by rating is exact/case-sensitive. `sortBy=rating` sorts rating strings, not their numeric meaning. Returned comments are raw lean Comment documents with unpopulated authorId/courseId. Empty results use the exact string `no comment found`. `meta.rating` is the course's stored `{ average, count }` object. There is no route-specific limiter here; only the global limiter applies.",
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
                    $ref: "#/components/responses/CourseCommentsFetchedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/FailedValidation"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/CourseCommentsForbidden"
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