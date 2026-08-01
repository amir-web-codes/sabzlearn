module.exports = {
    UserNotFound: {
        description: "User not found",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "user not found" }
            }
        }
    },

    UserNotFoundOrWasAdmin: {
        description: "User not found, already deleted, or is an admin (admins cannot be deleted through this endpoint, including deleting your own admin account via DELETE /me)",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "user not found or was an admin" }
            }
        }
    },

    UserDeleted: {
        description: "User account has been soft-deleted (returned on login attempts)",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/UserDeletedError" },
                example: {
                    success: false,
                    message: "user deleted",
                    details: {
                        deletedBy: { _id: "6857e4d1e5d82d0d1f5d8c32", username: "amir", email: "amir@gmail.com" },
                        deletedAt: "2026-07-01T10:00:00.000Z"
                    }
                }
            }
        }
    },

    EmailAlreadyExists: {
        description: "Email already exists",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "email already exists" }
            }
        }
    },

    WrongCredentials: {
        description: "Wrong email or password",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "wrong email or password" }
            }
        }
    },

    NotLoggedIn: {
        description: "deviceId cookie missing, user is not logged in",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "you're not logged in" }
            }
        }
    },

    TokenNotAvailable: {
        description: "Refresh token cookie missing or expired",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "token not available or expired" }
            }
        }
    },

    FakedRefreshToken: {
        description: "Refresh token reuse/mismatch detected — all sessions for this device were revoked",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "faked refresh token" }
            }
        }
    },

    InvalidOrExpiredRefreshToken: {
        description: "Refresh token is invalid or expired",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "invalid or expired token" }
            }
        }
    },

    RefreshTokenForbidden: {
        description: "403 on POST /users/refresh-token — three possible causes sharing this status code",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                    missingRefreshTokenCookie: {
                        summary: "refreshToken cookie missing/expired",
                        value: { success: false, message: "token not available or expired" }
                    },
                    missingDeviceIdCookie: {
                        summary: "deviceId cookie missing",
                        value: { success: false, message: "you're not logged in" }
                    },
                    invalidToken: {
                        summary: "token invalid/expired/mismatched (catch-all)",
                        value: { success: false, message: "invalid or expired token" }
                    }
                }
            }
        }
    },

    CannotBanAdmin: {
        description: "Cannot ban a user with the admin role",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "you can't ban an admin" }
            }
        }
    },

    BanUserForbidden: {
        description: "403 on PATCH /users/admin/{id}/ban — either the caller lacks admin role, or the target is an admin",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                    noPermission: {
                        summary: "caller is not an admin",
                        value: { success: false, message: "you don't have permission" }
                    },
                    targetIsAdmin: {
                        summary: "target user is an admin",
                        value: { success: false, message: "you can't ban an admin" }
                    }
                }
            }
        }
    },

    UserNotBanned: {
        description: "Target user is not currently banned",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "this user wasn't ban" }
            }
        }
    },

    CannotChangeAdminRole: {
        description: "Cannot change another admin's role",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "you can't change another admin role" }
            }
        }
    },

    ChangeRoleForbidden: {
        description: "403 on PATCH /users/admin/{id}/change-role — either the caller lacks admin role, or the target is an admin",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                    noPermission: {
                        summary: "caller is not an admin",
                        value: { success: false, message: "you don't have permission" }
                    },
                    targetIsAdmin: {
                        summary: "target user is an admin",
                        value: { success: false, message: "you can't change another admin role" }
                    }
                }
            }
        }
    },

    AlreadyHasRole: {
        description: "User already has the requested role",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "user already has this role" }
            }
        }
    },

    PendingRequestExists: {
        description: "User already has a pending role-change request",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "you already have a pending request" }
            }
        }
    },

    RequestNotFound: {
        description: "Role-change request not found",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "request not found" }
            }
        }
    },

    RequestAlreadyProcessed: {
        description: "Role-change request has already been accepted/rejected",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "this request has already been processed" }
            }
        }
    },

    ProcessRequestForbidden: {
        description: "403 on PATCH /users/admin/requests/{id}/accept and /reject — either the caller lacks admin role, or the request was already processed",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                    noPermission: {
                        summary: "caller is not an admin",
                        value: { success: false, message: "you don't have permission" }
                    },
                    alreadyProcessed: {
                        summary: "request already accepted/rejected",
                        value: { success: false, message: "this request has already been processed" }
                    }
                }
            }
        }
    },

    TooManyRequestsGlobalOrLogin: {
        description: "Rate limit exceeded — either the global limiter (100 requests / 20 minutes) or the login/signup limiter (10 requests / 5 minutes) was triggered",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                    global: {
                        summary: "global rate limit (100 requests / 20 minutes)",
                        value: { success: false, message: "you're sending too many requests, slow down cowboy🤠" }
                    },
                    login: {
                        summary: "login/signup rate limit",
                        value: { success: false, message: "too many login attempts, please try again later" }
                    }
                }
            }
        }
    }
}