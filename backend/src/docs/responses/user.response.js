module.exports = {
    UserNotFound: {
        description: "Not found",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                example: {
                    success: false,
                    message: "user not found"
                }
            }
        }
    }
}