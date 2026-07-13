module.exports = {
    Lesson: {
        type: "object",
        properties: {
            _id: { type: "string", example: "6857e4d1e5d82d0d1f5d8c50" },
            title: { type: "string", example: "Introduction to Hooks" },
            description: { type: "string", example: "Learn the basics of React Hooks." },
            courseId: { type: "string", example: "6857e4d1e5d82d0d1f5d8c10" },
            publisherId: { type: "string", description: "the user (admin/teacher) who created the lesson", example: "6857e4d1e5d82d0d1f5d8c99" },
            duration: { type: "number", default: 0, example: 15 },
            order: { type: "number", example: 100 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
        },
        required: ["title", "description", "courseId", "publisherId", "duration", "order"]
    },

    CreateLesson: {
        type: "object",
        properties: {
            title: { type: "string", minLength: 5, maxLength: 150, example: "Introduction to Hooks" },
            description: { type: "string", example: "Learn the basics of React Hooks." },
            duration: { type: "number", default: 0, example: 15 },
            order: {
                type: "number",
                example: 100,
                description: "Optional. If not provided, it will be automatically calculated as (the latest existing order in the same course + 100)."
            }
        },
        required: ["title", "description"]
    },

    EditLesson: {
        type: "object",
        description: "All fields are optional. Only the provided fields will be updated.",
        properties: {
            title: { type: "string", minLength: 5, maxLength: 150, example: "Introduction to Hooks (updated)" },
            description: { type: "string", example: "Updated description." },
            duration: { type: "number", example: 20 },
            order: { type: "number", example: 200 }
        }
    }
}