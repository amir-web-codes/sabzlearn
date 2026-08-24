module.exports = {
    CommentNotFound: {
        description: "No comment exists with the supplied id.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                example: {
                    success: false,
                    message: "comment not found"
                }
            }
        }
    },

    CommentAccessForbidden: {
        description: "The request was blocked by the ban middleware or by comment ownership rules. GET and DELETE allow the author or an admin; PATCH allows only the original author, so an admin cannot edit another user's comment.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                examples: {
                    permanentBan: {
                        summary: "Authenticated user has a permanent ban",
                        value: {
                            success: false,
                            message: "you are permanently banned. Reason: Spam"
                        }
                    },
                    temporaryBan: {
                        summary: "Authenticated user has an unexpired temporary ban",
                        value: {
                            success: false,
                            message: "you are temporary banned until: 2026-08-30T12:00:00.000Z. Reason: Spam"
                        }
                    },
                    noAccess: {
                        summary: "Comment ownership/access check failed",
                        value: {
                            success: false,
                            message: "you don't have access to this comment"
                        }
                    }
                }
            }
        }
    },

    AdminListCommentsForbidden: {
        description: "The caller is not an admin, or the authenticated admin is blocked by the ban middleware. On this route the role check runs before the ban check.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                examples: {
                    wrongRole: {
                        summary: "Authenticated caller is not an admin",
                        value: {
                            success: false,
                            message: "you don't have permission"
                        }
                    },
                    permanentBan: {
                        summary: "Admin has a permanent ban",
                        value: {
                            success: false,
                            message: "you are permanently banned. Reason: Spam"
                        }
                    },
                    temporaryBan: {
                        summary: "Admin has an unexpired temporary ban",
                        value: {
                            success: false,
                            message: "you are temporary banned until: 2026-08-30T12:00:00.000Z. Reason: Spam"
                        }
                    }
                }
            }
        }
    },

    CourseCommentsForbidden: {
        description: "Course-comment listing is limited to admins and teachers. Admins may access any matching published/non-deleted course; a teacher must be that course's instructor. The ban check runs before the role and course-ownership checks.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                examples: {
                    permanentBan: {
                        summary: "Authenticated user has a permanent ban",
                        value: {
                            success: false,
                            message: "you are permanently banned. Reason: Spam"
                        }
                    },
                    temporaryBan: {
                        summary: "Authenticated user has an unexpired temporary ban",
                        value: {
                            success: false,
                            message: "you are temporary banned until: 2026-08-30T12:00:00.000Z. Reason: Spam"
                        }
                    },
                    wrongRole: {
                        summary: "Authenticated caller is neither admin nor teacher",
                        value: {
                            success: false,
                            message: "you don't have permission"
                        }
                    },
                    notCourseAuthor: {
                        summary: "Teacher is not this course's instructor",
                        value: {
                            success: false,
                            message: "you don't have access to this course"
                        }
                    }
                }
            }
        }
    },

    TooManyRequestsGlobalOrComment: {
        description: "Either the global limiter (100 requests per IP / 20 minutes) or the comment-creation limiter (3 requests per IP / 1 minute) was exceeded. The comment limiter runs after body validation and before authentication.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                examples: {
                    global: {
                        summary: "Global rate limit",
                        value: {
                            success: false,
                            message: "you're sending too many requests, slow down cowboy🤠"
                        }
                    },
                    commentCreation: {
                        summary: "Comment-creation rate limit",
                        value: {
                            success: false,
                            message: "you created comment recently, please try again later"
                        }
                    }
                }
            }
        }
    },

    AdminUserCommentsFetchedSuccessfully: {
        description: "Comments authored by the supplied user id were fetched successfully. Raw authorId/courseId ObjectIds are returned. An empty result is the literal string no comments found.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/AdminUserCommentsListResponse"
                },
                examples: {
                    withComments: {
                        summary: "One or more comments",
                        value: {
                            success: true,
                            message: "comments fetched successfully",
                            data: [
                                {
                                    _id: "6857e4d1e5d82d0d1f5d8c60",
                                    title: "Great course!",
                                    text: "Learned a lot, well explained.",
                                    authorId: "6857e4d1e5d82d0d1f5d8c32",
                                    courseId: "6857e4d1e5d82d0d1f5d8c10",
                                    rating: "Good",
                                    createdAt: "2026-08-24T10:00:00.000Z",
                                    updatedAt: "2026-08-24T10:00:00.000Z",
                                    __v: 0
                                }
                            ],
                            meta: {
                                totalNumber: 1,
                                totalPages: 1,
                                page: 1,
                                limit: 20
                            }
                        }
                    },
                    empty: {
                        summary: "No matching comments",
                        value: {
                            success: true,
                            message: "comments fetched successfully",
                            data: "no comments found",
                            meta: {
                                totalNumber: 0,
                                totalPages: 0,
                                page: 1,
                                limit: 20
                            }
                        }
                    }
                }
            }
        }
    },

    CourseCommentsFetchedSuccessfully: {
        description: "Comments for the selected course were fetched successfully. The response includes the course's stored rating object in meta. Empty results use the exact singular string no comment found.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CourseCommentsListResponse"
                },
                examples: {
                    withComments: {
                        summary: "One or more comments",
                        value: {
                            success: true,
                            message: "comments fetched successfully",
                            data: [
                                {
                                    _id: "6857e4d1e5d82d0d1f5d8c60",
                                    title: "Great course!",
                                    text: "Learned a lot, well explained.",
                                    authorId: "6857e4d1e5d82d0d1f5d8c32",
                                    courseId: "6857e4d1e5d82d0d1f5d8c10",
                                    rating: "Good",
                                    createdAt: "2026-08-24T10:00:00.000Z",
                                    updatedAt: "2026-08-24T10:00:00.000Z",
                                    __v: 0
                                }
                            ],
                            meta: {
                                rating: {
                                    average: 4,
                                    count: 1
                                },
                                totalNumber: 1,
                                totalPages: 1,
                                page: 1,
                                limit: 20
                            }
                        }
                    },
                    empty: {
                        summary: "No comments on the course",
                        value: {
                            success: true,
                            message: "comments fetched successfully",
                            data: "no comment found",
                            meta: {
                                rating: {
                                    average: 0,
                                    count: 0
                                },
                                totalNumber: 0,
                                totalPages: 0,
                                page: 1,
                                limit: 20
                            }
                        }
                    }
                }
            }
        }
    },

    CommentFetchedSuccessfully: {
        description: "Comment fetched successfully.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CommentByIdResponse"
                },
                example: {
                    success: true,
                    message: "comment fetched successfully",
                    data: {
                        _id: "6857e4d1e5d82d0d1f5d8c60",
                        title: "Great course!",
                        text: "Learned a lot, well explained.",
                        authorId: "6857e4d1e5d82d0d1f5d8c32",
                        courseId: "6857e4d1e5d82d0d1f5d8c10",
                        rating: "Good",
                        createdAt: "2026-08-24T10:00:00.000Z",
                        updatedAt: "2026-08-24T10:00:00.000Z",
                        __v: 0
                    }
                }
            }
        }
    },

    CommentCreatedSuccessfully: {
        description: "Comment created successfully. The endpoint does not return the created comment document.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CommentCreatedResponse"
                },
                example: {
                    success: true,
                    message: "comment created successfully"
                }
            }
        }
    },

    CommentEditedSuccessfully: {
        description: "Comment edited successfully. The endpoint does not return the updated comment document.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CommentEditedResponse"
                },
                example: {
                    success: true,
                    message: "comment edited successfully"
                }
            }
        }
    },

    CommentDeletedSuccessfully: {
        description: "Comment deleted successfully. The endpoint does not return the deleted comment document.",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CommentDeletedResponse"
                },
                example: {
                    success: true,
                    message: "comment deleted successfully"
                }
            }
        }
    }
}
