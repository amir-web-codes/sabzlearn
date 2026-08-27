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

    LessonOrCourseNotFound: {
        description: "Either the course slug cannot be resolved as a published/non-deleted course, or the lesson id does not identify an existing lesson.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                examples: {
                    courseNotFound: {
                        summary: "Course cannot be resolved",
                        value: {
                            success: false,
                            message: "course not found"
                        }
                    },
                    lessonNotFound: {
                        summary: "Lesson id does not exist",
                        value: {
                            success: false,
                            message: "lesson not found"
                        }
                    }
                }
            }
        }
    },

    LessonAdminListForbidden: {
        description: "The authenticated caller is banned or does not have the admin role. Query validation runs before these authorization checks, and the admin limiter runs only after the admin-role check succeeds.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                examples: {
                    wrongRole: {
                        summary: "Caller is not an admin",
                        value: {
                            success: false,
                            message: "you don't have permission"
                        }
                    },
                    permanentBan: {
                        summary: "Permanent ban",
                        value: {
                            success: false,
                            message: "you are permanently banned. Reason: Spam"
                        }
                    },
                    temporaryBan: {
                        summary: "Temporary ban",
                        value: {
                            success: false,
                            message: "you are temporary banned until: 2026-08-30T12:00:00.000Z. Reason: Spam"
                        }
                    }
                }
            }
        }
    },

    LessonCourseContentForbidden: {
        description: "The authenticated caller is banned, or is neither the instructor of the supplied course nor actively enrolled in it. The current access middleware is called with adminAllowed=false, so the admin role alone does not bypass this check.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                examples: {
                    noCourseAccess: {
                        summary: "Not the instructor and no active enrollment",
                        value: {
                            success: false,
                            message: "you don't have access to this course"
                        }
                    },
                    permanentBan: {
                        summary: "Permanent ban",
                        value: {
                            success: false,
                            message: "you are permanently banned. Reason: Spam"
                        }
                    },
                    temporaryBan: {
                        summary: "Temporary ban",
                        value: {
                            success: false,
                            message: "you are temporary banned until: 2026-08-30T12:00:00.000Z. Reason: Spam"
                        }
                    }
                }
            }
        }
    },

    LessonCreateForbidden: {
        description: "The authenticated caller is banned, is neither admin nor teacher, or is not the instructor of the supplied course. Although admin is an allowed role, checkSelfCourseAuthor(false) gives no admin override; an admin can create a lesson only when that admin is also the course instructor.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                examples: {
                    wrongRole: {
                        summary: "Caller is neither admin nor teacher",
                        value: {
                            success: false,
                            message: "you don't have permission"
                        }
                    },
                    noCourseAccess: {
                        summary: "Caller is not the course instructor",
                        value: {
                            success: false,
                            message: "you don't have access to this course"
                        }
                    },
                    permanentBan: {
                        summary: "Permanent ban",
                        value: {
                            success: false,
                            message: "you are permanently banned. Reason: Spam"
                        }
                    },
                    temporaryBan: {
                        summary: "Temporary ban",
                        value: {
                            success: false,
                            message: "you are temporary banned until: 2026-08-30T12:00:00.000Z. Reason: Spam"
                        }
                    }
                }
            }
        }
    },

    LessonEditForbidden: {
        description: "The authenticated caller is banned, is neither admin nor teacher, or is not the lesson's original publisher. checkSelfLessonAuthor(false) provides no admin override for PATCH.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                examples: {
                    wrongRole: {
                        summary: "Caller is neither admin nor teacher",
                        value: {
                            success: false,
                            message: "you don't have permission"
                        }
                    },
                    noLessonAccess: {
                        summary: "Caller is not the original publisher",
                        value: {
                            success: false,
                            message: "you don't have access to this lesson"
                        }
                    },
                    permanentBan: {
                        summary: "Permanent ban",
                        value: {
                            success: false,
                            message: "you are permanently banned. Reason: Spam"
                        }
                    },
                    temporaryBan: {
                        summary: "Temporary ban",
                        value: {
                            success: false,
                            message: "you are temporary banned until: 2026-08-30T12:00:00.000Z. Reason: Spam"
                        }
                    }
                }
            }
        }
    },

    LessonDeleteForbidden: {
        description: "The authenticated caller is banned, is neither admin nor teacher, or fails the lesson access check. DELETE allows the lesson's original publisher or any authenticated admin; a teacher who is not the original publisher receives 403.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                examples: {
                    wrongRole: {
                        summary: "Caller is neither admin nor teacher",
                        value: {
                            success: false,
                            message: "you don't have permission"
                        }
                    },
                    noLessonAccess: {
                        summary: "Teacher is not the original publisher",
                        value: {
                            success: false,
                            message: "you don't have access to this lesson"
                        }
                    },
                    permanentBan: {
                        summary: "Permanent ban",
                        value: {
                            success: false,
                            message: "you are permanently banned. Reason: Spam"
                        }
                    },
                    temporaryBan: {
                        summary: "Temporary ban",
                        value: {
                            success: false,
                            message: "you are temporary banned until: 2026-08-30T12:00:00.000Z. Reason: Spam"
                        }
                    }
                }
            }
        }
    },

    LessonsFetchedSuccessfully: {
        description: "Admin lesson list fetched successfully. Empty results use the exact string `no lesson found`.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/LessonsAdminListResponse"
                }
            }
        }
    },

    CourseLessonsFetchedSuccessfully: {
        description: "Course lessons fetched successfully. The empty state is an empty array.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CourseLessonsListResponse"
                }
            }
        }
    },

    LessonFetchedSuccessfully: {
        description: "Lesson fetched successfully.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/LessonFetchedResponse"
                }
            }
        }
    },

    LessonAddedSuccessfully: {
        description: "Lesson created successfully. The response contains the created Lesson document.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/LessonAddedResponse"
                }
            }
        }
    },

    LessonEditedSuccessfully: {
        description: "Lesson edited successfully. The response contains the saved Lesson document; a no-op PATCH may return the unchanged document.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/LessonEditedResponse"
                }
            }
        }
    },

    LessonDeletedSuccessfully: {
        description: "Lesson deleted successfully. The controller does not return the deleted document.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/LessonDeletedResponse"
                },
                example: {
                    success: true,
                    message: "lesson deleted successfully"
                }
            }
        }
    }
}