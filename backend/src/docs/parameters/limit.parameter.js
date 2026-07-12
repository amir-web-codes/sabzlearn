module.exports = {
    LimitParameter:
    {
        name: "limit",
        in: "query",
        required: false,
        schema: {
            type: "integer",
            default: 20
        }
    }
}