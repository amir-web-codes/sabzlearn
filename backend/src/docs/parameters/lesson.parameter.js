module.exports = {
    LessonSortByParameter: {
        name: "sortBy",
        in: "query",
        required: false,
        description: "Lesson list sort field.",
        schema: {
            type: "string",
            enum: ["order", "duration", "createdAt"],
            default: "order"
        },
        example: "order"
    },

    LessonCourseIdFilterParameter: {
        name: "courseId",
        in: "query",
        required: false,
        description: "Exact Course ObjectId filter for the admin lesson list. Only ObjectId syntax is validated; a valid but unknown courseId returns an empty array rather than 404. Supplying this filter also disables lesson-list Redis caching in the current service.",
        schema: {
            $ref: "#/components/schemas/MongoObjectId"
        },
        example: "6857e4d1e5d82d0d1f5d8c10"
    }
}