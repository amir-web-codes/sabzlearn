module.exports = {
    CommentSortByParameter: {
        name: "sortBy",
        in: "query",
        required: false,
        description: "Comment sort field. rating is stored as a string, so rating sorting follows MongoDB string ordering rather than Very Bad -> Very Good score order.",
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
