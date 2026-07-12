module.exports = {
    // ==================== AUTH ====================

    "/users/auth/signup": {
        post: {
            description: "user login for the first time",
            summary: "user sign up",
            tags: ["Users", "Auth"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/UserSignUp" },
                        example: {
                            username: "amir",
                            email: "amir@gmail.com",
                            password: "StrongPassword123",
                            rememberMe: false
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "user signed up successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/AuthSuccess" },
                            example: {
                                success: true,
                                message: "user signed up successfully",
                                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                            }
                        }
                    }
                },
                400: { $ref: "#/components/responses/FailedValidation" },
                409: { $ref: "#/components/responses/EmailAlreadyExists" },
                429: { $ref: "#/components/responses/TooManyLoginAttempts" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/auth/login": {
        post: {
            description: "user login with email and password",
            summary: "user login",
            tags: ["Users", "Auth"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/UserLogin" },
                        example: {
                            email: "amir@gmail.com",
                            password: "StrongPassword123",
                            rememberMe: false
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "login successful",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/AuthSuccess" },
                            example: {
                                success: true,
                                message: "login successful",
                                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                            }
                        }
                    }
                },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/WrongCredentials" },
                404: { $ref: "#/components/responses/UserDeleted" },
                429: { $ref: "#/components/responses/TooManyLoginAttempts" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/auth/logout": {
        post: {
            description: "log out user from current device (revoke refresh tokens for this deviceId)",
            summary: "user log out",
            tags: ["Users", "Auth"],
            responses: {
                200: {
                    description: "logged out successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: {
                                success: true,
                                message: "user logged out successfully, please remove access token"
                            }
                        }
                    }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/NotLoggedIn" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/refresh-token": {
        post: {
            description: "get a new access token & refresh token pair using the refreshToken cookie",
            summary: "get access token",
            tags: ["Users", "Auth"],
            requestBody: {
                required: false,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/RefreshTokenBody" },
                        example: { rememberMe: true }
                    }
                }
            },
            responses: {
                200: {
                    description: "token refreshed successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/AuthSuccess" },
                            example: {
                                success: true,
                                message: "token refreshed successfully",
                                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                            }
                        }
                    }
                },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/FakedRefreshToken" },
                403: {
                    description: "not logged in / token missing / invalid or expired refresh token",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            examples: {
                                tokenNotAvailable: {
                                    summary: "refresh token cookie missing",
                                    value: { success: false, message: "token not available or expired" }
                                },
                                notLoggedIn: {
                                    summary: "deviceId cookie missing",
                                    value: { success: false, message: "you're not logged in" }
                                },
                                invalidOrExpired: {
                                    summary: "invalid or expired refresh token",
                                    value: { success: false, message: "invaild or expired token" }
                                }
                            }
                        }
                    }
                },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/change-password": {
        patch: {
            description: "change current user's password. this revokes all refresh tokens and clears the refreshToken cookie, forcing the user to log in again",
            summary: "change password",
            tags: ["Users"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/ChangePassword" },
                        example: { password: "NewStrongPassword123" }
                    }
                }
            },
            responses: {
                200: {
                    description: "password changed successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: {
                                success: true,
                                message: "password changed successfully, please Login again"
                            }
                        }
                    }
                },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/Unauthorized" },
                404: { $ref: "#/components/responses/UserNotFound" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/me": {
        get: {
            description: "Get user profile based on its JWT token ID",
            summary: "Get user profile",
            tags: ["Users"],
            responses: {
                200: {
                    description: "success",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/GetUserProfile" }
                        }
                    }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                404: { $ref: "#/components/responses/UserNotFound" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        },
        delete: {
            description: "Soft-deletes the authenticated user's account (sets isDeleted flag and removes all refresh tokens)",
            summary: "Delete current user",
            tags: ["Users"],
            responses: {
                200: {
                    description: "user deleted successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "user deleted successfully" }
                        }
                    }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/UserBanned" },
                404: { $ref: "#/components/responses/UserNotFound" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        },
        patch: {
            description: "Update authenticated user's username and/or email",
            summary: "Update current user",
            tags: ["Users"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/UpdateUser" },
                        example: { username: "amir_new", email: "new-amir@gmail.com" }
                    }
                }
            },
            responses: {
                200: {
                    description: "user updated successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "user updated successfully" }
                        }
                    }
                },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: {
                    description: "user is banned OR email already exists",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            examples: {
                                banned: {
                                    summary: "user is banned",
                                    value: { success: false, message: "you are permanently banned. Reason: violating rules" }
                                },
                                emailExists: {
                                    summary: "email already exists",
                                    value: { success: false, message: "email already exists" }
                                }
                            }
                        }
                    }
                },
                404: { $ref: "#/components/responses/UserNotFound" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/me/get-courses": {
        get: {
            description: "Get the list of courses the authenticated user is enrolled in",
            summary: "Get current user's courses",
            tags: ["Users", "Courses"],
            parameters: [
                { name: "page", in: "query", required: false, schema: { type: "integer", default: 1 } },
                { name: "limit", in: "query", required: false, schema: { type: "integer", default: 20 } }
            ],
            responses: {
                200: {
                    description: "courses fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "courses fetched successfully" },
                                    data: {
                                        oneOf: [
                                            { type: "array", items: { $ref: "#/components/schemas/UserCourse" } },
                                            { type: "string", example: "no course found" }
                                        ]
                                    },
                                    meta: { $ref: "#/components/schemas/PaginationMeta" }
                                }
                            }
                        }
                    }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/me/get-comments": {
        get: {
            description: "Get comments written by the authenticated user",
            summary: "Get current user's comments",
            tags: ["Users", "Comments"],
            parameters: [
                { name: "page", in: "query", required: false, schema: { type: "integer", default: 1 } },
                { name: "limit", in: "query", required: false, schema: { type: "integer", default: 20 } }
            ],
            responses: {
                200: {
                    description: "comments fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "comments fetched successfully" },
                                    data: {
                                        oneOf: [
                                            { type: "array", items: { type: "object" } },
                                            { type: "string", example: "you don't have any comment" }
                                        ]
                                    },
                                    meta: { $ref: "#/components/schemas/PaginationMeta" }
                                }
                            }
                        }
                    }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/me/dashboard": {
        get: {
            description: "Get a summary dashboard (stats, account status, pending requests) for the authenticated user",
            summary: "Get current user's dashboard",
            tags: ["Users"],
            responses: {
                200: {
                    description: "dashboard fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "dashboard fetched successfully" },
                                    data: { $ref: "#/components/schemas/UserDashboard" }
                                }
                            }
                        }
                    }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                404: { $ref: "#/components/responses/UserNotFound" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/request-role": {
        patch: {
            description: "Request a role change (user -> teacher). Maximum 3 stored requests per user, and only one pending request at a time is allowed",
            summary: "Request a new role",
            tags: ["Users", "Requests"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/RequestRole" },
                        example: { newRole: "teacher" }
                    }
                }
            },
            responses: {
                200: {
                    description: "request sent successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "request sent successfully" }
                        }
                    }
                },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/PendingRequestExists" },
                409: { $ref: "#/components/responses/AlreadyHasRole" },
                422: { $ref: "#/components/responses/InvalidRequestedRole" },
                429: { $ref: "#/components/responses/TooManyRequestsGeneric" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/admin/requests/get-pending": {
        get: {
            description: "Get all pending role-change requests (admin only)",
            summary: "Get pending requests",
            tags: ["Users", "Admin", "Requests"],
            parameters: [
                { name: "page", in: "query", required: false, schema: { type: "integer", default: 1 } },
                { name: "limit", in: "query", required: false, schema: { type: "integer", default: 20 } }
            ],
            responses: {
                200: {
                    description: "requests fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "requests fetched successfully" },
                                    data: { type: "array", items: { $ref: "#/components/schemas/Request" } },
                                    meta: { $ref: "#/components/schemas/PaginationMeta" }
                                }
                            }
                        }
                    }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/Forbidden" },
                429: { $ref: "#/components/responses/TooManyAdminRequests" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/admin/requests/get-all": {
        get: {
            description: "Get all role-change requests regardless of status (admin only)",
            summary: "Get all requests",
            tags: ["Users", "Admin", "Requests"],
            parameters: [
                { name: "page", in: "query", required: false, schema: { type: "integer", default: 1 } },
                { name: "limit", in: "query", required: false, schema: { type: "integer", default: 20 } }
            ],
            responses: {
                200: {
                    description: "requests fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "requests fetched successfully" },
                                    data: { type: "array", items: { $ref: "#/components/schemas/Request" } },
                                    meta: { $ref: "#/components/schemas/PaginationMeta" }
                                }
                            }
                        }
                    }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/Forbidden" },
                429: { $ref: "#/components/responses/TooManyAdminRequests" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/admin/requests/{id}": {
        get: {
            description: "Get a single role-change request by id, populated with requester & processor info (admin only)",
            summary: "Get request by id",
            tags: ["Users", "Admin", "Requests"],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" }, example: "6857e4d1e5d82d0d1f5d8c40" }
            ],
            responses: {
                200: {
                    description: "request fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "request fetched successfully" },
                                    data: { $ref: "#/components/schemas/Request" }
                                }
                            }
                        }
                    }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/Forbidden" },
                429: { $ref: "#/components/responses/TooManyAdminRequests" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/admin/requests/{id}/accept": {
        patch: {
            description: "Accept a pending role-change request and apply the new role to the requesting user (admin only)",
            summary: "Accept a role request",
            tags: ["Users", "Admin", "Requests"],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" }, example: "6857e4d1e5d82d0d1f5d8c40" }
            ],
            responses: {
                200: {
                    description: "request accepted successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "request accepted successfully" }
                        }
                    }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: {
                    description: "no permission OR request already processed",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            examples: {
                                forbidden: { summary: "no permission", value: { success: false, message: "you don't have permission" } },
                                alreadyProcessed: { summary: "already processed", value: { success: false, message: "this request has already been processed" } }
                            }
                        }
                    }
                },
                404: { $ref: "#/components/responses/RequestNotFound" },
                429: { $ref: "#/components/responses/TooManyAdminRequests" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/admin/requests/{id}/reject": {
        patch: {
            description: "Reject a pending role-change request (admin only)",
            summary: "Reject a role request",
            tags: ["Users", "Admin", "Requests"],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" }, example: "6857e4d1e5d82d0d1f5d8c40" }
            ],
            responses: {
                200: {
                    description: "request rejected successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "request rejected successfully" }
                        }
                    }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: {
                    description: "no permission OR request already processed",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            examples: {
                                forbidden: { summary: "no permission", value: { success: false, message: "you don't have permission" } },
                                alreadyProcessed: { summary: "already processed", value: { success: false, message: "this request has already been processed" } }
                            }
                        }
                    }
                },
                404: { $ref: "#/components/responses/RequestNotFound" },
                429: { $ref: "#/components/responses/TooManyAdminRequests" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/admin/{id}": {
        get: {
            description: "Get any user's profile by id (admin only)",
            summary: "Get user by id",
            tags: ["Users", "Admin"],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" }, example: "6857e4d1e5d82d0d1f5d8c32" }
            ],
            responses: {
                200: {
                    description: "user fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "user fetched successfully" },
                                    data: { $ref: "#/components/schemas/User" }
                                }
                            }
                        }
                    }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/Forbidden" },
                404: { $ref: "#/components/responses/UserNotFound" },
                429: { $ref: "#/components/responses/TooManyAdminRequests" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        },
        delete: {
            description: "Soft-delete any user's account by id (admin only)",
            summary: "Delete user by id",
            tags: ["Users", "Admin"],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" }, example: "6857e4d1e5d82d0d1f5d8c32" }
            ],
            responses: {
                200: {
                    description: "user deleted successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "user deleted successfully" }
                        }
                    }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/Forbidden" },
                404: { $ref: "#/components/responses/UserNotFound" },
                429: { $ref: "#/components/responses/TooManyRequestsGeneric" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/admin/{id}/ban": {
        patch: {
            description: "Ban a user for a number of days, or permanently if banDays is omitted (admin only, cannot ban another admin)",
            summary: "Ban a user",
            tags: ["Users", "Admin"],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" }, example: "6857e4d1e5d82d0d1f5d8c32" }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/BanUser" },
                        example: { banDays: 7, banReason: "Spam" }
                    }
                }
            },
            responses: {
                200: {
                    description: "user banned successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "user banned successfully" }
                        }
                    }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: {
                    description: "no permission OR cannot ban an admin",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            examples: {
                                forbidden: { summary: "no permission", value: { success: false, message: "you don't have permission" } },
                                cannotBanAdmin: { summary: "cannot ban admin", value: { success: false, message: "you can't ban an admin" } }
                            }
                        }
                    }
                },
                404: { $ref: "#/components/responses/UserNotFound" },
                422: { $ref: "#/components/responses/InvalidBanDays" },
                429: { $ref: "#/components/responses/TooManyRequestsGeneric" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/admin/{id}/unban": {
        patch: {
            description: "Remove a ban from a user (admin only)",
            summary: "Unban a user",
            tags: ["Users", "Admin"],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" }, example: "6857e4d1e5d82d0d1f5d8c32" }
            ],
            responses: {
                200: {
                    description: "user unbanned successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "user unbanned successfully" }
                        }
                    }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/Forbidden" },
                404: { $ref: "#/components/responses/UserNotFound" },
                409: { $ref: "#/components/responses/UserNotBanned" },
                429: { $ref: "#/components/responses/TooManyRequestsGeneric" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/admin/{id}/change-role": {
        patch: {
            description: "Change a user's role directly (admin only, cannot change another admin's role)",
            summary: "Change user role",
            tags: ["Users", "Admin"],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" }, example: "6857e4d1e5d82d0d1f5d8c32" }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/ChangeUserRole" },
                        example: { newRole: "teacher" }
                    }
                }
            },
            responses: {
                201: {
                    description: "role changed successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: {
                                success: true,
                                message: "user \"amir: amir@gmail.com\" role changed to \"teacher\" successfully"
                            }
                        }
                    }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: {
                    description: "no permission OR cannot change another admin's role",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            examples: {
                                forbidden: { summary: "no permission", value: { success: false, message: "you don't have permission" } },
                                cannotChangeAdmin: { summary: "cannot change admin role", value: { success: false, message: "you can't change another admin role" } }
                            }
                        }
                    }
                },
                404: { $ref: "#/components/responses/UserNotFound" },
                422: { $ref: "#/components/responses/InvalidRole" },
                429: { $ref: "#/components/responses/TooManyRequestsGeneric" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    }
}