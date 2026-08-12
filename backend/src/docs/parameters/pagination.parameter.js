module.exports = {
    PageParameter: {
        name: "page",
        in: "query",
        required: false,
        description: "Page number for pagination. Defaults to 1 only when omitted; invalid values return 400.",
        schema: { type: "integer", minimum: 1, default: 1 },
        example: 1
    },
    LimitParameter: {
        name: "limit",
        in: "query",
        required: false,
        description: "Number of items per page. Defaults to 20 only when omitted; invalid values return 400. Maximum: 100.",
        schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
        example: 20
    }
}