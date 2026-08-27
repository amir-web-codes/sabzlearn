module.exports = {
    "/tags/get-all": {
        get: {
            tags: ["Tags"],

            operationId: "getAllTags",

            summary: "List tags",

            description: `After the app-wide global limiter, route middleware order is just query validation. Search is a case-insensitive literal substring match on tag name. Pagination defaults to page=1 and limit=20; sorting defaults to createdAt desc.`,

            security: [],

            parameters: [
                {
                    $ref: "#/components/parameters/PageParameter"
                },
                {
                    $ref: "#/components/parameters/LimitParameter"
                },
                {
                    $ref: "#/components/parameters/TagSearchParameter"
                },
                {
                    $ref: "#/components/parameters/TagListSortByParameter"
                },
                {
                    $ref: "#/components/parameters/SortOrderParameter"
                }
            ],

            responses: {
                200: {
                    $ref: "#/components/responses/TagsFetchedSuccessfully"
                },

                400: {
                    $ref: "#/components/responses/FailedValidation"
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

    "/tags/admin/create": {
        post: {
            tags: ["Tags", "Admins"],

            operationId: "createTag",

            summary: "Create a tag (admin only)",

            description: `Admin-only JSON endpoint. After the app-wide global limiter, route middleware order is access-token authentication -> ban check -> admin-role check -> admin limiter -> body validation. The body is strict and accepts only name. name is trimmed and must be 2-50 characters. The backend generates slug from name and rejects duplicate names case-insensitively as well as generated-slug collisions.`,

            security: [
                {
                    bearerAuth: []
                }
            ],

            requestBody: {
                required: true,

                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/CreateTagRequest"
                        },

                        example: {
                            name: "Node.js"
                        }
                    }
                }
            },

            responses: {
                201: {
                    $ref: "#/components/responses/TagCreatedSuccessfully"
                },

                400: {
                    $ref: "#/components/responses/FailedValidation"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/ForbiddenOrBanned"
                },

                409: {
                    $ref: "#/components/responses/DuplicateTag"
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

    "/tags/{slug}/courses": {
        get: {
            tags: ["Tags", "Courses"],

            operationId: "getTagCourses",

            summary: "List published courses by tag",

            description: `Public endpoint. After the app-wide global limiter, the slug is validated first, then pagination/sort query parameters. The selected tag must exist. The service returns only courses directly containing that tag id with isDeleted=false and status=published. Results are lean raw Course documents without populate/projection. Pagination defaults to page=1 and limit=20; sorting defaults to createdAt desc. price sorts by finalPrice, students by studentsCount, and rating by rating.average.`,

            security: [],

            parameters: [
                {
                    $ref: "#/components/parameters/TagSlugParameter"
                },
                {
                    $ref: "#/components/parameters/PageParameter"
                },
                {
                    $ref: "#/components/parameters/LimitParameter"
                },
                {
                    $ref: "#/components/parameters/CourseListSortByParameter"
                },
                {
                    $ref: "#/components/parameters/SortOrderParameter"
                }
            ],

            responses: {
                200: {
                    $ref: "#/components/responses/TagCoursesFetchedSuccessfully"
                },

                400: {
                    $ref: "#/components/responses/FailedValidation"
                },

                404: {
                    $ref: "#/components/responses/TagNotFound"
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

    "/tags/{slug}": {
        get: {
            tags: ["Tags"],

            operationId: "getTagBySlug",

            summary: "Get a tag by slug",

            description: `Public endpoint. After the app-wide global limiter, the slug path parameter is trimmed and validated before lookup. The returned tag is not populated; createdBy remains a raw User ObjectId reference or null.`,

            security: [],

            parameters: [
                {
                    $ref: "#/components/parameters/TagSlugParameter"
                }
            ],

            responses: {
                200: {
                    $ref: "#/components/responses/TagFetchedSuccessfully"
                },

                400: {
                    $ref: "#/components/responses/FailedValidation"
                },

                404: {
                    $ref: "#/components/responses/TagNotFound"
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

    "/tags/admin/{slug}": {
        patch: {
            tags: ["Tags", "Admins"],

            operationId: "updateTag",

            summary: "Update a tag (admin only)",

            description: `Admin-only JSON endpoint. After the app-wide global limiter, route middleware order is authentication -> ban check -> admin-role check -> admin limiter -> slug validation -> body validation. The body is strict and currently accepts only name; {} is rejected with validation failed and No fields to update. If name changes, duplicate checks run and the backend regenerates the slug. createdBy is not changed.`,

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    $ref: "#/components/parameters/TagSlugParameter"
                }
            ],

            requestBody: {
                required: true,

                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/UpdateTagRequest"
                        },

                        example: {
                            name: "Backend"
                        }
                    }
                }
            },

            responses: {
                200: {
                    $ref: "#/components/responses/TagUpdatedSuccessfully"
                },

                400: {
                    $ref: "#/components/responses/FailedValidation"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/ForbiddenOrBanned"
                },

                404: {
                    $ref: "#/components/responses/TagNotFound"
                },

                409: {
                    $ref: "#/components/responses/DuplicateTag"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrAdmin"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        },

        delete: {
            tags: ["Tags", "Admins"],

            operationId: "deleteTag",

            summary: "Delete a tag (admin only)",

            description: `Admin-only hard delete. After the app-wide global limiter, route middleware order is authentication -> ban check -> admin-role check -> admin limiter -> slug validation. The force query is not Zod-validated; only the exact value force=true enables forced deletion. Without force, any non-deleted course assigned this tag causes 409. With force and at least one such course, the tag id is pulled from course tag arrays and the tag is deleted in the same MongoDB transaction. The conflict check intentionally ignores deleted courses.`,

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    $ref: "#/components/parameters/TagSlugParameter"
                },
                {
                    $ref: "#/components/parameters/TagForceDeleteParameter"
                }
            ],

            responses: {
                200: {
                    $ref: "#/components/responses/TagDeletedSuccessfully"
                },

                400: {
                    $ref: "#/components/responses/FailedValidation"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/ForbiddenOrBanned"
                },

                404: {
                    $ref: "#/components/responses/TagNotFound"
                },

                409: {
                    $ref: "#/components/responses/TagDeleteConflict"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrAdmin"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    }
}