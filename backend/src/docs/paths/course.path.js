module.exports = {
    "/courses/get-all": {
        get: {
            tags: ["Courses"],
            operationId: "getAllCourses",
            summary: "List Courses",
            description: `Public Course-list endpoint with optional bearer authentication.

Middleware order: Course limiter -> optional bearer-token validation -> query validation -> controller.

When Authorization is omitted, the request is allowed. When it is supplied, the token must be valid. status is special: non-admin callers may request only published; admins may explicitly request draft/published/archived/closed. If status is omitted, the backend returns published Courses even for admins.

category matches the selected category plus every descendant category. minPrice/maxPrice filter finalPrice (after discount), not base price. Price-range requests bypass list caching. Returned Courses are full raw lean documents with unpopulated category/tags/instructor. The empty state is [].`,
            security: [
                {},
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
                    $ref: "#/components/parameters/CourseLevelFilterParameter"
                },
                {
                    $ref: "#/components/parameters/CourseLanguageFilterParameter"
                },
                {
                    $ref: "#/components/parameters/CourseStatusFilterParameter"
                },
                {
                    $ref: "#/components/parameters/CourseCategoryFilterParameter"
                },
                {
                    $ref: "#/components/parameters/CourseMinPriceParameter"
                },
                {
                    $ref: "#/components/parameters/CourseMaxPriceParameter"
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
                    $ref: "#/components/responses/CoursesFetchedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/FailedValidation"
                },
                401: {
                    $ref: "#/components/responses/InvalidOptionalBearerToken"
                },
                403: {
                    $ref: "#/components/responses/CourseStatusFilterForbidden"
                },
                404: {
                    $ref: "#/components/responses/CourseCategoryFilterNotFound"
                },
                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrCourse"
                },
                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/courses/{slug}/get-students": {
        get: {
            tags: ["Courses", "Admins", "Teachers"],
            operationId: "getCourseStudents",
            summary: "List active students of a Course",
            description: `Management endpoint for active Course enrollments.

Middleware order: query validation -> authentication -> ban check -> admin/teacher role check -> checkSelfCourseAuthor(true) -> controller.

Admins may access any non-deleted Course. Teachers may access only Courses they instruct. Course status is not restricted by the ownership lookup. Only active enrollments are counted/listed. The service sorts Enrollment rows by createdAt or lastAccessedAt, but the controller then returns only populated user objects (_id/username/email); the enrollment timestamps are not exposed.

The empty state is the exact string "no student found", not an empty array. meta.rating is the Course's full { average, count } object.`,
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
                    $ref: "#/components/parameters/CourseStudentsSortByParameter"
                },
                {
                    $ref: "#/components/parameters/SortOrderParameter"
                }
            ],
            responses: {
                200: {
                    $ref: "#/components/responses/CourseStudentsFetchedSuccessfully"
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
    },

    "/courses/{slug}/get-related": {
        get: {
            tags: ["Courses", "Admins", "Teachers"],
            operationId: "getRelatedCourses",
            summary: "Get related Courses",
            description: `Returns up to 15 published, non-deleted Courses related to the requested published Course.

Authentication, ban checking, and an admin/teacher role are required. There is no ownership middleware on this route, so any non-banned admin/teacher may request related Courses for any published Course.

The source Course itself is resolved with findPublishedCourseBySlug(); draft/archived/closed/deleted Courses therefore return 404. Relatedness scoring is +2 same category, +1 per shared tag, +2 same instructor, +1 same level. Only score > 0 survives. Results sort by score desc and rating.average desc and return a projection rather than full Course documents.`,
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
            responses: {
                200: {
                    $ref: "#/components/responses/RelatedCoursesFetchedSuccessfully"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/CourseRoleOrBanForbidden"
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

    "/courses/{slug}": {
        get: {
            tags: ["Courses"],
            operationId: "getCourseBySlug",
            summary: "Get published Course details",
            description: `Returns detailed data for one published, non-deleted Course.

Middleware order: Course limiter -> query validation -> bearer authentication -> controller. This route currently requires authentication even though it only returns published Courses, and it does not run checkUserBan.

category and tags are populated with _id/name/slug; instructor remains an ObjectId. The response always includes relatedCourses. lessonsIncluded defaults to true. When lessonsIncluded=false, data.lessons is omitted entirely rather than returned as []. The backend still loads lesson previews to calculate meta.duration, so the duration remains available either way.

Lesson previews contain only _id/title/order/duration and are sorted by order asc, then createdAt desc. Related Courses are limited to 15.`,
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
                    $ref: "#/components/parameters/CourseLessonsIncludedParameter"
                }
            ],
            responses: {
                200: {
                    $ref: "#/components/responses/CourseFetchedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/FailedValidation"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                404: {
                    $ref: "#/components/responses/CourseNotFound"
                },
                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrCourse"
                },
                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        },

        patch: {
            tags: ["Courses", "Admins", "Teachers"],
            operationId: "editCourse",
            summary: "Edit a Course",
            description: `Updates a non-deleted Course.

Middleware order: Course limiter -> authentication -> ban check -> admin/teacher role -> checkSelfCourseAuthor(false) -> body validation -> controller.

Because adminAllowed=false, being an admin does NOT let a caller edit another instructor's Course. Every body field is optional and {} is valid. A title change generates a fresh unique slug, so frontend state/router links should use data.slug from the response after a successful title edit.

category, when supplied, is a category slug and must resolve to a category whose status is not inactive. The current API has no null/empty-category input to clear an existing category. tags is an array of up to five Tag ObjectIds; [] clears all tags.`,
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
                required: false,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/UpdateCourseRequest"
                        }
                    }
                }
            },
            responses: {
                200: {
                    $ref: "#/components/responses/CourseEditedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/FailedValidation"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/CourseOwnerOnlyForbidden"
                },
                404: {
                    $ref: "#/components/responses/CourseMutationDependencyNotFound"
                },
                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrCourse"
                },
                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        },

        delete: {
            tags: ["Courses", "Admins", "Teachers"],
            operationId: "deleteCourse",
            summary: "Delete a Course",
            description: `Soft-deletes a Course and hard-deletes all of its Lesson documents inside the same MongoDB transaction.

Authentication, ban check, admin/teacher role, and checkSelfCourseAuthor(true) apply. Therefore the instructor may delete their Course and an admin may delete another instructor's Course.

After transaction commit, Course/Lesson caches are invalidated and stored lesson videos are deleted from Cloudinary on a best-effort basis. The Course document itself remains in MongoDB with isDeleted=true/deletedBy/deletedAt. The controller returns only success/message.`,
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
            responses: {
                200: {
                    $ref: "#/components/responses/CourseDeletedSuccessfully"
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
                    $ref: "#/components/responses/TooManyRequestsGlobalOrCourse"
                },
                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/courses/create": {
        post: {
            tags: ["Courses", "Admins", "Teachers"],
            operationId: "createCourse",
            summary: "Create a Course",
            description: `Creates a Course owned by the authenticated admin/teacher.

Authentication -> ban check -> admin/teacher role -> body validation -> controller. title and description are required. Defaults supplied by Zod are price=0, discountPercentage=0, level=beginner, language=fa, status=draft.

The backend generates a unique slug from title. category is an optional active-category slug. tags is an optional array of at most five Tag ObjectIds; every id must exist. The response is the full raw Course document with unpopulated references.`,
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
                            $ref: "#/components/schemas/CreateCourseRequest"
                        }
                    }
                }
            },
            responses: {
                201: {
                    $ref: "#/components/responses/CourseCreatedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/FailedValidation"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/CourseRoleOrBanForbidden"
                },
                404: {
                    $ref: "#/components/responses/CourseMutationDependencyNotFound"
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

    "/courses/{slug}/enroll/{id}": {
        post: {
            tags: ["Courses", "Enrollments", "Admins", "Teachers"],
            operationId: "enrollUserInCourseByTeacher",
            summary: "Enroll or reactivate a user",
            description: `Instructor-management endpoint that upserts an Enrollment.

id is validated as a MongoDB ObjectId before authentication. Then authentication -> ban check -> admin/teacher role -> enrollment limiter -> checkSelfCourseAuthor(false) -> controller. Since adminAllowed=false, even an admin must be the Course instructor to use this endpoint.

The target user must exist with isDeleted=false and isBanned=false. A missing/cancelled enrollment is created/reactivated as active; an already-active enrollment is updated as active and lastAccessedAt is refreshed. The endpoint always returns 201 on success and synchronizes Course.studentsCount to the number of active enrollments.`,
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
                201: {
                    $ref: "#/components/responses/CourseEnrollmentSuccessful"
                },
                400: {
                    $ref: "#/components/responses/InvalidId"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/CourseOwnerOnlyForbidden"
                },
                404: {
                    $ref: "#/components/responses/CourseEnrollmentNotFound"
                },
                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrEnrollment"
                },
                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/courses/{slug}/thumbnail": {
        patch: {
            tags: ["Courses", "Media", "Admins", "Teachers"],
            operationId: "updateCourseThumbnail",
            summary: "Upload/replace Course thumbnail",
            description: `Uploads/replaces a Course thumbnail.

Only the Course instructor may use this route; checkSelfCourseAuthor(false) gives no admin override. multipart field name must be thumbnail. Allowed MIME types: image/jpeg, image/png, image/webp. Maximum size: 2 MiB.

The new image is uploaded and saved before the previous Cloudinary image is deleted. Cache invalidation happens after save. The full raw Course document is returned.`,
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
                            $ref: "#/components/schemas/CourseThumbnailUploadForm"
                        }
                    }
                }
            },
            responses: {
                200: {
                    $ref: "#/components/responses/CourseThumbnailUpdatedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/CourseThumbnailBadRequest"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/CourseOwnerOnlyForbidden"
                },
                404: {
                    $ref: "#/components/responses/CourseNotFound"
                },
                413: {
                    $ref: "#/components/responses/CourseUploadTooLarge"
                },
                415: {
                    $ref: "#/components/responses/CourseImageUnsupportedMediaType"
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
            tags: ["Courses", "Media", "Admins", "Teachers"],
            operationId: "deleteCourseThumbnail",
            summary: "Reset Course thumbnail",
            description: `Removes the custom thumbnail and restores { url: "/images/default-thumbnail.png", publicId: null }.

Only the Course instructor may use this route; admin has no ownership override. If thumbnail.publicId is already null, the endpoint returns 409.`,
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
            responses: {
                200: {
                    $ref: "#/components/responses/CourseThumbnailDeletedSuccessfully"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/CourseOwnerOnlyForbidden"
                },
                404: {
                    $ref: "#/components/responses/CourseNotFound"
                },
                409: {
                    $ref: "#/components/responses/CourseThumbnailConflict"
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

    "/courses/{slug}/cover-video": {
        patch: {
            tags: ["Courses", "Media", "Admins", "Teachers"],
            operationId: "updateCourseCoverVideo",
            summary: "Upload/replace Course cover video",
            description: `Uploads/replaces the Course cover video.

Only the Course instructor may use this route; admin has no ownership override. multipart field name must be coverVideo. Current video middleware accepts video/mp4 only, maximum 100 MiB. The full raw Course document is returned after save.`,
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
                            $ref: "#/components/schemas/CourseCoverVideoUploadForm"
                        }
                    }
                }
            },
            responses: {
                200: {
                    $ref: "#/components/responses/CourseCoverVideoUpdatedSuccessfully"
                },
                400: {
                    $ref: "#/components/responses/CourseCoverVideoBadRequest"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/CourseOwnerOnlyForbidden"
                },
                404: {
                    $ref: "#/components/responses/CourseNotFound"
                },
                413: {
                    $ref: "#/components/responses/CourseUploadTooLarge"
                },
                415: {
                    $ref: "#/components/responses/CourseVideoUnsupportedMediaType"
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
            tags: ["Courses", "Media", "Admins", "Teachers"],
            operationId: "deleteCourseCoverVideo",
            summary: "Delete Course cover video",
            description: `Deletes the stored Course cover-video reference and resets it to { url: null, publicId: null }.

Only the Course instructor may use this route; admin has no ownership override. If coverVideoURL.publicId is already null, the endpoint returns 409.`,
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
            responses: {
                200: {
                    $ref: "#/components/responses/CourseCoverVideoDeletedSuccessfully"
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                403: {
                    $ref: "#/components/responses/CourseOwnerOnlyForbidden"
                },
                404: {
                    $ref: "#/components/responses/CourseNotFound"
                },
                409: {
                    $ref: "#/components/responses/CourseCoverVideoConflict"
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