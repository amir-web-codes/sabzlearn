module.exports = {
    PageParameter: {
        name: "page",
        in: "query",
        required: false,
        description: "Page number for pagination (defaults to 1 if omitted or invalid)",
        schema: { type: "integer", minimum: 1, default: 1 },
        example: 1
    },
    LimitParameter: {
        name: "limit",
        in: "query",
        required: false,
        description: "Number of items per page (defaults to 20 if omitted or invalid, maximum 100)",
        schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
        example: 20
    }
}