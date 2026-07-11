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
        description: "request body validation failed",
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
    TooManyRequests: {
        description: "too many requests",
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
    }
}