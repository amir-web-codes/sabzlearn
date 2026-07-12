module.exports = {
    AvailableOnlyParameter: {
        name: "availableOnly",
        in: "query",
        required: false,
        schema: { type: "string", enum: ["true", "false"], default: "false" },
        example: "true"
    }
}