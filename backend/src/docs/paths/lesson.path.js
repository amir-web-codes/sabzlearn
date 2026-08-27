module.exports = {
    "/lessons/admin/get-all": {
        get: {
            tags: ["Lessons", "Admins"],
            operationId: "getAllLessons",
            summary: "List all lessons (admin only)",
            description: `Admin-only lesson list. Route middleware order is query validation -> access-token authentication -> ban check -> admin-role check -> admin limiter. page defaults to 1, limit to 20, sortBy to order, and sortOrder to desc. courseId is an optional exact ObjectId filter; the backend validates its format but does not verify the referenced course exists. When courseId is omitted, results may be served from Redis; when it is supplied, this service intentionally skips list caching. Empty results are returned as the exact string \`no lesson found\`, not an empty array.`,
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    $ref: "#/components/parameters/PageParameter"
                },
                {
                    $ref: "#/components/parameters/LimitParameter"
                },
                {
                    $ref: "#/components/parameters/LessonCourseIdFilterParameter"
                },
                {
                    $ref: "#/components/parameters/LessonSortByParameter"
                },
                {
                    $ref: "#/components/parameters/SortOrderParameter"
                }
            ],
            responses: {
                200: {
                    $ref: "#/components/responses/LessonsFetchedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/FailedValidation"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/LessonAdminListForbidden"
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

    "/lessons/{slug}/get-lessons": {
        get: {
            tags: ["Lessons", "Courses"],
            operationId: "getCourseLessons",
            summary: "List lessons of a course",
            description: `Authenticated course-content endpoint. Route middleware order is query validation -> authentication -> ban check -> course access check. The course access middleware resolves slug using findCourseBySlug(), so the course must currently be published and not deleted. Access is granted to the course instructor or a user with an active enrollment. adminAllowed is false, therefore the admin role alone does not bypass this requirement. Results are cached in Redis and the empty state is always an empty array. Sorting defaults to order desc.`,
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
                    $ref: "#/components/parameters/LessonSortByParameter"
                },
                {
                    $ref: "#/components/parameters/SortOrderParameter"
                }
            ],
            responses: {
                200: {
                    $ref: "#/components/responses/CourseLessonsFetchedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/FailedValidation"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/LessonCourseContentForbidden"
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
    },

    "/lessons/courses/{slug}/create": {
        post: {
            tags: ["Lessons", "Courses"],
            operationId: "createLesson",
            summary: "Create a lesson",
            description: `Creates a lesson under a course using multipart/form-data. Route middleware order is authentication -> ban check -> role check (admin/teacher) -> course-instructor check -> MP4 upload parser -> body validation -> controller. The ownership check uses checkSelfCourseAuthor(false), so an admin has no ownership override and can create only when that admin is the course instructor. The course must be published and not deleted because the ownership check resolves it through findCourseBySlug(). title and description are required; video is optional. If order is omitted, the service uses the greatest existing order for that course + 100, or 100 when no lessons exist. The video field accepts video/mp4 only, up to 100 MiB. Current Multer file-type/size errors have no explicit 4xx status and therefore surface through the current global error handler as 500 internal server error.`,
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
                    "multipart/form-data": {
                        schema: {
                            $ref: "#/components/schemas/CreateLessonMultipart"
                        }
                    }
                }
            },
            responses: {
                201: {
                    $ref: "#/components/responses/LessonAddedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/FailedValidation"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/LessonCreateForbidden"
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
    },

    "/lessons/{slug}/{id}": {
        get: {
            tags: ["Lessons", "Courses"],
            operationId: "getLessonById",
            summary: "Get a lesson by id",
            description: `Returns a lesson document. The actual backend route requires both slug and id. Middleware order is id validation -> authentication -> ban check -> course access check. The supplied slug is resolved as a published/non-deleted course and access requires that course's instructor or an active enrollment; admin role alone is not enough. The controller then loads the lesson by id.`,
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
                    $ref: "#/components/parameters/IdParameter"
                }
            ],
            responses: {
                200: {
                    $ref: "#/components/responses/LessonFetchedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/InvalidId"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/LessonCourseContentForbidden"
                },
                404: {
                    $ref: "#/components/responses/LessonOrCourseNotFound"
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
            tags: ["Lessons"],
            operationId: "editLesson",
            summary: "Edit a lesson",
            description: `Edits title, description, order and/or video using multipart/form-data. The route path currently requires slug as well as id, but PATCH authorization/service logic uses the lesson id and does not re-resolve the course from slug. Middleware order is id validation -> authentication -> ban check -> role check (admin/teacher) -> original-publisher check -> MP4 parser -> body validation. checkSelfLessonAuthor(false) means only the original publisher may edit; admin has no override unless that admin is the publisher. Every field is optional: an empty PATCH is valid and returns the unchanged lesson, and a file-only PATCH is valid. A new video replaces the previous video and recomputes duration; removeVideo="true" removes the old video and resets duration to 0 when no new file is supplied. Storage deletion of the previous video is best-effort after the database save. The video field accepts MP4 up to 100 MiB; current Multer rejection errors surface as 500.`,
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
                    $ref: "#/components/parameters/IdParameter"
                }
            ],
            requestBody: {
                required: false,
                content: {
                    "multipart/form-data": {
                        schema: {
                            $ref: "#/components/schemas/EditLessonMultipart"
                        }
                    }
                }
            },
            responses: {
                200: {
                    $ref: "#/components/responses/LessonEditedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/InvalidIdOrValidationFailed"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/LessonEditForbidden"
                },
                404: {
                    $ref: "#/components/responses/LessonNotFound"
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
            tags: ["Lessons"],
            operationId: "deleteLesson",
            summary: "Delete a lesson",
            description: `Hard-deletes a lesson. The route path currently requires slug as well as id, but DELETE authorization/service logic uses the lesson id and does not resolve slug. Middleware order is id validation -> authentication -> ban check -> role check (admin/teacher) -> lesson access check. checkSelfLessonAuthor(true) allows the original publisher or any admin; a teacher who did not publish the lesson has no override. If a stored video exists, Cloudinary deletion is attempted after the database delete and storage errors are intentionally ignored.`,
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
                    $ref: "#/components/parameters/IdParameter"
                }
            ],
            responses: {
                200: {
                    $ref: "#/components/responses/LessonDeletedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/InvalidId"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/LessonDeleteForbidden"
                },
                404: {
                    $ref: "#/components/responses/LessonNotFound"
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