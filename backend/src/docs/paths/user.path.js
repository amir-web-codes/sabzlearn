module.exports = {
    "/users/auth/signup": {
        post: {
            description: "user login for the first time",
            summary: "user sign up",
            tags: [
                "Users"
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/AuthSuccess"
                        },
                        example: {
                            username: "amir",
                            email: "amir@gmail.com",
                            password: "12345678"
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "user signed up successfully",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/SuccessLoginSchema"
                            },
                            example: {
                                success: true,
                                message: "user signed up successfully"
                            }
                        }
                    }
                },
                400: {
                    $ref: "#/components/responses/FailedValidation"
                },
                409: {
                    description: "email already exists",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Error"
                            },
                            example: {
                                success: false,
                                message: "email already exists"
                            }
                        }
                    }
                },
                429: {
                    $ref: "#/components/responses/TooManyRequests"
                },
                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },
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
                    $ref: "#/components/responses/UserNotFound"
                },
                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    }
}