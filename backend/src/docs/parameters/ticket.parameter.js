module.exports = {
    TicketStatusParameter: {
        name: "status",
        in: "query",
        required: false,
        description: "Filter tickets by their current status.",
        schema: {
            type: "string",
            enum: ["open", "pending", "closed"]
        },
        example: "open"
    },

    AvailableOnlyParameter: {
        name: "availableOnly",
        in: "query",
        required: false,
        description: "Staff-list option. Defaults to `true`. It is used only when `status` is omitted: `true` excludes closed tickets, while `false` applies no status filter. When `status` is supplied, the explicit status filter takes precedence and `availableOnly` is ignored.",
        schema: {
            type: "string",
            enum: ["true", "false"],
            default: "true"
        },
        example: "true"
    }
}