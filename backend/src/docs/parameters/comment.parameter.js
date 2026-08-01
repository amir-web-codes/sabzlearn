module.exports = {
    CommentSortByParameter: {
        name: "sortBy",
        in: "query",
        required: false,
        description: "Field to sort comments by",
        schema: { type: "string", enum: ["createdAt", "rating"], default: "createdAt" },
        example: "createdAt"
    },
    CommentRatingFilterParameter: {
        name: "rating",
        in: "query",
        required: false,
        description: "Filter comments by rating",
        schema: { type: "string", enum: ["Very Bad", "Bad", "Medium", "Good", "Very Good"] },
        example: "Good"
    }
}