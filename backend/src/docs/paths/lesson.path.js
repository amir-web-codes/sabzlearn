module.exports = {
    "/lessons/admin/get-all": {
        get: {
            description: "Get all lessons across all courses, paginated (admin only). Results are cached in Redis for 10 minutes.",
            summary: "Get all lessons (admin)",
            tags: ["Lessons", "Admins"],
            parameters: [
                { $ref: "#/components/parameters/PageParameter" },
                { $ref: "#/components/parameters/LimitParameter" }
            ],
            responses: {
                200: {
                    description: "lessons fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "lessons fetched successfully" },
                                    data: {
                                        oneOf: [
                                            { type: "array", items: { $ref: "#/components/schemas/Lesson" } },
                                            { type: "string", example: "no lesson found" }
                                        ]
                                    },
                                    meta: { $ref: "#/components/schemas/PaginationMeta" }
                                }
                            }
                        }
                    }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: {
                    description: "user is banned OR user is not an admin",
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
                                forbidden: {
                                    summary: "not an admin",
                                    value: { success: false, message: "you don't have permission" }
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

    "/lessons/{slug}/get-lessons": {
        get: {
            description: "Get all lessons belonging to a course, by course slug. Note: unlike /getall, this endpoint always returns an array (even if empty), never a \"no lesson found\" string.",
            summary: "Get course lessons",
            tags: ["Lessons"],
            parameters: [
                { $ref: "#/components/parameters/SlugParameter" },
                { $ref: "#/components/parameters/PageParameter" },
                { $ref: "#/components/parameters/LimitParameter" }
            ],
            responses: {
                200: {
                    description: "course lessons fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "course lessons fetched successfully" },
                                    data: { type: "array", items: { $ref: "#/components/schemas/Lesson" } },
                                    meta: { $ref: "#/components/schemas/PaginationMeta" }
                                }
                            }
                        }
                    }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/UserBanned" },
                404: { $ref: "#/components/responses/CourseNotFound" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/lessons/courses/{slug}/create": {
        post: {
            description: "Create a new lesson under a course. Any admin or teacher can create a lesson for any course (no ownership check on the course itself). If order is omitted, it's auto-calculated as (last lesson's order in the course) + 100.",
            summary: "Create a lesson",
            tags: ["Lessons"],
            parameters: [
                { $ref: "#/components/parameters/SlugParameter" }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/CreateLesson" },
                        example: { title: "Introduction to Hooks", description: "Learn the basics of React Hooks.", duration: 15 }
                    }
                }
            },
            responses: {
                201: {
                    description: "lesson added successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "lesson added successfully" },
                                    data: { $ref: "#/components/schemas/Lesson" }
                                }
                            }
                        }
                    }
                },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: {
                    description: "user is banned OR user is not an admin/teacher",
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
                                forbidden: {
                                    summary: "not admin/teacher",
                                    value: { success: false, message: "you don't have permission" }
                                }
                            }
                        }
                    }
                },
                404: { $ref: "#/components/responses/CourseNotFound" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/lessons/{id}": {
        get: {
            description: "Get a single lesson by id",
            summary: "Get lesson by id",
            tags: ["Lessons"],
            parameters: [
                { $ref: "#/components/parameters/IdParameter" }
            ],
            responses: {
                200: {
                    description: "lesson fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "lesson fetched successfully" },
                                    data: { $ref: "#/components/schemas/Lesson" }
                                }
                            }
                        }
                    }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/UserBanned" },
                404: { $ref: "#/components/responses/LessonNotFound" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        },

        patch: {
            description: "Edit a lesson. Only the lesson's original publisher may edit it — unlike delete, admins cannot override this even for lessons they didn't publish.",
            summary: "Edit a lesson",
            tags: ["Lessons"],
            parameters: [
                { $ref: "#/components/parameters/IdParameter" }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/EditLesson" },
                        example: { title: "Introduction to Hooks (updated)" }
                    }
                }
            },
            responses: {
                201: {
                    description: "lesson edited successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "lesson edited successfully" },
                                    data: { $ref: "#/components/schemas/Lesson" }
                                }
                            }
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
                                            { code: "too_small", path: ["title"], message: "String must contain at least 5 character(s)" }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: {
                    description: "user is banned OR user is not an admin/teacher OR user is not this lesson's publisher",
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
                                forbidden: {
                                    summary: "not admin/teacher",
                                    value: { success: false, message: "you don't have permission" }
                                },
                                notPublisher: {
                                    summary: "not this lesson's publisher (admins are NOT exempt here)",
                                    value: { success: false, message: "you don't have access to this lesson" }
                                }
                            }
                        }
                    }
                },
                404: { $ref: "#/components/responses/LessonNotFound" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        },

        delete: {
            description: "Delete a lesson. Allowed for the lesson's original publisher, or any admin.",
            summary: "Delete a lesson",
            tags: ["Lessons"],
            parameters: [
                { $ref: "#/components/parameters/IdParameter" }
            ],
            responses: {
                200: {
                    description: "lesson deleted successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "lesson deleted successfully" }
                        }
                    }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: {
                    description: "user is banned OR user is not an admin/teacher OR user is neither an admin nor this lesson's publisher",
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
                                forbidden: {
                                    summary: "not admin/teacher",
                                    value: { success: false, message: "you don't have permission" }
                                },
                                noAccess: {
                                    summary: "not publisher and not admin",
                                    value: { success: false, message: "you don't have access to this lesson" }
                                }
                            }
                        }
                    }
                },
                404: { $ref: "#/components/responses/LessonNotFound" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    }
}