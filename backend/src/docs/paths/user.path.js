module.exports = {
    "/users/auth/signup": {
        post: {
            tags: ["Auth"],
            operationId: "signUp",
            summary: "Sign up",
            description: "Creates a new user (role: user), issues an access token, and sets refreshToken + deviceId cookies. If an avatar is uploaded but fails to process, signup still succeeds with the default avatar (the failure is only logged server-side).",
            security: [],
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: { $ref: "#/components/schemas/UserSignUpMultipart" }
                    }
                }
            },
            responses: {
                201: {
                    description: "User created successfully",
                    headers: {
                        "Set-Cookie": {
                            description: "Sets `refreshToken` (httpOnly, path=/users/refresh-token, 15 days if rememberMe else 1 day) and `deviceId` (httpOnly, 1 year). SameSite follows COOKIE_SAME_SITE. Two Set-Cookie header lines are sent.",
                            schema: { type: "string" }
                        }
                    },
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/AuthSuccess" },
                            example: { success: true, message: "user signed up successfully", accessToken: "eyJhbGciOiJIUzI1NiIs..." }
                        }
                    }
                },
                400: { $ref: "#/components/responses/FailedValidation" },
                409: { $ref: "#/components/responses/EmailAlreadyExists" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobalOrLogin" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/auth/login": {
        post: {
            tags: ["Auth"],
            operationId: "login",
            summary: "Log in",
            description: "Issues an access token and sets refreshToken + deviceId cookies. If a deviceId cookie already exists it's reused, otherwise a new one is issued.",
            security: [],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/UserLogin" }
                    }
                }
            },
            responses: {
                200: {
                    description: "Login successful",
                    headers: {
                        "Set-Cookie": {
                            description: "Sets `refreshToken` (httpOnly, path=/users/refresh-token, 15 days if rememberMe else 1 day) and `deviceId` (httpOnly, 1 year). SameSite follows COOKIE_SAME_SITE.",
                            schema: { type: "string" }
                        }
                    },
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/AuthSuccess" },
                            example: { success: true, message: "login successful", accessToken: "eyJhbGciOiJIUzI1NiIs..." }
                        }
                    }
                },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/WrongCredentials" },
                404: { $ref: "#/components/responses/UserDeleted" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobalOrLogin" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/auth/logout": {
        post: {
            tags: ["Auth"],
            operationId: "logOut",
            summary: "Log out",
            description: "Revokes all refresh tokens for the current device and clears the refreshToken cookie. Requires the deviceId cookie set at login.",
            security: [{ bearerAuth: [], deviceIdCookie: [] }],
            responses: {
                200: {
                    description: "Logged out successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "user logged out successfully, please remove access token" }
                        }
                    }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/NotLoggedIn" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/refresh-token": {
        post: {
            tags: ["Auth"],
            operationId: "refreshToken",
            summary: "Refresh the access token",
            description: "Atomically rotates the refresh token: the old token is claimed once and a new token is issued. A reused or mismatched token is rejected with 401. Requires the refreshToken and deviceId cookies set at signup/login.",
            security: [{ refreshTokenCookie: [], deviceIdCookie: [] }],
            requestBody: {
                required: false,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/RefreshTokenBody" }
                    }
                }
            },
            responses: {
                200: {
                    description: "Token refreshed successfully",
                    headers: {
                        "Set-Cookie": {
                            description: "Sets a new `refreshToken` cookie (httpOnly, path=/users/refresh-token, 15 days if rememberMe else 1 day). deviceId is not reissued.",
                            schema: { type: "string" }
                        }
                    },
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/AuthSuccess" },
                            example: { success: true, message: "token refreshed successfully", accessToken: "eyJhbGciOiJIUzI1NiIs..." }
                        }
                    }
                },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/FakedRefreshToken" },
                403: { $ref: "#/components/responses/RefreshTokenForbidden" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/me": {
        get: {
            tags: ["Users"],
            operationId: "getUserProfile",
            summary: "Get the current user's profile",
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: "User fetched successfully",
                    content: {
                        "application/json": { schema: { $ref: "#/components/schemas/GetUserProfile" } }
                    }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        },
        patch: {
            tags: ["Users"],
            operationId: "updateUserProfile",
            summary: "Update the current user's profile",
            description: "All fields optional. If a new email is provided, it must not already belong to another user. If a new avatar is uploaded, the previous one is deleted from storage.",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: false,
                content: {
                    "multipart/form-data": {
                        schema: { $ref: "#/components/schemas/UpdateUserMultipart" }
                    }
                }
            },
            responses: {
                200: {
                    description: "User updated successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "user updated successfully" }
                        }
                    }
                },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/UserBanned" },
                409: { $ref: "#/components/responses/EmailAlreadyExists" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        },
        delete: {
            tags: ["Users"],
            operationId: "deleteUserProfile",
            summary: "Delete (soft-delete) the current user's account",
            description: "Admin accounts cannot be deleted this way — attempting to do so returns 404.",
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: "User deleted successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "user deleted successfully" }
                        }
                    }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/UserBanned" },
                404: { $ref: "#/components/responses/UserNotFoundOrWasAdmin" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/me/delete-avatar": {
        delete: {
            tags: ["Users"],
            operationId: "deleteUserAvatar",
            summary: "Delete the current user's avatar",
            description: "Removes the avatar from storage (if any) and resets it to the default avatar.",
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: "Avatar deleted successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "avatar deleted successfully" }
                        }
                    }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/UserBanned" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/me/get-courses": {
        get: {
            tags: ["Users"],
            operationId: "getUserCourses",
            summary: "List the current user's enrolled courses",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/PageParameter" },
                { $ref: "#/components/parameters/LimitParameter" },
                { $ref: "#/components/parameters/UserCourseSortByParameter" },
                { $ref: "#/components/parameters/SortOrderParameter" }
            ],
            responses: {
                200: {
                    description: "Courses fetched successfully",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/UserCoursesListResponse" } } }
                },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/Unauthorized" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/me/get-comments": {
        get: {
            tags: ["Users"],
            operationId: "getUserComments",
            summary: "List the current user's comments",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/PageParameter" },
                { $ref: "#/components/parameters/LimitParameter" },
                { $ref: "#/components/parameters/CommentRatingFilterParameter" },
                { $ref: "#/components/parameters/UserCommentSortByParameter" },
                { $ref: "#/components/parameters/SortOrderParameter" }
            ],
            responses: {
                200: {
                    description: "Comments fetched successfully",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/UserCommentsListResponse" } } }
                },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/Unauthorized" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/me/dashboard": {
        get: {
            tags: ["Users"],
            operationId: "getUserDashboard",
            summary: "Get the current user's dashboard summary",
            description: "Returns basic profile info plus aggregate stats (enrolled courses count, comments count, pending role requests count).",
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: "Dashboard fetched successfully",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/UserDashboardResponse" } } }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/change-password": {
        patch: {
            tags: ["Users"],
            operationId: "changeUserPassword",
            summary: "Change the current user's password",
            description: "Revokes every refresh token for this user (all devices) and clears the current refreshToken cookie. The user must log in again afterwards. Works even if the account is currently banned.",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": { schema: { $ref: "#/components/schemas/ChangePassword" } }
                }
            },
            responses: {
                200: {
                    description: "Password changed successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "password changed successfully, please Login again" }
                        }
                    }
                },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/Unauthorized" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/request-role": {
        post: {
            tags: ["Users"],
            operationId: "requestNewRole",
            summary: "Request a role change (to teacher or admin)",
            description: "A user may only have one pending request at a time; the oldest of up to 3 stored requests is dropped once a 4th is created.",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": { schema: { $ref: "#/components/schemas/RequestRole" } }
                }
            },
            responses: {
                200: {
                    description: "Request sent successfully",
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
                429: { $ref: "#/components/responses/TooManyRequestsGlobalOrGeneric" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/admin/requests/get-pending": {
        get: {
            tags: ["Admins"],
            operationId: "getPendingRequests",
            summary: "List pending role-change requests",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/PageParameter" },
                { $ref: "#/components/parameters/LimitParameter" },
                { $ref: "#/components/parameters/RequestSortByParameter" },
                { $ref: "#/components/parameters/SortOrderParameter" }
            ],
            responses: {
                200: {
                    description: "Requests fetched successfully",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/RequestsListResponse" } } }
                },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/Forbidden" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/admin/requests/get-all": {
        get: {
            tags: ["Admins"],
            operationId: "getAllRequests",
            summary: "List all role-change requests, with optional filters",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/PageParameter" },
                { $ref: "#/components/parameters/LimitParameter" },
                { $ref: "#/components/parameters/RequestStatusFilterParameter" },
                { $ref: "#/components/parameters/RequestedRoleFilterParameter" },
                { $ref: "#/components/parameters/RequestSortByParameter" },
                { $ref: "#/components/parameters/SortOrderParameter" }
            ],
            responses: {
                200: {
                    description: "Requests fetched successfully",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/RequestsListResponse" } } }
                },
                400: { $ref: "#/components/responses/FailedValidation" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/Forbidden" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/admin/requests/{id}": {
        get: {
            tags: ["Admins"],
            operationId: "getRequestById",
            summary: "Get a single role-change request by id",
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: "#/components/parameters/IdParameter" }],
            responses: {
                200: {
                    description: "Request fetched successfully",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/RequestByIdResponse" } } }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/Forbidden" },
                404: { $ref: "#/components/responses/RequestNotFound" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/admin/requests/{id}/accept": {
        patch: {
            tags: ["Admins"],
            operationId: "acceptRequest",
            summary: "Accept a pending role-change request",
            description: "Sets the request status to accepted and applies requestedRole to the target user.",
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: "#/components/parameters/IdParameter" }],
            responses: {
                200: {
                    description: "Request accepted successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "request accepted successfully" }
                        }
                    }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/ProcessRequestForbidden" },
                404: { $ref: "#/components/responses/RequestNotFound" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/admin/requests/{id}/reject": {
        patch: {
            tags: ["Admins"],
            operationId: "rejectRequest",
            summary: "Reject a pending role-change request",
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: "#/components/parameters/IdParameter" }],
            responses: {
                200: {
                    description: "Request rejected successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "request rejected successfully" }
                        }
                    }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/ProcessRequestForbidden" },
                404: { $ref: "#/components/responses/RequestNotFound" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/admin/{id}": {
        get: {
            tags: ["Admins"],
            operationId: "getUserById",
            summary: "Get any user by id",
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: "#/components/parameters/IdParameter" }],
            responses: {
                200: {
                    description: "User fetched successfully",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/GetUserById" } } }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/Forbidden" },
                404: { $ref: "#/components/responses/UserNotFound" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobal" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        },
        delete: {
            tags: ["Admins"],
            operationId: "deleteUserById",
            summary: "Delete (soft-delete) any user by id",
            description: "Admins cannot be deleted through this endpoint — the target's role is checked and the operation returns 404 in that case (not 403).",
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: "#/components/parameters/IdParameter" }],
            responses: {
                200: {
                    description: "User deleted successfully",
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
                404: { $ref: "#/components/responses/UserNotFoundOrWasAdmin" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobalOrGeneric" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/admin/{id}/ban": {
        patch: {
            tags: ["Admins"],
            operationId: "banUser",
            summary: "Ban a user",
            description: "Admins cannot be banned. banDays=0 or omitted means a permanent ban.",
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: "#/components/parameters/IdParameter" }],
            requestBody: {
                required: false,
                content: {
                    "application/json": { schema: { $ref: "#/components/schemas/BanUser" } }
                }
            },
            responses: {
                200: {
                    description: "User banned successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "user banned successfully" }
                        }
                    }
                },
                400: { $ref: "#/components/responses/InvalidIdOrValidationFailed" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/BanUserForbidden" },
                404: { $ref: "#/components/responses/UserNotFound" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobalOrGeneric" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/admin/{id}/unban": {
        patch: {
            tags: ["Admins"],
            operationId: "unBanUser",
            summary: "Unban a user",
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: "#/components/parameters/IdParameter" }],
            responses: {
                200: {
                    description: "User unbanned successfully",
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
                429: { $ref: "#/components/responses/TooManyRequestsGlobalOrGeneric" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/users/admin/{id}/change-role": {
        patch: {
            tags: ["Admins"],
            operationId: "changeUserRole",
            summary: "Change a user's role",
            description: "Another admin's role cannot be changed through this endpoint.",
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: "#/components/parameters/IdParameter" }],
            requestBody: {
                required: true,
                content: {
                    "application/json": { schema: { $ref: "#/components/schemas/ChangeUserRole" } }
                }
            },
            responses: {
                200: {
                    description: "Role changed successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "user amir: amir@gmail.com role changed to teacher successfully" }
                        }
                    }
                },
                400: { $ref: "#/components/responses/InvalidIdOrValidationFailed" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/ChangeRoleForbidden" },
                404: { $ref: "#/components/responses/UserNotFound" },
                429: { $ref: "#/components/responses/TooManyRequestsGlobalOrGeneric" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    }
}