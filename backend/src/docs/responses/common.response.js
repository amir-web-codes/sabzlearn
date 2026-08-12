module.exports = {
    Unauthorized: {
        description: "The access token is missing, invalid, or expired",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                    noToken: {
                        summary: "Authorization bearer token is missing",
                        value: {
                            success: false,
                            message: "no token provided"
                        }
                    },
                    invalidOrExpiredToken: {
                        summary: "Bearer token cannot be verified",
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
        description: "The authenticated user does not have the required role",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: {
                    success: false,
                    message: "you don't have permission"
                }
            }
        }
    },

    InvalidId: {
        description: "The `id` path parameter is not a valid MongoDB ObjectId",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: {
                    success: false,
                    message: "invalid id"
                }
            }
        }
    },

    FailedValidation: {
        description: "The request body or query parameters failed Zod validation",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/ValidationError" },
                example: {
                    success: false,
                    message: "validation failed",
                    errors: [
                        {
                            code: "too_small",
                            path: ["password"],
                            message: "Too small: expected string to have >=5 characters"
                        }
                    ]
                }
            }
        }
    },

    InvalidIdOrValidationFailed: {
        description: "The `id` path parameter is invalid, or the request body/query failed validation",
        content: {
            "application/json": {
                schema: {
                    oneOf: [
                        { $ref: "#/components/schemas/Error" },
                        { $ref: "#/components/schemas/ValidationError" }
                    ]
                },
                examples: {
                    invalidId: {
                        summary: "Invalid MongoDB ObjectId",
                        value: {
                            success: false,
                            message: "invalid id"
                        }
                    },
                    validationFailed: {
                        summary: "Body or query validation failed",
                        value: {
                            success: false,
                            message: "validation failed",
                            errors: [
                                {
                                    code: "too_small",
                                    path: ["limit"],
                                    message: "Too small: expected number to be >0"
                                }
                            ]
                        }
                    }
                }
            }
        }
    },

    UserBanned: {
        description: "The authenticated user is currently banned",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                    permanentBan: {
                        summary: "Permanent ban",
                        value: {
                            success: false,
                            message: "you are permanently banned. Reason: Spam"
                        }
                    },
                    temporaryBan: {
                        summary: "Temporary ban",
                        value: {
                            success: false,
                            message: "you are temporary banned until: 2026-08-01T12:00:00.000Z. Reason: Spam"
                        }
                    }
                }
            }
        }
    },

    UserNotFound: {
        description: "User not found",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: {
                    success: false,
                    message: "user not found"
                }
            }
        }
    },

    CourseNotFound: {
        description: "Course with the supplied slug was not found",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: {
                    success: false,
                    message: "course not found"
                }
            }
        }
    },

    InternalServerError: {
        description: "An unexpected server error occurred",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: {
                    success: false,
                    message: "internal server error"
                }
            }
        }
    },

    TooManyRequestsGlobal: {
        description: "The global rate limit was exceeded (100 requests per IP per 20 minutes). It applies to every route, including `/health` and `/api-docs`.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: {
                    success: false,
                    message: "you're sending too many requests, slow down cowboy🤠"
                }
            }
        }
    },

    TooManyRequestsGlobalOrGeneric: {
        description: "The global limiter or an endpoint-specific limiter was exceeded",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                    global: {
                        summary: "Global limit",
                        value: {
                            success: false,
                            message: "you're sending too many requests, slow down cowboy🤠"
                        }
                    },
                    endpointSpecific: {
                        summary: "Endpoint-specific limit",
                        value: {
                            success: false,
                            message: "too many requests, please try again later"
                        }
                    }
                }
            }
        }
    }
}