module.exports = {
    Comment: {
        type: "object",
        properties: {
            _id: { type: "string", example: "6857e4d1e5d82d0d1f5d8c60" },
            title: { type: "string", example: "Great course!" },
            text: { type: "string", example: "Learned a lot, well explained." },
            authorId: { type: "string", example: "6857e4d1e5d82d0d1f5d8c32" },
            courseId: { type: "string", example: "6857e4d1e5d82d0d1f5d8c10" },
            rating: { type: "string", enum: ["Very Bad", "Bad", "Medium", "Good", "Very Good"], example: "Good" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
        },
        required: ["title", "text", "authorId", "courseId", "rating"]
    },

    CreateComment: {
        type: "object",
        properties: {
            title: { type: "string", minLength: 3, maxLength: 60, example: "Great course!" },
            text: { type: "string", minLength: 3, maxLength: 300, example: "Learned a lot, well explained." },
            rating: {
                type: "string",
                enum: ["Very Bad", "Bad", "Medium", "Good", "Very Good"],
                default: "Medium",
                example: "Good"
            }
        },
        required: ["title", "text"]
    },

    UpdateComment: {
        type: "object",
        description: "All fields are optional. Only the provided fields will be updated.",
        properties: {
            title: { type: "string", minLength: 3, maxLength: 60, example: "Updated title" },
            text: { type: "string", minLength: 3, maxLength: 300, example: "Updated review text." },
            rating: { type: "string", enum: ["Very Bad", "Bad", "Medium", "Good", "Very Good"], example: "Very Good" }
        }
    },

    CommentByIdResponse: {
        type: "object",
        properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "comment fetched successfully" },
            data: { $ref: "#/components/schemas/Comment" }
        },
        required: ["success", "message", "data"]
    },

    CommentsListResponse: {
        type: "object",
        description: "GET /comments/{id}/comments — a specific user's comments (admin only)",
        properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "comments fetched successfully" },
            data: {
                oneOf: [
                    { type: "array", items: { $ref: "#/components/schemas/Comment" } },
                    { type: "string", example: "no comments found" }
                ],
                description: "An array of the user's comments, or the literal string \"no comments found\" when there are none"
            },
            meta: { $ref: "#/components/schemas/PaginationMeta" }
        },
        required: ["success", "message", "data", "meta"]
    }
}