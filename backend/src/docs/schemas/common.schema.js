module.exports = {
    Error: {
        type: "object",
        description: "Standard error response",
        properties: {
            success: {
                type: "boolean",
                example: false
            },
            message: {
                type: "string",
                example: "error"
            }
        },
        required: [
            "success",
            "message"
        ]
    },
    Success: {
        type: "object",
        description: "Standard success response",
        properties: {
            success: {
                type: "boolean",
                example: true
            },
            message: {
                type: "string",
                example: "success"
            }
        },
        required: [
            "success",
            "message"
        ]
    },
    PaginationMeta: {
        type: "object",
        description: "Pagination metadata",
        properties: {
            totalNumber: { type: "number", example: 42 },
            totalPages: { type: "number", example: 3 },
            page: { type: "number", example: 1 },
            limit: { type: "number", example: 20 }
        }
    }
}