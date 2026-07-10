module.exports = {
    UserNotFound: {
        description: "user not found",
        content: {
            "application/json": {
                schema: {
                    $ref: "#components/schemas/Error"
                },
                example: {
                    success: false,
                    message: "user not found"
                }
            }
        }
    }
}