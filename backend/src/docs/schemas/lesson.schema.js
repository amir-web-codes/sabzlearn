module.exports = {
    Lesson: {
        type: "object",
        properties: {
            _id: { type: "string", example: "6857e4d1e5d82d0d1f5d8c50" },
            title: { type: "string", example: "Introduction to Hooks" },
            description: { type: "string", example: "Learn the basics of React Hooks." },
            courseId: { type: "string", example: "6857e4d1e5d82d0d1f5d8c10" },
            publisherId: { type: "string", description: "the user (admin/teacher) who created the lesson", example: "6857e4d1e5d82d0d1f5d8c99" },
            order: { type: "number", example: 100 },
            video: {
                type: "object",
                properties: {
                    url: { type: "string", nullable: true, example: "https://res.cloudinary.com/.../lessons/xyz.mp4" },
                    publicId: { type: "string", nullable: true, example: "sabzlearn/lessons/xyz" }
                }
            },
            duration: {
                type: "number",
                default: 0,
                description: "Duration in minutes, computed automatically from the uploaded video. 0 if the lesson has no video.",
                example: 15
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
        },
        required: ["title", "courseId", "publisherId", "order", "duration"]
    },

    CreateLessonMultipart: {
        type: "object",
        description: "multipart/form-data body. Field name for the video file must be exactly `video`.",
        properties: {
            title: { type: "string", minLength: 5, maxLength: 150, example: "Introduction to Hooks" },
            description: { type: "string", example: "Learn the basics of React Hooks." },
            order: {
                type: "integer",
                example: 100,
                description: "Optional. If not provided, it will be automatically calculated as (the latest existing order in the same course + 100)."
            },
            video: {
                type: "string",
                format: "binary",
                description: "Optional. mp4 only, max 100MB. Duration is computed automatically from this file and cannot be set directly."
            }
        },
        required: ["title", "description"]
    },

    EditLessonMultipart: {
        type: "object",
        description: "multipart/form-data body. All fields are optional. Field name for the video file must be exactly `video`.",
        properties: {
            title: { type: "string", minLength: 5, maxLength: 150, example: "Introduction to Hooks (updated)" },
            description: { type: "string", example: "Updated description." },
            order: { type: "integer", example: 200 },
            removeVideo: {
                type: "string",
                enum: ["true", "false"],
                description: "Set to \"true\" to remove the existing video and reset duration to 0. Ignored if a new `video` file is also uploaded in the same request (the new file takes precedence)."
            },
            video: {
                type: "string",
                format: "binary",
                description: "Optional. mp4 only, max 100MB. Replaces (and deletes from storage) the previous video; duration is recomputed automatically."
            }
        }
    },


    LessonByIdResponse: {
        type: "object",
        properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "lesson fetched successfully" },
            data: { $ref: "#/components/schemas/Lesson" }
        },
        required: ["success", "message", "data"]
    },

    LessonsListResponse: {
        type: "object",
        description: "GET /lessons/admin/get-all",
        properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "lessons fetched successfully" },
            data: {
                oneOf: [
                    { type: "array", items: { $ref: "#/components/schemas/Lesson" } },
                    { type: "string", example: "no lesson found" }
                ],
                description: "An array of lessons, or the literal string \"no lesson found\" when there are none"
            },
            meta: { $ref: "#/components/schemas/PaginationMeta" }
        },
        required: ["success", "message", "data", "meta"]
    },

    CourseLessonsListResponse: {
        type: "object",
        description: "GET /lessons/{slug}/get-lessons — unlike the admin get-all endpoint, this always returns an array (even if empty), never the \"no lesson found\" string",
        properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "course lessons fetched successfully" },
            data: { type: "array", items: { $ref: "#/components/schemas/Lesson" } },
            meta: { $ref: "#/components/schemas/PaginationMeta" }
        },
        required: ["success", "message", "data", "meta"]
    }
}