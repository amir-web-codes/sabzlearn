module.exports = {
    "/users/me": {
        get: {
            summary: "Gets user profile",
            description: "Gets user profile by its JWT token ID",
            tags: [
                "Users"
            ],
            responses: {
                200: {
                    description: "user fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/User"
                            }
                        }
                    }
                },
                400: {
                    description: "failed"
                }
            }
        }
    }
}