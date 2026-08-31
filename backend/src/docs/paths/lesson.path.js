module.exports = {
    "/lessons/admin/get-all": {
        get: {
            tags: ["Lessons", "Admins"],
            operationId: "getAllLessons",
            summary: "List all lessons (admin only)",
            description: `Admin-only lesson list.

Middleware order: query validation -> access-token authentication -> ban check -> admin-role check -> admin limiter -> controller.

Query defaults are page=1, limit=20, sortBy=order, sortOrder=desc. courseId is an optional exact ObjectId filter; the backend validates only its syntax and does not verify that a Course document exists. When courseId is omitted, the list can be served from Redis. When courseId is supplied, list caching is intentionally skipped.

The service uses an explicit Mongo projection, so list items contain only _id, title, courseId, publisherId, order, and duration. The empty state is [].`,
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/PageParameter" },
                { $ref: "#/components/parameters/LimitParameter" },
                { $ref: "#/components/parameters/LessonCourseIdFilterParameter" },
                { $ref: "#/components/parameters/LessonSortByParameter" },
                { $ref: "#/components/parameters/SortOrderParameter" }
            ],
            responses: {
                200: { $ref: "#/components/responses/LessonsFetchedSuccessfully" },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/LessonAdminListForbidden" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobalOrAdmin" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/lessons/{slug}/get-lessons": {
        get: {
            tags: ["Lessons", "Courses"],
            operationId: "getCourseLessons",
            summary: "List lessons of a course",
            description: `Authenticated course-content endpoint.

Middleware order: query validation -> authentication -> ban check -> checkEnrollmentOrOwnership(false) -> controller.

The course is resolved by findCourseBySlug(), which requires isDeleted=false but does NOT filter by course status. Therefore draft, archived, closed, or published courses can reach this endpoint when the caller otherwise has access. Access is granted to the course instructor or to a user with an active enrollment. adminAllowed=false, so the admin role alone does not bypass the access requirement.

Results are paginated, sorted by order/duration/createdAt, and cached in Redis per course slug + pagination/sort combination. Defaults are page=1, limit=20, sortBy=order, sortOrder=desc. Full lesson documents are returned; the empty state is [].`,
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/SlugParameter" },
                { $ref: "#/components/parameters/PageParameter" },
                { $ref: "#/components/parameters/LimitParameter" },
                { $ref: "#/components/parameters/LessonSortByParameter" },
                { $ref: "#/components/parameters/SortOrderParameter" }
            ],
            responses: {
                200: { $ref: "#/components/responses/CourseLessonsFetchedSuccessfully" },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/LessonCourseAccessForbidden" },
                404: { $ref: "#/components/responses/CourseNotFound" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/lessons/courses/{slug}/create": {
        post: {
            tags: ["Lessons", "Courses"],
            operationId: "createLesson",
            summary: "Create a lesson",
            description: `Creates a lesson under a non-deleted course using multipart/form-data.

Middleware order: authentication -> ban check -> role check (admin/teacher) -> checkSelfCourseAuthor(false) -> MP4 Multer parser -> body validation -> controller.

The route permits admin and teacher roles, but the ownership middleware has adminAllowed=false, so the caller must also be the course instructor. The course lookup does not require status=published; any non-deleted course status is accepted.

title and description are required. order is optional and is coerced to Number. When order is omitted, the service finds the greatest existing order in the course and uses that value + 100, or 100 when no lesson exists. video is optional, must use the exact multipart field name video, accepts video/mp4 only, and is limited to 100 MiB. When uploaded, duration is taken from Cloudinary metadata, converted to minutes, and rounded to 2 decimal places.

The current Multer file-type/file-size errors have no explicit 4xx status and therefore surface through the global error handler as 500 internal server error.`,
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/SlugParameter" }
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
                201: { $ref: "#/components/responses/LessonAddedSuccessfully" },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/LessonCreateForbidden" },
                404: { $ref: "#/components/responses/CourseNotFound" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/lessons/{slug}/{id}": {
        get: {
            tags: ["Lessons", "Courses"],
            operationId: "getLessonById",
            summary: "Get one lesson",
            description: `Returns one full lesson document.

Middleware order: id validation -> authentication -> ban check -> checkEnrollmentOrOwnership(false) -> controller.

The supplied slug is resolved to a non-deleted course; course status is not filtered. Access requires the caller to be that course's instructor or to have an active enrollment. The admin role alone is not enough.

After course access succeeds, the controller explicitly verifies that the requested lesson id belongs to req.course._id via isLessonInCourse(). Only then does it load the lesson by id. Consequently, a syntactically valid missing lesson id or an id belonging to another course normally produces 403 with message "this lesson is not in course", while a missing course slug produces 404 "course not found".`,
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/SlugParameter" },
                { $ref: "#/components/parameters/IdParameter" }
            ],
            responses: {
                200: { $ref: "#/components/responses/LessonFetchedSuccessfully" },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/LessonReadForbidden" },
                404: { $ref: "#/components/responses/CourseNotFound" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        },

        patch: {
            tags: ["Lessons"],
            operationId: "editLesson",
            summary: "Edit a lesson",
            description: `Edits a lesson using multipart/form-data.

Middleware order: id validation -> authentication -> ban check -> role check (admin/teacher) -> checkSelfLessonAuthor(false) -> MP4 Multer parser -> body validation -> controller.

The route shape requires slug and id, but the current PATCH middleware/controller/service chain does not resolve, validate, or compare slug with the lesson's course. Authorization is based on lesson id. The caller must currently have role admin or teacher AND must be the lesson's original publisher; admin has no override because checkSelfLessonAuthor(false) is used.

Every form field is optional. An empty PATCH is valid and returns the unchanged lesson. A file-only PATCH is also valid. A new video replaces the stored video and recomputes duration. removeVideo must be the exact multipart text value "true" or "false"; "true" removes the old video and resets duration to 0 only when no new video file is supplied. A new file takes precedence over removeVideo.

The previous Cloudinary video is deleted best-effort after the database save; deletion failure is swallowed. Current Multer rejection errors surface as 500.`,
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/SlugParameter" },
                { $ref: "#/components/parameters/IdParameter" }
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
                200: { $ref: "#/components/responses/LessonEditedSuccessfully" },
                400: { $ref: "#/components/responses/InvalidIdOrValidationFailed" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/LessonEditForbidden" },
                404: { $ref: "#/components/responses/LessonNotFound" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        },

        delete: {
            tags: ["Lessons"],
            operationId: "deleteLesson",
            summary: "Delete a lesson",
            description: `Hard-deletes a lesson.

Middleware order: id validation -> authentication -> ban check -> role check (admin/teacher) -> checkSelfLessonAuthor(true) -> controller.

The route shape requires slug and id, but the current DELETE chain does not resolve, validate, or compare slug with the lesson's course. Authorization is based on lesson id. The original publisher may delete the lesson while holding an allowed role; any authenticated admin also receives the admin override. A non-publisher teacher receives 403.

If a stored video exists, Cloudinary deletion is attempted after the database document has already been deleted; storage deletion errors are intentionally ignored. Course and lesson list caches are invalidated afterwards.`,
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/SlugParameter" },
                { $ref: "#/components/parameters/IdParameter" }
            ],
            responses: {
                200: { $ref: "#/components/responses/LessonDeletedSuccessfully" },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/LessonDeleteForbidden" },
                404: { $ref: "#/components/responses/LessonNotFound" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    }
}