module.exports = {
    UserNotFound: {
        description: "Not found",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "user not found" }
            }
        }
    },
    UserDeleted: {
        description: "User account has been soft-deleted",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "user deleted" }
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
                        value: { success: false, message: "you are permanently banned. Reason: violating rules" }
                    },
                    temporaryBan: {
                        summary: "temporary ban",
                        value: { success: false, message: "you are temporary banned until: 2026-08-01T12:00:00.000Z. Reason: spam" }
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
        description: "Refresh token reuse/mismatch detected",
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
    InvalidBanDays: {
        description: "banDays value is invalid",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "invalid ban days" }
            }
        }
    },
    CannotBanAdmin: {
        description: "Cannot ban a user with admin role",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "you can't ban an admin" }
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
    InvalidRequestedRole: {
        description: "Requested role is not allowed for role-requests (only user/teacher)",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "requested role not available" }
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
    }
}