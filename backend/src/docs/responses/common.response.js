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
        description: "The ban-check middleware blocks the request when the access token carries `isBanned=true` and the ban has not expired. The current middleware only queries the user record when that token claim is true.",
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

    TooManyRequestsGlobalOrLogin: {
        description: "Either the global limiter (100 requests per IP / 20 minutes) or the signup/login limiter (10 requests / 5 minutes) was exceeded.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },

                examples: {
                    global: {
                        summary: "Global rate limit",
                        value: {
                            success: false,
                            message: "you're sending too many requests, slow down cowboy🤠"
                        }
                    },

                    login: {
                        summary: "Signup/login rate limit",
                        value: {
                            success: false,
                            message: "too many login attempts, please try again later"
                        }
                    }
                }
            }
        }
    },

    TooManyRequestsGlobalOrAdmin: {
        description: "Either the global limiter (100 requests per IP / 20 minutes) or the admin-route limiter (250 requests per authenticated user id / 20 minutes) was exceeded. The admin-route limiter runs after access-token authentication and before the admin-role check. Both limiters currently return the same response body.",
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

    TooManyRequestsGlobalOrRequestRole: {
        description: "Either the global limiter (100 requests per IP / 20 minutes) or the role-request limiter (10 requests per IP / 60 minutes) was exceeded. The role-request limiter runs before body validation and authentication.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },

                examples: {
                    global: {
                        summary: "Global rate limit",
                        value: {
                            success: false,
                            message: "you're sending too many requests, slow down cowboy🤠"
                        }
                    },

                    requestRole: {
                        summary: "Role-request rate limit",
                        value: {
                            success: false,
                            message: "too many requests, please try again later"
                        }
                    }
                }
            }
        }
    },

    TooManyRequestsGlobalOrAdminChange: {
        description: "Either the global limiter (100 requests per IP / 20 minutes) or the admin-change limiter (3 requests per IP / 30 minutes) was exceeded. The admin-change limiter runs after access-token authentication and before the admin-role check.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },

                examples: {
                    global: {
                        summary: "Global rate limit",
                        value: {
                            success: false,
                            message: "you're sending too many requests, slow down cowboy🤠"
                        }
                    },

                    adminChange: {
                        summary: "Admin-change rate limit",
                        value: {
                            success: false,
                            message: "too many requests, please try again later"
                        }
                    }
                }
            }
        }
    },

    TooManyRequestsGlobalOrTicket: {
        description: "Either the global limiter (100 requests per IP / 20 minutes) or the ticket-creation limiter (5 requests per IP / 30 minutes) was exceeded.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },

                examples: {
                    global: {
                        summary: "Global rate limit",
                        value: {
                            success: false,
                            message: "you're sending too many requests, slow down cowboy🤠"
                        }
                    },

                    ticketCreation: {
                        summary: "Ticket creation rate limit",
                        value: {
                            success: false,
                            message: "you're sending too many tickets, please try again later"
                        }
                    }
                }
            }
        }
    },

    InvalidOptionalBearerToken: {
        description: "Authentication is optional for this endpoint. Omitting Authorization is allowed, but when a bearer token is supplied it must be valid and unexpired.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: {
                    success: false,
                    message: "invalid or expired token"
                }
            }
        }
    },

    ForbiddenOrBanned: {
        description: "The authenticated user is banned or does not have the required role.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                    wrongRole: {
                        summary: "Required role is missing",
                        value: {
                            success: false,
                            message: "you don't have permission"
                        }
                    },
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
                            message: "you are temporary banned until: 2026-08-30T12:00:00.000Z. Reason: Spam"
                        }
                    }
                }
            }
        }
    }
}