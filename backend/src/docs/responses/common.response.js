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
    InvalidIdOrValidationFailed: {
        description: "400 — either the `id` path parameter is not a valid MongoDB ObjectId, or the request body/query failed validation",
        content: {
            "application/json": {
                schema: {
                    oneOf: [
                        { $ref: "#/components/schemas/Error" },
                        {
                            type: "object",
                            properties: {
                                success: { type: "boolean", example: false },
                                message: { type: "string", example: "validation failed" },
                                errors: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/ValidationErrorItem" }
                                }
                            }
                        }
                    ]
                },
                examples: {
                    invalidId: {
                        summary: "invalid id",
                        value: { success: false, message: "invalid id" }
                    },
                    validationFailed: {
                        summary: "body/query validation failed",
                        value: {
                            success: false,
                            message: "validation failed",
                            errors: [
                                { code: "too_small", path: ["limit"], message: "Number must be greater than or equal to 1" }
                            ]
                        }
                    }
                }
            }
        }
    },
    UserBanned: {
        description: "User is banned",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                    permanentBan: {
                        summary: "permanent ban",
                        value: { success: false, message: "you are permanently banned. Reason: Spam" }
                    },
                    temporaryBan: {
                        summary: "temporary ban",
                        value: { success: false, message: "you are temporary banned until: 2026-08-01T12:00:00.000Z. Reason: Spam" }
                    }
                }
            }
        }
    },
    TooManyRequestsGlobal: {
        description: "Rate limit exceeded — the global limiter (100 requests / 20 minutes, applies to every endpoint) and, on /admin/* list/read routes, the admin limiter (250 requests / 20 minutes) share this exact message.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "you're sending too many requests, slow down cowboy🤠" }
            }
        }
    },
    TooManyRequestsGlobalOrGeneric: {
        description: "Rate limit exceeded — either the global limiter (100 requests / 20 minutes) or this endpoint's specific limiter was triggered",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                    global: {
                        summary: "global rate limit (100 requests / 20 minutes)",
                        value: { success: false, message: "you're sending too many requests, slow down cowboy🤠" }
                    },
                    specific: {
                        summary: "endpoint-specific rate limit",
                        value: { success: false, message: "too many requests, please try again later" }
                    }
                }
            }
        }
    },
}