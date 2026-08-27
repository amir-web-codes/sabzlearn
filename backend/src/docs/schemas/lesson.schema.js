const lessonDataResponse = (message) => ({
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
                },
                data: {
                    $ref: "#/components/schemas/Lesson"
                }
            },
            required: ["data"]
        }
    ]
})

module.exports = {
    LessonTitle: {
        type: "string",
        minLength: 5,
        maxLength: 150,
        description: "Lesson title. The current Zod validator does not trim surrounding whitespace.",
        example: "Introduction to React Hooks"
    },

    LessonDescription: {
        type: "string",
        description: "Lesson description. It is required on create but may be an empty string because the current validator applies no minimum length.",
        example: "Learn the fundamentals of React Hooks and their common use cases."
    },

    LessonOrder: {
        type: "number",
        description: "Lesson ordering value. The backend coerces multipart text input to a number but currently applies no integer/minimum constraint. When omitted on create, the service uses the highest existing order in the same course + 100, or 100 when the course has no lessons.",
        example: 100
    },

    LessonVideoReference: {
        allOf: [
            {
                $ref: "#/components/schemas/MediaAssetReference"
            }
        ],
        description: "Stored lesson video reference. Both url and publicId are null when the lesson has no video."
    },

    Lesson: {
        allOf: [
            {
                $ref: "#/components/schemas/TimestampedMongoDocumentMeta"
            },
            {
                type: "object",
                description: "Lesson document returned by the current lesson controllers/services. courseId and publisherId are raw MongoDB ObjectIds and are not populated.",
                properties: {
                    title: {
                        $ref: "#/components/schemas/LessonTitle"
                    },
                    description: {
                        $ref: "#/components/schemas/LessonDescription"
                    },
                    courseId: {
                        $ref: "#/components/schemas/MongoObjectId"
                    },
                    publisherId: {
                        $ref: "#/components/schemas/MongoObjectId"
                    },
                    order: {
                        $ref: "#/components/schemas/LessonOrder"
                    },
                    video: {
                        $ref: "#/components/schemas/LessonVideoReference"
                    },
                    duration: {
                        type: "number",
                        minimum: 0,
                        readOnly: true,
                        default: 0,
                        description: "Video duration in minutes. It is derived from Cloudinary upload metadata and rounded to 2 decimal places. It is 0 when no video is attached.",
                        example: 15.42
                    }
                },
                required: [
                    "title",
                    "description",
                    "courseId",
                    "publisherId",
                    "order",
                    "video",
                    "duration"
                ]
            }
        ]
    },

    CreateLessonMultipart: {
        type: "object",
        description: "multipart/form-data body for creating a lesson. Unknown text fields are stripped by the current Zod object validator. The only accepted file field name is `video`.",
        properties: {
            title: {
                $ref: "#/components/schemas/LessonTitle"
            },
            description: {
                $ref: "#/components/schemas/LessonDescription"
            },
            order: {
                $ref: "#/components/schemas/LessonOrder"
            },
            video: {
                $ref: "#/components/schemas/VideoUploadFile"
            }
        },
        required: ["title", "description"]
    },

    EditLessonMultipart: {
        type: "object",
        description: "multipart/form-data body for editing a lesson. Every text field is optional and an entirely empty request is valid, returning the unchanged lesson. A request containing only `video` is also valid. Unknown text fields are stripped by Zod.",
        properties: {
            title: {
                $ref: "#/components/schemas/LessonTitle"
            },
            description: {
                $ref: "#/components/schemas/LessonDescription"
            },
            order: {
                $ref: "#/components/schemas/LessonOrder"
            },
            removeVideo: {
                type: "string",
                enum: ["true", "false"],
                description: "Set the exact multipart text value `true` to remove the existing video and reset duration to 0. If a new `video` file is also supplied, the new file takes precedence and removeVideo is ignored by the service branch.",
                example: "true"
            },
            video: {
                $ref: "#/components/schemas/VideoUploadFile"
            }
        }
    },

    LessonFetchedResponse: lessonDataResponse("lesson fetched successfully"),

    LessonAddedResponse: lessonDataResponse("lesson added successfully"),

    LessonEditedResponse: lessonDataResponse("lesson edited successfully"),

    LessonDeletedResponse: {
        allOf: [
            {
                $ref: "#/components/schemas/Success"
            },
            {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        enum: ["lesson deleted successfully"],
                        example: "lesson deleted successfully"
                    }
                }
            }
        ]
    },

    LessonsAdminListResponse: {
        allOf: [
            {
                $ref: "#/components/schemas/Success"
            },
            {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        enum: ["lessons fetched successfully"],
                        example: "lessons fetched successfully"
                    },
                    data: {
                        oneOf: [
                            {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/Lesson"
                                }
                            },
                            {
                                type: "string",
                                enum: ["no lesson found"],
                                example: "no lesson found"
                            }
                        ],
                        description: "An array when at least one lesson matches; otherwise the exact string `no lesson found`."
                    },
                    meta: {
                        $ref: "#/components/schemas/PaginationMeta"
                    }
                },
                required: ["data", "meta"]
            }
        ]
    },

    CourseLessonsListResponse: {
        allOf: [
            {
                $ref: "#/components/schemas/Success"
            },
            {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        enum: ["course lessons fetched successfully"],
                        example: "course lessons fetched successfully"
                    },
                    data: {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/Lesson"
                        },
                        description: "Always an array. The empty state is `[]`."
                    },
                    meta: {
                        $ref: "#/components/schemas/PaginationMeta"
                    }
                },
                required: ["data", "meta"]
            }
        ]
    }
}