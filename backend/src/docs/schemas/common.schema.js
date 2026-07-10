module.exports = {
    Error: {
        type: "object",
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