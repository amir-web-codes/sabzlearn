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
        description: "Lesson description. Required on create. Empty strings are accepted because the validator applies no minimum length.",
        example: "Learn the fundamentals of React Hooks and their common use cases."
    },

    LessonOrder: {
        type: "number",
        description: "Lesson ordering value. Multipart text is coerced to a JavaScript number. The current validator/model applies no integer, minimum, maximum, or uniqueness constraint.",
        example: 100
    },

    LessonDuration: {
        type: "number",
        minimum: 0,
        readOnly: true,
        default: 0,
        description: "Video duration in minutes, derived from Cloudinary upload metadata and rounded to 2 decimal places. It is 0 when no video is attached.",
        example: 15.42
    },

    LessonVideoReference: {
        allOf: [
            {
                $ref: "#/components/schemas/MediaAssetReference"
            }
        ],
        description: "Stored lesson video reference. Both url and publicId are null when no lesson video is attached. In the current source, url is the Cloudinary secure_url returned by a normal video upload."
    },

    Lesson: {
        allOf: [
            {
                $ref: "#/components/schemas/TimestampedMongoDocumentMeta"
            },
            {
                type: "object",
                description: "Full lesson document returned by create, edit, single-lesson read, and course-lesson list endpoints. courseId and publisherId are raw ObjectIds and are not populated.",
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
                        $ref: "#/components/schemas/LessonDuration"
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

    LessonAdminListItem: {
        type: "object",
        description: "Projection returned by GET /lessons/admin/get-all. The service explicitly selects only title, courseId, publisherId, order, and duration; MongoDB _id remains included by default.",
        properties: {
            _id: {
                $ref: "#/components/schemas/MongoObjectId"
            },
            title: {
                $ref: "#/components/schemas/LessonTitle"
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
            duration: {
                $ref: "#/components/schemas/LessonDuration"
            }
        },
        required: [
            "_id",
            "title",
            "courseId",
            "publisherId",
            "order",
            "duration"
        ]
    },

    CreateLessonMultipart: {
        type: "object",
        description: "multipart/form-data body for creating a lesson. Only the documented fields affect createLesson(): title, description, order, and the Multer file field video.",
        properties: {
            title: {
                $ref: "#/components/schemas/LessonTitle"
            },
            description: {
                $ref: "#/components/schemas/LessonDescription"
            },
            order: {
                allOf: [
                    {
                        $ref: "#/components/schemas/LessonOrder"
                    }
                ],
                description: "Optional. When omitted, the service uses the highest existing order in the same course + 100, or 100 when the course has no lessons."
            },
            video: {
                $ref: "#/components/schemas/VideoUploadFile"
            }
        },
        required: ["title", "description"]
    },

    EditLessonMultipart: {
        type: "object",
        description: "multipart/form-data body for editing a lesson. Every field is optional. Empty PATCH requests and file-only PATCH requests are accepted by the current route/validator.",
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
                description: "Exact multipart text value. `true` removes the existing video and resets duration to 0 only when a new video file is not also supplied. A new video file takes precedence.",
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
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/LessonAdminListItem"
                        },
                        description: "Always an array. The empty state is []."
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
                        description: "Always an array. The empty state is []."
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