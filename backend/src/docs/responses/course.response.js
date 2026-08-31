const errorResponse = (description, examples) => ({
    description,
    content: {
        "application/json": {
            schema: {
                $ref: "#/components/schemas/Error"
            },
            examples
        }
    }
})

const schemaResponse = (description, schemaName) => ({
    description,
    content: {
        "application/json": {
            schema: {
                $ref: `#/components/schemas/${schemaName}`
            }
        }
    }
})

const wrongRole = {
    summary: "Required role is missing",
    value: {
        success: false,
        message: "you don't have permission"
    }
}

const noCourseAccess = {
    summary: "Course ownership/access check failed",
    value: {
        success: false,
        message: "you don't have access to this course"
    }
}

const permanentBan = {
    summary: "Permanent ban",
    value: {
        success: false,
        message: "you are permanently banned. Reason: Spam"
    }
}

const temporaryBan = {
    summary: "Temporary ban",
    value: {
        success: false,
        message: "you are temporary banned until: 2026-08-30T12:00:00.000Z. Reason: Spam"
    }
}

module.exports = {
    CoursesFetchedSuccessfully: schemaResponse(
        "Course list fetched successfully. The empty state is [].",
        "CoursesListResponse"
    ),

    CourseFetchedSuccessfully: schemaResponse(
        "Published Course details fetched successfully.",
        "CourseDetailsResponse"
    ),

    CourseCreatedSuccessfully: schemaResponse(
        "Course created successfully.",
        "CourseCreatedResponse"
    ),

    CourseEditedSuccessfully: schemaResponse(
        "Course edited successfully. If title changed, data.slug may be different from the slug used in the request.",
        "CourseEditedResponse"
    ),

    CourseStudentsFetchedSuccessfully: schemaResponse(
        "Active Course students fetched successfully. The controller exposes populated user objects only; an empty result is the exact string no student found.",
        "CourseStudentsListResponse"
    ),

    CourseCommentsFetchedForManagement: schemaResponse(
        "Course comments fetched successfully. Empty results use the exact string no comment found.",
        "CourseCommentsListResponse"
    ),

    RelatedCoursesFetchedSuccessfully: schemaResponse(
        "Related published Courses fetched successfully.",
        "RelatedCoursesResponse"
    ),

    CourseThumbnailUpdatedSuccessfully: schemaResponse(
        "Course thumbnail updated successfully.",
        "CourseThumbnailUpdatedResponse"
    ),

    CourseThumbnailDeletedSuccessfully: schemaResponse(
        "Custom thumbnail removed and the model default thumbnail URL restored.",
        "CourseThumbnailDeletedResponse"
    ),

    CourseCoverVideoUpdatedSuccessfully: schemaResponse(
        "Course cover video updated successfully.",
        "CourseCoverVideoUpdatedResponse"
    ),

    CourseCoverVideoDeletedSuccessfully: schemaResponse(
        "Course cover video deleted successfully.",
        "CourseCoverVideoDeletedResponse"
    ),

    CourseDeletedSuccessfully: {
        description: "Course soft-deleted successfully. The controller returns no deleted Course data.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Success"
                },
                example: {
                    success: true,
                    message: "course deleted successfully"
                }
            }
        }
    },

    CourseEnrollmentSuccessful: {
        description: "Enrollment upsert completed. Existing cancelled enrollments are reactivated; an already-active enrollment is refreshed and still returns 201.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Success"
                },
                example: {
                    success: true,
                    message: "enrollment successful"
                }
            }
        }
    },

    CourseStatusFilterForbidden: errorResponse(
        "A non-admin caller supplied status=draft, archived, or closed to GET /courses/get-all.",
        {
            statusFilter: {
                value: {
                    success: false,
                    message: "you don't have permission to filter by this status"
                }
            }
        }
    ),

    CourseRoleOrBanForbidden: errorResponse(
        "The authenticated caller is banned or does not have an admin/teacher role.",
        {
            wrongRole,
            permanentBan,
            temporaryBan
        }
    ),

    CourseOwnerOnlyForbidden: errorResponse(
        "The authenticated caller is banned, lacks an admin/teacher role, or is not the Course instructor. These routes use checkSelfCourseAuthor(false), so admin status alone does not bypass ownership.",
        {
            wrongRole,
            noCourseAccess,
            permanentBan,
            temporaryBan
        }
    ),

    CourseOwnerOrAdminForbidden: errorResponse(
        "The authenticated caller is banned, lacks an admin/teacher role, or is a non-admin teacher who does not own the Course. These routes use checkSelfCourseAuthor(true), so an admin may access another instructor's Course.",
        {
            wrongRole,
            noCourseAccess,
            permanentBan,
            temporaryBan
        }
    ),

    CourseCategoryFilterNotFound: errorResponse(
        "The category slug supplied to GET /courses/get-all does not exist.",
        {
            categoryNotFound: {
                value: {
                    success: false,
                    message: "category not found"
                }
            }
        }
    ),

    CourseMutationDependencyNotFound: errorResponse(
        "A Course mutation referenced a missing Course/category/tag, depending on the endpoint and stage.",
        {
            courseNotFound: {
                value: {
                    success: false,
                    message: "course not found"
                }
            },
            categoryNotFound: {
                value: {
                    success: false,
                    message: "no active category found with the provided slug"
                }
            },
            tagNotFound: {
                value: {
                    success: false,
                    message: "one or more tags not found"
                }
            }
        }
    ),

    CourseEnrollmentNotFound: errorResponse(
        "The Course does not exist or the target user is missing, soft-deleted, or currently banned.",
        {
            courseNotFound: {
                value: {
                    success: false,
                    message: "course not found"
                }
            },
            noActiveUser: {
                value: {
                    success: false,
                    message: "no active user found"
                }
            }
        }
    ),

    CourseThumbnailBadRequest: errorResponse(
        "The thumbnail multipart request is missing its file or Multer rejected the multipart field structure.",
        {
            missingFile: {
                value: {
                    success: false,
                    message: "thumbnail file is required"
                }
            },
            unexpectedField: {
                value: {
                    success: false,
                    message: "unexpected upload field",
                    code: "LIMIT_UNEXPECTED_FILE"
                }
            }
        }
    ),

    CourseCoverVideoBadRequest: errorResponse(
        "The cover-video multipart request is missing its file or Multer rejected the multipart field structure.",
        {
            missingFile: {
                value: {
                    success: false,
                    message: "cover video file is required"
                }
            },
            unexpectedField: {
                value: {
                    success: false,
                    message: "unexpected upload field",
                    code: "LIMIT_UNEXPECTED_FILE"
                }
            }
        }
    ),

    CourseImageUnsupportedMediaType: errorResponse(
        "The uploaded thumbnail MIME type is not image/jpeg, image/png, or image/webp.",
        {
            invalidImage: {
                value: {
                    success: false,
                    message: "invalid image file type",
                    code: "INVALID_IMAGE_TYPE"
                }
            }
        }
    ),

    CourseVideoUnsupportedMediaType: errorResponse(
        "The uploaded cover-video MIME type is not video/mp4.",
        {
            invalidVideo: {
                value: {
                    success: false,
                    message: "invalid video file type",
                    code: "INVALID_VIDEO_TYPE"
                }
            }
        }
    ),

    CourseUploadTooLarge: errorResponse(
        "Multer rejected the upload because it exceeded the configured file-size limit (2 MiB for thumbnail, 100 MiB for cover video).",
        {
            tooLarge: {
                value: {
                    success: false,
                    message: "uploaded file is too large",
                    code: "LIMIT_FILE_SIZE"
                }
            }
        }
    ),

    CourseThumbnailConflict: errorResponse(
        "The Course currently has no custom thumbnail publicId to delete.",
        {
            noCustomThumbnail: {
                value: {
                    success: false,
                    message: "this course doesn't have a custom thumbnail"
                }
            }
        }
    ),

    CourseCoverVideoConflict: errorResponse(
        "The Course currently has no cover-video publicId to delete.",
        {
            noCoverVideo: {
                value: {
                    success: false,
                    message: "this course doesn't have a cover video"
                }
            }
        }
    ),

    TooManyRequestsGlobalOrCourse: errorResponse(
        "Either the global limiter (100 requests per IP / 20 minutes) or the Course limiter (50 requests per IP / 15 minutes) was exceeded.",
        {
            global: {
                value: {
                    success: false,
                    message: "you're sending too many requests, slow down cowboy🤠"
                }
            },
            course: {
                value: {
                    success: false,
                    message: "too many requests, please try again later"
                }
            }
        }
    ),

    TooManyRequestsGlobalOrEnrollment: errorResponse(
        "Either the global limiter or the enrollment limiter (10 requests per authenticated user id / 10 minutes) was exceeded.",
        {
            global: {
                value: {
                    success: false,
                    message: "you're sending too many requests, slow down cowboy🤠"
                }
            },
            enrollment: {
                value: {
                    success: false,
                    message: "too many requests, please try again later"
                }
            }
        }
    )
}