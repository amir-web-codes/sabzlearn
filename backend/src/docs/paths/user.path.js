module.exports = {
    "/users/me": {
        get: {
            description: "Get user profile based on its JWT token ID",
            summary: "Get user profile",
            tags: [
                "Users"
            ],
            responses: {
                200: {
                    description: "success",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/GetUserProfile"
                            }
                        }
                    }
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
                },
                404: {
                    $ref: "#/components/responses/NotFound"
                }
            }
        }
    }
}