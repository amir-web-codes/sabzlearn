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

    SortOrderAscParameter: {
        name: "sortOrder",
        in: "query",
        required: false,
        description: "Sort direction for endpoints whose backend default is ascending.",
        schema: {
            type: "string",
            enum: ["asc", "desc"],
            default: "asc"
        },
        example: "asc"
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