module.exports = {
    TicketStatusParameter: {
        name: "status",
        in: "query",
        required: false,
        description: "Filter tickets by their current status",
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
        description: "When true, returns only tickets that are not closed. Used by staff ticket listing endpoint.",
        schema: {
            type: "string",
            enum: ["true", "false"],
            default: "true"
        },
        example: "true"
    }
}