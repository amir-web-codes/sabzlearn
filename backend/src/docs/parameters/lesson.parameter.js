module.exports = {
    LessonSortByParameter: {
        name: "sortBy",
        in: "query",
        required: false,
        description: "Field used to sort lesson lists.",
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
        description: "Filter the admin lesson list by an exact Course ObjectId. The backend validates only the ObjectId format; it does not verify that a Course document with this id exists, so an unknown valid id returns an empty result rather than 404.",
        schema: {
            $ref: "#/components/schemas/MongoObjectId"
        },
        example: "6857e4d1e5d82d0d1f5d8c10"
    }
}