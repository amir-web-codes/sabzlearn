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
    }
}