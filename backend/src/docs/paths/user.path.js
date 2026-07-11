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
                            $ref: "#/components/schemas/UserSignUp"
                        },
                        example: {
                            username: "amir",
                            email: "amir@gmail.com",
                            password: "StrongPassword123"
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
                                $ref: "#/components/schemas/AuthSuccess"
                            },
                            example: {
                                success: true,
                                message: "user signed up successfully",
                                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNTIzNjg2ZTUxMGE3M2ZlNDgyNGM3MCIsInJvbGUiOiJ1c2VyIiwiaXNCYW5uZWQiOmZhbHNlLCJiYW5FeHBpcmVzQXQiOm51bGwsImlhdCI6MTc4Mzc3MjgwNywiZXhwIjoxNzgzNzczMTA3fQ.hBYqg7qbmQqrRzrTUrusEJFtiuNswvDg7kzMbECul-k"
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
    "/users/auth/login": {
        post: {
            description: "user login with email and password",
            summary: "user login",
            tags: [
                "Users"
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/UserLogin"
                        },
                        example: {
                            email: "amir@gmail.com",
                            password: "StrongPassword123"
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "login successful",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/AuthSuccess"
                            },
                            example: {
                                success: true,
                                message: "login successful",
                                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNTIzNjg2ZTUxMGE3M2ZlNDgyNGM3MCIsInJvbGUiOiJ1c2VyIiwiaXNCYW5uZWQiOmZhbHNlLCJiYW5FeHBpcmVzQXQiOm51bGwsImlhdCI6MTc4Mzc3MjgwNywiZXhwIjoxNzgzNzczMTA3fQ.hBYqg7qbmQqrRzrTUrusEJFtiuNswvDg7kzMbECul-k"
                            }
                        }
                    }
                },
                400: {
                    $ref: "#/components/responses/FailedValidation"
                },
                401: {
                    description: "wrong email or password",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Error"
                            },
                            example: {
                                success: false,
                                message: "wrong email or password"
                            }
                        }
                    }
                },
                404: {
                    description: "user deleted",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Error"
                            },
                            example: {
                                success: false,
                                message: "user deleted"
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
    "/users/auth/logout": {
        post: {
            description: "log out user from all devices",
            summary: "user log out",
            tags: [
                "Users"
            ],
            responses: {
                200: {
                    description: "logged out successfully",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#components/schemas/Success"
                            },
                            example: {
                                success: true,
                                message: "user logged out successfully, please remove access token"
                            }
                        }
                    }
                },
                403: {
                    description: "not logged in",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Error"
                            },
                            example: {
                                success: false,
                                message: "you're not logged in"
                            }
                        }
                    }
                },
                401: {
                    $ref: "#/components/responses/Unauthorized"
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