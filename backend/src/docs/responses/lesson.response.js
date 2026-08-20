module.exports = {
    LessonNotFound: {
        description: "Lesson not found",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "lesson not found" }
            }
        }
    },
    NoAccessToLesson: {
        description: "User is not the publisher of this lesson (and, depending on the route, not an admin either)",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "you don't have access to this lesson" }
            }
        }
    },

    NoAccessToCourse: {
        description: "User is not this course's owning teacher",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "you don't have access to this course" }
            }
        }
    },

    CourseContentForbidden: {
        description: "The caller is banned or is not enrolled in the course, its instructor, or an administrator",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                    notEnrolled: {
                        summary: "course enrollment required",
                        value: { success: false, message: "you must be enrolled to access lesson content" }
                    },
                    banned: {
                        summary: "account is banned",
                        value: { success: false, message: "you are permanently banned. Reason: Spam" }
                    }
                }
            }
        }
    },

    AdminListLessonsForbidden: {
        description: "403 — either the caller is not an admin, or the requesting admin is banned",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                    notAdmin: {
                        summary: "caller is not an admin",
                        value: { success: false, message: "you don't have permission" }
                    },
                    permanentBan: {
                        summary: "permanent ban",
                        value: { success: false, message: "you are permanently banned. Reason: Spam" }
                    },
                    temporaryBan: {
                        summary: "temporary ban",
                        value: { success: false, message: "you are temporary banned until: 2026-08-01T12:00:00.000Z. Reason: Spam" }
                    }
                }
            }
        }
    },

    CreateLessonForbidden: {
        description: "403 — the user is banned, is neither an admin nor teacher, or is not this course's owning teacher (admins are NOT exempt from the ownership check here)",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                    permanentBan: {
                        summary: "permanent ban",
                        value: { success: false, message: "you are permanently banned. Reason: Spam" }
                    },
                    temporaryBan: {
                        summary: "temporary ban",
                        value: { success: false, message: "you are temporary banned until: 2026-08-01T12:00:00.000Z. Reason: Spam" }
                    },
                    notAdminOrTeacher: {
                        summary: "caller is neither admin nor teacher",
                        value: { success: false, message: "you don't have permission" }
                    },
                    notCourseOwner: {
                        summary: "not this course's owning teacher",
                        value: { success: false, message: "you don't have access to this course" }
                    }
                }
            }
        }
    },

    LessonOwnershipForbidden: {
        description: "403 — either the user is banned, is neither an admin nor a teacher, or does not have access to this specific lesson",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                    permanentBan: {
                        summary: "permanent ban",
                        value: { success: false, message: "you are permanently banned. Reason: Spam" }
                    },
                    temporaryBan: {
                        summary: "temporary ban",
                        value: { success: false, message: "you are temporary banned until: 2026-08-01T12:00:00.000Z. Reason: Spam" }
                    },
                    notAdminOrTeacher: {
                        summary: "caller is neither admin nor teacher",
                        value: { success: false, message: "you don't have permission" }
                    },
                    noAccess: {
                        summary: "not this lesson's publisher (and not an admin, on DELETE where admins are allowed)",
                        value: { success: false, message: "you don't have access to this lesson" }
                    }
                }
            }
        }
    }
}