module.exports = {
    CommentSortByParameter: {
        name: "sortBy",
        in: "query",
        required: false,
        description: "Comment sort field. sortBy=rating uses the backend's semantic score order: Very Bad=1, Bad=2, Medium=3, Good=4, Very Good=5. sortOrder controls ascending/descending semantic score.",
        schema: {
            type: "string",
            enum: ["createdAt", "rating"],
            default: "createdAt"
        },
        example: "createdAt"
    },

    CommentRatingFilterParameter: {
        name: "rating",
        in: "query",
        required: false,
        description: "Exact, case-sensitive comment-rating filter.",
        schema: {
            $ref: "#/components/schemas/CommentRating"
        },
        example: "Good"
    }
}