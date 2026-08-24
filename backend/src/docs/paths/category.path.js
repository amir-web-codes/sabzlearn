module.exports = {
    "/categories/get-all": {
        get: {
            tags: ["Categories"],
            operationId: "getAllCategories",
            summary: "List categories",
            description: `Public category listing with optional authentication. Anonymous users and authenticated non-admin users receive only active categories. A valid admin bearer token can request inactive categories with ?inactive=true; inactive=true is otherwise silently ignored. The optional-token middleware runs before query validation, so an invalid/expired supplied token returns 401 even if the query is also invalid. Search is a case-insensitive literal substring match on name.`,
            security: [
                { bearerAuth: [] },
                {}
            ],
            parameters: [
                { $ref: "#/components/parameters/PageParameter" },
                { $ref: "#/components/parameters/LimitParameter" },
                { $ref: "#/components/parameters/CategorySearchParameter" },
                { $ref: "#/components/parameters/CategoryInactiveParameter" },
                { $ref: "#/components/parameters/CategoryListSortByParameter" },
                { $ref: "#/components/parameters/SortOrderAscParameter" }
            ],
            responses: {
                200: {
                    $ref: "#/components/responses/CategoriesFetchedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/FailedValidation"
                },
                401: {
                    $ref: "#/components/responses/InvalidOptionalBearerToken"
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

    "/categories/{slug}/courses": {
        get: {
            tags: ["Categories", "Courses"],
            operationId: "getCategoryCourses",
            summary: "List published courses in a category tree",
            description: `Public endpoint. The backend resolves the requested category plus every descendant category using MongoDB graphLookup, then returns courses whose category is in that tree, isDeleted=false, and status=published. The category lookup used here does not filter category status, so the current implementation can return published courses even when the root category or descendants are inactive. Course documents are returned with lean() and without populate/projection, so ObjectId references remain raw.`,
            security: [],
            parameters: [
                { $ref: "#/components/parameters/CategorySlugParameter" },
                { $ref: "#/components/parameters/PageParameter" },
                { $ref: "#/components/parameters/LimitParameter" },
                { $ref: "#/components/parameters/CategoryCoursesSortByParameter" },
                { $ref: "#/components/parameters/SortOrderParameter" }
            ],
            responses: {
                200: {
                    $ref: "#/components/responses/CategoryCoursesFetchedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/FailedValidation"
                },
                404: {
                    $ref: "#/components/responses/CategoryNotFound"
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

    "/categories/admin/create": {
        post: {
            tags: ["Categories", "Admins"],
            operationId: "createCategory",
            summary: "Create a category (admin only)",
            description: `Admin-only multipart endpoint. Middleware order is access-token authentication -> ban check -> admin-role check -> admin limiter -> image parser -> body validation. name is required; description defaults to an empty string, sortOrder to 0, and status to active. parent may be omitted/null (or sent as an empty multipart text field) for a root category. Sibling names must be unique case-insensitively. The backend generates a unique slug from name. icon is optional and accepts JPEG/PNG/WebP up to 2 MiB. Current Multer errors do not receive a 4xx status in errorHandler, so an invalid file type or oversized image currently surfaces as 500 internal server error.`,
            security: [
                { bearerAuth: [] }
            ],
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            $ref: "#/components/schemas/CreateCategoryForm"
                        }
                    }
                }
            },
            responses: {
                201: {
                    $ref: "#/components/responses/CategoryCreatedSuccessfully"
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
                    $ref: "#/components/responses/ParentCategoryNotFound"
                },
                409: {
                    $ref: "#/components/responses/DuplicateSiblingCategory"
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

    "/categories/{slug}": {
        get: {
            tags: ["Categories"],
            operationId: "getCategoryBySlug",
            summary: "Get a category by slug",
            description: `Public category detail with optional authentication. Active categories are visible to everyone. An inactive category is returned only when the supplied valid access token has role=admin; otherwise it is intentionally hidden behind the same 404 category not found response. The optional-token middleware runs before slug validation, so an invalid/expired supplied token returns 401 before a malformed slug reaches validation. parent and createdBy are populated in the response.`,
            security: [
                { bearerAuth: [] },
                {}
            ],
            parameters: [
                { $ref: "#/components/parameters/CategorySlugParameter" }
            ],
            responses: {
                200: {
                    $ref: "#/components/responses/CategoryFetchedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/FailedValidation"
                },
                401: {
                    $ref: "#/components/responses/InvalidOptionalBearerToken"
                },
                404: {
                    $ref: "#/components/responses/CategoryNotFound"
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
            tags: ["Categories", "Admins"],
            operationId: "updateCategory",
            summary: "Update a category (admin only)",
            description: `Admin-only multipart endpoint. Middleware order is authentication -> ban check -> admin-role check -> admin limiter -> image parser -> slug validation -> body validation. At least one text body field (name, description, parent, sortOrder, or status) is required; newIcon by itself is not enough and returns 400. parent="" is converted to null, allowing the category to become a root category. The backend rejects self-parenting and circular hierarchies. Changing name may regenerate the slug, and changing name/parent rechecks case-insensitive sibling-name uniqueness. newIcon is optional; when successfully replaced, the old stored icon is deleted after the category save. Invalid/oversized Multer files currently surface as 500 for the same reason documented on create.`,
            security: [
                { bearerAuth: [] }
            ],
            parameters: [
                { $ref: "#/components/parameters/CategorySlugParameter" }
            ],
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            $ref: "#/components/schemas/UpdateCategoryForm"
                        }
                    }
                }
            },
            responses: {
                200: {
                    $ref: "#/components/responses/CategoryUpdatedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/CategoryUpdateBadRequest"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/ForbiddenOrBanned"
                },
                404: {
                    $ref: "#/components/responses/CategoryOrParentNotFound"
                },
                409: {
                    $ref: "#/components/responses/DuplicateSiblingCategory"
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
            tags: ["Categories", "Admins"],
            operationId: "deleteCategory",
            summary: "Delete a category (admin only)",
            description: `Admin-only hard delete. Middleware order is authentication -> ban check -> admin-role check -> admin limiter -> slug validation. A category that has any direct child category cannot be deleted, even with force=true. If non-deleted courses are assigned directly to the category, deletion returns 409 unless the exact query value force=true is supplied. With force=true the service detaches courses by setting category=null inside the deletion transaction, then deletes the category. If the category has an icon, storage deletion is attempted after the database transaction and storage-cleanup failures are intentionally ignored.`,
            security: [
                { bearerAuth: [] }
            ],
            parameters: [
                { $ref: "#/components/parameters/CategorySlugParameter" },
                { $ref: "#/components/parameters/CategoryForceDeleteParameter" }
            ],
            responses: {
                200: {
                    $ref: "#/components/responses/CategoryDeletedSuccessfully"
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
                    $ref: "#/components/responses/CategoryNotFound"
                },
                409: {
                    $ref: "#/components/responses/CategoryDeleteConflict"
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