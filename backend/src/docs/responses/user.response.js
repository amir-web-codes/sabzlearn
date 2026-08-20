module.exports = {
    UserNotFoundOrWasAdmin: {
        description: "The target user does not exist, is already soft-deleted for delete operations, or has the admin role (admins cannot be deleted through these endpoints).",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "user not found or was an admin" }
            }
        }
    },

    UserDeleted: {
        description: "Credentials were correct, but the user account has been soft-deleted.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/UserDeletedError" },
                example: {
                    success: false,
                    message: "user deleted",
                    details: {
                        deletedBy: {
                            _id: "6857e4d1e5d82d0d1f5d8c32",
                            username: "amir",
                            email: "amir@gmail.com"
                        },
                        deletedAt: "2026-07-01T10:00:00.000Z"
                    }
                }
            }
        }
    },

    EmailAlreadyExists: {
        description: "The supplied email already belongs to another user.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "email already exists" }
            }
        }
    },

    WrongCredentials: {
        description: "Email/password pair is invalid.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "wrong email or password" }
            }
        }
    },

    NotLoggedIn: {
        description: "The deviceId cookie is missing.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "you're not logged in" }
            }
        }
    },

    FakedRefreshToken: {
        description: "The refresh token does not match the latest active token for this user/device, or token reuse/revocation was detected.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "faked refresh token" }
            }
        }
    },

    RefreshTokenForbidden: {
        description: "POST /users/refresh-token failed before a new token could be issued.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                    missingRefreshTokenCookie: {
                        summary: "refreshToken cookie missing",
                        value: {
                            success: false,
                            message: "token not available or expired"
                        }
                    },

                    missingDeviceIdCookie: {
                        summary: "deviceId cookie missing",
                        value: {
                            success: false,
                            message: "you're not logged in"
                        }
                    },

                    invalidOrExpiredToken: {
                        summary: "refresh token verification failed or another non-401 refresh failure occurred",
                        value: {
                            success: false,
                            message: "invalid or expired token"
                        }
                    }
                }
            }
        }
    },

    BanUserForbidden: {
        description: "PATCH /users/admin/{id}/ban is forbidden because the caller is not an admin or the target user is an admin.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                    noPermission: {
                        summary: "Caller is not an admin",
                        value: {
                            success: false,
                            message: "you don't have permission"
                        }
                    },

                    targetIsAdmin: {
                        summary: "Target user is an admin",
                        value: {
                            success: false,
                            message: "you can't ban an admin"
                        }
                    }
                }
            }
        }
    },

    UserNotBanned: {
        description: "The target user is not currently banned.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: {
                    success: false,
                    message: "this user is not ban"
                }
            }
        }
    },

    ChangeRoleForbidden: {
        description: "PATCH /users/admin/{id}/change-role is forbidden because the caller is not an admin or the target user is already an admin.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                    noPermission: {
                        summary: "Caller is not an admin",
                        value: {
                            success: false,
                            message: "you don't have permission"
                        }
                    },

                    targetIsAdmin: {
                        summary: "Target user is an admin",
                        value: {
                            success: false,
                            message: "you can't change another admin role"
                        }
                    }
                }
            }
        }
    },

    AlreadyHasRole: {
        description: "The current access-token role already equals the requested role.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: {
                    success: false,
                    message: "user already has this role"
                }
            }
        }
    },

    PendingRequestExists: {
        description: "The user already has a pending role-change request.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: {
                    success: false,
                    message: "you already have a pending request"
                }
            }
        }
    },

    RequestNotFound: {
        description: "Role-change request not found.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: {
                    success: false,
                    message: "request not found"
                }
            }
        }
    },

    RequestOrUserNotFound: {
        description: "The role-change request does not exist, or the user referenced by the request no longer exists.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },

                examples: {
                    requestNotFound: {
                        summary: "Request not found",
                        value: {
                            success: false,
                            message: "request not found"
                        }
                    },

                    userNotFound: {
                        summary: "Request exists but target user was not found",
                        value: {
                            success: false,
                            message: "user not found"
                        }
                    }
                }
            }
        }
    },

    ProcessRequestForbidden: {
        description: "The caller is not an admin, or this role-change request has already been processed.",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },

                examples: {
                    noPermission: {
                        summary: "Caller is not an admin",
                        value: {
                            success: false,
                            message: "you don't have permission"
                        }
                    },

                    alreadyProcessed: {
                        summary: "Request is already accepted/rejected",
                        value: {
                            success: false,
                            message: "this request has already been processed"
                        }
                    }
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
    }
}