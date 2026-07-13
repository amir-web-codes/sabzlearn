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
                description: "اختیاری. اگر ارسال نشود، به‌صورت خودکار (آخرین order موجود در همان دوره + 100) محاسبه می‌شود"
            }
        },
        required: ["title", "description"]
    },

    EditLesson: {
        type: "object",
        description: "تمام فیلدها اختیاری هستند، فقط فیلدهای ارسال‌شده آپدیت می‌شوند",
        properties: {
            title: { type: "string", minLength: 5, maxLength: 150, example: "Introduction to Hooks (updated)" },
            description: { type: "string", example: "Updated description." },
            duration: { type: "number", example: 20 },
            order: { type: "number", example: 200 }
        }
    }
}