const exactSuccessSchema = (message) => ({
    allOf: [
        {
            $ref: "#/components/schemas/Success"
        },
        {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    enum: [message],
                    example: message
                }
            }
        }
    ]
})

module.exports = {
    CommentRating: {
        type: "string",
        description: "Stored comment rating. Values are strings, so sortBy=rating uses MongoDB string ordering rather than a numeric 1-5 score.",
        enum: ["Very Bad", "Bad", "Medium", "Good", "Very Good"],
        example: "Good"
    },

    CommentFields: {
        type: "object",
        description: "Fields that can be supplied when creating or editing a comment. The current Zod validators do not trim title/text.",
        properties: {
            title: {
                type: "string",
                minLength: 3,
                maxLength: 60,
                example: "Great course!"
            },
            text: {
                type: "string",
                minLength: 3,
                maxLength: 300,
                example: "Learned a lot, well explained."
            },
            rating: {
                $ref: "#/components/schemas/CommentRating"
            }
        }
    },

    CreateComment: {
        allOf: [
            {
                $ref: "#/components/schemas/CommentFields"
            },
            {
                type: "object",
                description: "Create-comment body. title and text are required. rating is optional and Zod supplies Medium when it is omitted. Unknown JSON properties are not used by the service.",
                properties: {
                    rating: {
                        allOf: [
                            {
                                $ref: "#/components/schemas/CommentRating"
                            }
                        ],
                        default: "Medium"
                    }
                },
                required: ["title", "text"]
            }
        ]
    },

    UpdateComment: {
        allOf: [
            {
                $ref: "#/components/schemas/CommentFields"
            }
        ],
        description: "Edit-comment body. Every field is optional and {} is valid; an empty object returns success without changing the document. Unlike create, rating has no update-time default. Unknown JSON properties are ignored by updateCommentById()."
    },

    Comment: {
        allOf: [
            {
                $ref: "#/components/schemas/TimestampedMongoDocumentMeta"
            },
            {
                $ref: "#/components/schemas/CommentFields"
            },
            {
                type: "object",
                description: "Raw Comment document returned by current comment list/detail services. authorId and courseId are not populated.",
                properties: {
                    authorId: {
                        $ref: "#/components/schemas/MongoObjectId"
                    },
                    courseId: {
                        $ref: "#/components/schemas/MongoObjectId"
                    }
                },
                required: ["title", "text", "authorId", "courseId", "rating"]
            }
        ]
    },

    CourseRatingSummary: {
        type: "object",
        description: "Current aggregate rating stored on the course and returned in GET /courses/{slug}/get-comments meta.rating.",
        properties: {
            average: {
                type: "number",
                minimum: 0,
                maximum: 5,
                example: 4.25
            },
            count: {
                type: "integer",
                minimum: 0,
                example: 12
            }
        },
        required: ["average", "count"]
    },

    CourseCommentsMeta: {
        allOf: [
            {
                $ref: "#/components/schemas/PaginationMeta"
            },
            {
                type: "object",
                properties: {
                    rating: {
                        $ref: "#/components/schemas/CourseRatingSummary"
                    }
                },
                required: ["rating"]
            }
        ]
    },

    CommentByIdResponse: {
        allOf: [
            {
                $ref: "#/components/schemas/Success"
            },
            {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        enum: ["comment fetched successfully"],
                        example: "comment fetched successfully"
                    },
                    data: {
                        $ref: "#/components/schemas/Comment"
                    }
                },
                required: ["data"]
            }
        ]
    },

    AdminUserCommentsListResponse: {
        allOf: [
            {
                $ref: "#/components/schemas/Success"
            },
            {
                type: "object",
                description: "Response for GET /comments/admin/{id}/comments. A valid ObjectId is enough; the target user document itself is not checked for existence.",
                properties: {
                    message: {
                        type: "string",
                        enum: ["comments fetched successfully"],
                        example: "comments fetched successfully"
                    },
                    data: {
                        oneOf: [
                            {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/Comment"
                                }
                            },
                            {
                                type: "string",
                                enum: ["no comments found"],
                                example: "no comments found"
                            }
                        ]
                    },
                    meta: {
                        $ref: "#/components/schemas/PaginationMeta"
                    }
                },
                required: ["data", "meta"]
            }
        ]
    },

    CourseCommentsListResponse: {
        allOf: [
            {
                $ref: "#/components/schemas/Success"
            },
            {
                type: "object",
                description: "Response for GET /courses/{slug}/get-comments. The empty state is the exact singular string no comment found.",
                properties: {
                    message: {
                        type: "string",
                        enum: ["comments fetched successfully"],
                        example: "comments fetched successfully"
                    },
                    data: {
                        oneOf: [
                            {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/Comment"
                                }
                            },
                            {
                                type: "string",
                                enum: ["no comment found"],
                                example: "no comment found"
                            }
                        ]
                    },
                    meta: {
                        $ref: "#/components/schemas/CourseCommentsMeta"
                    }
                },
                required: ["data", "meta"]
            }
        ]
    },

    CommentCreatedResponse: exactSuccessSchema("comment created successfully"),
    CommentEditedResponse: exactSuccessSchema("comment edited successfully"),
    CommentDeletedResponse: exactSuccessSchema("comment deleted successfully")
}
