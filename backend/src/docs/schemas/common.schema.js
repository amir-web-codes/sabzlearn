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
    }
}