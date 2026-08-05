module.exports = {
    "/lessons/admin/get-all": {
        get: {
            tags: ["Lessons", "Admins"],
            operationId: "getAllLessons",
            summary: "Get all lessons across all courses (admin)",
            description: "Get all lessons, optionally filtered by course, paginated. Results are cached in Redis unless a courseId filter is applied.",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/PageParameter" },
                { $ref: "#/components/parameters/LimitParameter" },
                { $ref: "#/components/parameters/CourseIdFilterParameter" },
                { $ref: "#/components/parameters/LessonSortByParameter" },
                { $ref: "#/components/parameters/SortOrderParameter" }
            ],
            responses: {
                200: {
                    description: "Lessons fetched successfully",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/LessonsListResponse" } } }
                },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/AdminListLessonsForbidden" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/lessons/{slug}/get-lessons": {
        get: {
            tags: ["Lessons"],
            operationId: "getCourseLessons",
            summary: "Get all lessons of a course",
            description: "Get all lessons belonging to a course, by course slug. Available to active enrollees, the course instructor, and administrators. Unlike the admin get-all endpoint, this always returns an array (even if empty). Results are cached in Redis.",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/SlugParameter" },
                { $ref: "#/components/parameters/PageParameter" },
                { $ref: "#/components/parameters/LimitParameter" },
                { $ref: "#/components/parameters/LessonSortByParameter" },
                { $ref: "#/components/parameters/SortOrderParameter" }
            ],
            responses: {
                200: {
                    description: "Course lessons fetched successfully",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/CourseLessonsListResponse" } } }
                },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/CourseContentForbidden" },
                404: { $ref: "#/components/responses/CourseNotFound" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/lessons/courses/{slug}/create": {
        post: {
            tags: ["Lessons"],
            operationId: "createNewLesson",
            summary: "Create a lesson",
            description: "Create a new lesson under a course. Only the course's owning teacher may add lessons to it — admins are NOT exempt from this check. If order is omitted, it's auto-calculated as (the course's last lesson order) + 100. Requires multipart/form-data; the video is optional but, if omitted, duration stays 0 until a video is uploaded via edit.",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/SlugParameter" }
            ],
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: { $ref: "#/components/schemas/CreateLessonMultipart" }
                    }
                }
            },
            responses: {
                201: {
                    description: "Lesson added successfully",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/LessonByIdResponse" } } }
                },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/CreateLessonForbidden" },
                404: { $ref: "#/components/responses/CourseNotFound" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/lessons/{id}": {
        get: {
            tags: ["Lessons"],
            operationId: "getLessonById",
            summary: "Get lesson by id",
            description: "Returns lesson content to active enrollees, the course instructor, or an administrator.",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/IdParameter" }
            ],
            responses: {
                200: {
                    description: "Lesson fetched successfully",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/LessonByIdResponse" } } }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/CourseContentForbidden" },
                404: { $ref: "#/components/responses/LessonNotFound" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        },

        patch: {
            tags: ["Lessons"],
            operationId: "editLesson",
            summary: "Edit a lesson",
            description: "Edit a lesson. Only the lesson's original publisher may edit it — admins cannot override this (unlike DELETE). Requires multipart/form-data.",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/IdParameter" }
            ],
            requestBody: {
                required: false,
                content: {
                    "multipart/form-data": {
                        schema: { $ref: "#/components/schemas/EditLessonMultipart" }
                    }
                }
            },
            responses: {
                200: {
                    description: "Lesson edited successfully",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/LessonByIdResponse" } } }
                },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/LessonOwnershipForbidden" },
                404: { $ref: "#/components/responses/LessonNotFound" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        },

        delete: {
            tags: ["Lessons"],
            operationId: "deleteLesson",
            summary: "Delete a lesson",
            description: "Delete a lesson. Allowed for the lesson's original publisher, or any admin.",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/IdParameter" }
            ],
            responses: {
                200: {
                    description: "Lesson deleted successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "lesson deleted successfully" }
                        }
                    }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/LessonOwnershipForbidden" },
                404: { $ref: "#/components/responses/LessonNotFound" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    }
}