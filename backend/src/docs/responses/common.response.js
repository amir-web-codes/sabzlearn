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
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        message: { type: "string", example: "validation failed" },
                        errors: {
                            type: "array",
                            items: { $ref: "#/components/schemas/ValidationErrorItem" }
                        }
                    },
                    required: ["success", "message", "errors"]
                },
                example: {
                    success: false,
                    message: "validation failed",
                    errors: [
                        { code: "too_small", path: ["password"], message: "String must contain at least 5 character(s)" }
                    ]
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