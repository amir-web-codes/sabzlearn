const jsonErrorResponse = (description, examples) => ({
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

const successSchemaResponse = (description, schemaName) => ({
    description,
    content: {
        "application/json": {
            schema: {
                $ref: `#/components/schemas/${schemaName}`
            }
        }
    }
})

const permanentBanExample = {
    summary: "Permanent ban",
    value: {
        success: false,
        message: "you are permanently banned. Reason: Spam"
    }
}

const temporaryBanExample = {
    summary: "Temporary ban",
    value: {
        success: false,
        message: "you are temporary banned until: 2026-08-30T12:00:00.000Z. Reason: Spam"
    }
}

const wrongRoleExample = {
    summary: "Required role is missing",
    value: {
        success: false,
        message: "you don't have permission"
    }
}

const noCourseAccessExample = {
    summary: "No access to the requested course",
    value: {
        success: false,
        message: "you don't have access to this course"
    }
}

const noLessonAccessExample = {
    summary: "No management access to the requested lesson",
    value: {
        success: false,
        message: "you don't have access to this lesson"
    }
}

const lessonNotInCourseExample = {
    summary: "Lesson does not belong to the supplied course",
    value: {
        success: false,
        message: "this lesson is not in course"
    }
}

module.exports = {
    LessonNotFound: {
        description: "No lesson exists with the supplied id.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                example: {
                    success: false,
                    message: "lesson not found"
                }
            }
        }
    },

    LessonAdminListForbidden: jsonErrorResponse(
        "The authenticated caller is banned or does not have the admin role.",
        {
            wrongRole: wrongRoleExample,
            permanentBan: permanentBanExample,
            temporaryBan: temporaryBanExample
        }
    ),

    LessonCourseAccessForbidden: jsonErrorResponse(
        "The authenticated caller is banned, or is neither the requested course's instructor nor actively enrolled in it. checkEnrollmentOrOwnership(false) gives no admin-role override.",
        {
            noCourseAccess: noCourseAccessExample,
            permanentBan: permanentBanExample,
            temporaryBan: temporaryBanExample
        }
    ),

    LessonReadForbidden: jsonErrorResponse(
        "Single-lesson reading is forbidden when the caller is banned, lacks access to the supplied course, or the lesson id does not belong to that course. Because isLessonInCourse() runs before findById(), a syntactically valid id for a missing lesson normally reaches the same `this lesson is not in course` 403 branch.",
        {
            noCourseAccess: noCourseAccessExample,
            lessonNotInCourse: lessonNotInCourseExample,
            permanentBan: permanentBanExample,
            temporaryBan: temporaryBanExample
        }
    ),

    LessonCreateForbidden: jsonErrorResponse(
        "The caller is banned, is neither admin nor teacher, or is not the instructor of the supplied course. The route allows admin/teacher roles, but checkSelfCourseAuthor(false) provides no admin ownership override.",
        {
            wrongRole: wrongRoleExample,
            noCourseAccess: noCourseAccessExample,
            permanentBan: permanentBanExample,
            temporaryBan: temporaryBanExample
        }
    ),

    LessonEditForbidden: jsonErrorResponse(
        "The caller is banned, is neither admin nor teacher, or is not the lesson's original publisher. checkSelfLessonAuthor(false) provides no admin override for PATCH.",
        {
            wrongRole: wrongRoleExample,
            noLessonAccess: noLessonAccessExample,
            permanentBan: permanentBanExample,
            temporaryBan: temporaryBanExample
        }
    ),

    LessonDeleteForbidden: jsonErrorResponse(
        "The caller is banned, is neither admin nor teacher, or fails the lesson access check. DELETE allows the original publisher or any authenticated admin; a non-publisher teacher receives 403.",
        {
            wrongRole: wrongRoleExample,
            noLessonAccess: noLessonAccessExample,
            permanentBan: permanentBanExample,
            temporaryBan: temporaryBanExample
        }
    ),

    LessonsFetchedSuccessfully: successSchemaResponse(
        "Admin lesson list fetched successfully. data is always an array; the empty state is [].",
        "LessonsAdminListResponse"
    ),

    CourseLessonsFetchedSuccessfully: successSchemaResponse(
        "Course lessons fetched successfully. Full lesson documents are returned and the empty state is [].",
        "CourseLessonsListResponse"
    ),

    LessonFetchedSuccessfully: successSchemaResponse(
        "Lesson fetched successfully.",
        "LessonFetchedResponse"
    ),

    LessonAddedSuccessfully: successSchemaResponse(
        "Lesson created successfully. The response contains the created full Lesson document.",
        "LessonAddedResponse"
    ),

    LessonEditedSuccessfully: successSchemaResponse(
        "Lesson edited successfully. The response contains the saved full Lesson document; a no-op PATCH may return the unchanged document.",
        "LessonEditedResponse"
    ),

    LessonDeletedSuccessfully: {
        description: "Lesson hard-deleted successfully. The controller returns no data payload.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Success"
                },
                example: {
                    success: true,
                    message: "lesson deleted successfully"
                }
            }
        }
    }
}