module.exports = {
    Unauthorized: {
        description: "Unauthrozied",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                examples: {
                    noToken: {
                        summary: "no token",
                        value: {
                            success: false,
                            message: "no token provided"
                        }
                    },
                    expiredToken: {
                        summary: "invalid or expired token",
                        value: {
                            success: false,
                            message: "invalid or expired token"
                        }
                    }
                }
            }
        }
    },
    Forbidden: {
        description: "No access",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                example: {
                    success: false,
                    message: "you don't have permission"
                }
            }
        }
    },
    InvalidId: {
        description: "Invalid id",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                example: {
                    success: false,
                    message: "invalid id"
                }
            }
        }
    },
    NoIdProvided: {
        description: "No id provided",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                example: {
                    success: false,
                    message: "no id provided"
                }
            }
        }
    },
    InternalServerError: {
        description: "internal server error",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                example: {
                    success: false,
                    message: "internal server error"
                }
            }
        }
    },
    FailedValidation: {
        description: "Request body validation failed",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                example: {
                    success: false,
                    message: "validation failed"
                }
            }
        }
    },
    TooManyLoginAttempts: {
        description: "Too many login/signup attempts",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                example: {
                    success: false,
                    message: "too many login attempts, please try again later"
                }
            }
        }
    },
    TooManyRequestsGeneric: {
        description: "Too many requests",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                example: {
                    success: false,
                    message: "too many requests, please try again later"
                }
            }
        }
    },
    TooManyAdminRequests: {
        description: "Too many requests (admin rate limit)",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },
                example: {
                    success: false,
                    message: "you're sending too many requests, slow down cowboy🤠"
                }
            }
        }
    }
}