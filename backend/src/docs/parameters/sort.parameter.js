module.exports = {
    SortByParameter: {
        name: "sortBy",
        in: "query",
        required: false,
        description: "Field used for sorting items",
        schema: {
            type: "string",
            enum: ["createdAt"],
            default: "createdAt"
        },
        example: "createdAt"
    },

    SortOrderParameter: {
        name: "sortOrder",
        in: "query",
        required: false,
        description: "Sort direction",
        schema: {
            type: "string",
            enum: ["asc", "desc"],
            default: "desc"
        },
        example: "desc"
    }
}