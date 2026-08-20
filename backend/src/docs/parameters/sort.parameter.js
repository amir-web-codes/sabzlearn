module.exports = {
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
    },

    CreatedAtSortByParameter: {
        name: "sortBy",
        in: "query",
        required: false,
        description: "Sort by the resource creation timestamp. These endpoints currently allow only `createdAt`.",
        schema: {
            type: "string",
            enum: ["createdAt"],
            default: "createdAt"
        },
        example: "createdAt"
    }
}