module.exports = {
    LessonSortByParameter: {
        name: "sortBy",
        in: "query",
        required: false,
        description: "Field to sort lessons by",
        schema: { type: "string", enum: ["order", "duration", "createdAt"], default: "order" },
        example: "order"
    },
    CourseIdFilterParameter: {
        name: "courseId",
        in: "query",
        required: false,
        description: "Filter lessons by course id",
        schema: { type: "string", pattern: "^[0-9a-fA-F]{24}$" },
        example: "6857e4d1e5d82d0d1f5d8c10"
    }
}