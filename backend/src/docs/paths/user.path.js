module.exports = {
    "/users/auth/signup": {
        post: {
            tags: ["Auth"],
            operationId: "signUp",
            summary: "Sign up",
            description: "Creates a user with role=user, returns a 5-minute access token, and sets refreshToken + deviceId cookies. JSON is supported when no avatar is needed. For avatar upload use multipart/form-data(avatar); with the current validator, rememberMe must be omitted from multipart and therefore defaults to false. Browser clients making cross-origin requests must include credentials for cookies to be stored. `refreshToken` is scoped to `/users/refresh-token`; `deviceId` is scoped to `/users`, so both cookies are available to the refresh flow.",
            security: [],

            requestBody: {
                required: true,

                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/UserSignUpJson"
                        }
                    },

                    "multipart/form-data": {
                        schema: {
                            $ref: "#/components/schemas/UserSignUpMultipart"
                        }
                    }
                }
            },

            responses: {
                201: {
                    description: "User signed up successfully",

                    headers: {
                        "Set-Cookie": {
                            description: "Two Set-Cookie headers are sent: refreshToken (httpOnly, SameSite=Strict, path=/users/refresh-token, 15 days when rememberMe=true otherwise 1 day) and deviceId (httpOnly, SameSite=Lax, path=/users, 1 year). Secure is enabled in production.",
                            schema: {
                                type: "string"
                            }
                        }
                    },

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/AuthSuccess"
                            },

                            example: {
                                success: true,
                                message: "user signed up successfully",
                                accessToken: "eyJhbGciOiJIUzI1NiIs..."
                            }
                        }
                    }
                },

                400: {
                    $ref: "#/components/responses/FailedValidation"
                },

                409: {
                    $ref: "#/components/responses/EmailAlreadyExists"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrLogin"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/users/auth/login": {
        post: {
            tags: ["Auth"],
            operationId: "login",
            summary: "Log in",
            description: "Validates email/password, rejects a soft-deleted account only after the credentials match, updates lastLogin, returns a 5-minute access token, and sets refreshToken + deviceId cookies. An existing deviceId cookie is reused. `refreshToken` is scoped to `/users/refresh-token`; `deviceId` is scoped to `/users`. Browser clients making cross-origin requests must include credentials.",
            security: [],

            requestBody: {
                required: true,

                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/UserLogin"
                        }
                    }
                }
            },

            responses: {
                200: {
                    description: "Login successful",

                    headers: {
                        "Set-Cookie": {
                            description: "refreshToken is httpOnly, SameSite=Strict, path=/users/refresh-token, and lasts 15 days when rememberMe=true otherwise 1 day. deviceId is httpOnly, SameSite=Lax, path=/users, lasts 1 year, and is reused if already present. Secure is enabled in production.",
                            schema: {
                                type: "string"
                            }
                        }
                    },

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/AuthSuccess"
                            },

                            example: {
                                success: true,
                                message: "login successful",
                                accessToken: "eyJhbGciOiJIUzI1NiIs..."
                            }
                        }
                    }
                },

                400: {
                    $ref: "#/components/responses/FailedValidation"
                },

                401: {
                    $ref: "#/components/responses/WrongCredentials"
                },

                404: {
                    $ref: "#/components/responses/UserDeleted"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrLogin"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/users/auth/logout": {
        post: {
            tags: ["Auth"],
            operationId: "logOut",
            summary: "Log out the current device",
            description: "Requires a valid access token and the deviceId cookie. All refresh-token records for the current user/device are marked revoked and the refreshToken cookie is cleared. The deviceId cookie is not cleared, and the frontend should remove its access token after success.",

            security: [
                {
                    bearerAuth: [],
                    deviceIdCookie: []
                }
            ],

            responses: {
                200: {
                    description: "Logged out successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Success"
                            },

                            example: {
                                success: true,
                                message: "user logged out successfully, please remove access token"
                            }
                        }
                    }
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/NotLoggedIn"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobal"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/users/refresh-token": {
        post: {
            tags: ["Auth"],
            operationId: "refreshToken",
            summary: "Refresh the access token",
            description: "Requires refreshToken + deviceId cookies. The backend verifies the JWT, checks the latest token for this user/device, compares the supplied token with the stored bcrypt hash, revokes the previous token, and issues a new access/refresh-token pair. The implementation is sequential, not an atomic database transaction. Send at least `{}` as the JSON body so the Zod object validator can apply rememberMe=false. `refreshToken` is scoped to this route and `deviceId` is scoped to `/users`, so browser clients can send both when credentials are enabled for cross-origin requests.",
            security: [
                {
                    refreshTokenCookie: [],
                    deviceIdCookie: []
                }
            ],

            requestBody: {
                required: true,

                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/RefreshTokenBody"
                        }
                    }
                }
            },

            responses: {
                200: {
                    description: "Token refreshed successfully",

                    headers: {
                        "Set-Cookie": {
                            description: "Replaces refreshToken with a new httpOnly, SameSite=Strict cookie scoped to /users/refresh-token. Max-Age is 15 days when rememberMe=true otherwise 1 day. deviceId is not reissued.",
                            schema: {
                                type: "string"
                            }
                        }
                    },

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/AuthSuccess"
                            },

                            example: {
                                success: true,
                                message: "token refreshed successfully",
                                accessToken: "eyJhbGciOiJIUzI1NiIs..."
                            }
                        }
                    }
                },

                400: {
                    $ref: "#/components/responses/FailedValidation"
                },

                401: {
                    $ref: "#/components/responses/FakedRefreshToken"
                },

                403: {
                    $ref: "#/components/responses/RefreshTokenForbidden"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobal"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/users/me": {
        get: {
            tags: ["Users"],
            operationId: "getUserProfile",
            summary: "Get the current user's profile",
            description: "Returns the user document without password. bannedBy is populated with _id/username/email. The response also contains signUpDate and lastLogin in meta.",

            security: [
                {
                    bearerAuth: []
                }
            ],

            responses: {
                200: {
                    description: "User fetched successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/GetUserProfile"
                            }
                        }
                    }
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                404: {
                    $ref: "#/components/responses/UserNotFound"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobal"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        },

        patch: {
            tags: ["Users"],
            operationId: "updateUserProfile",
            summary: "Update the current user's profile",
            description: "Requires a valid access token and passes through the ban check. JSON can update username/email. multipart/form-data can also replace the avatar using field name `newAvatar`. If email changes, it must be globally unique. A body object is required by the current validator, although all individual fields are optional.",

            security: [
                {
                    bearerAuth: []
                }
            ],

            requestBody: {
                required: true,

                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/UpdateUserJson"
                        }
                    },

                    "multipart/form-data": {
                        schema: {
                            $ref: "#/components/schemas/UpdateUserMultipart"
                        }
                    }
                }
            },

            responses: {
                200: {
                    description: "User updated successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Success"
                            },

                            example: {
                                success: true,
                                message: "user updated successfully"
                            }
                        }
                    }
                },

                400: {
                    $ref: "#/components/responses/FailedValidation"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/UserBanned"
                },

                404: {
                    $ref: "#/components/responses/UserNotFound"
                },

                409: {
                    $ref: "#/components/responses/EmailAlreadyExists"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobal"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        },

        delete: {
            tags: ["Users"],
            operationId: "deleteUserProfile",
            summary: "Soft-delete the current user's account",
            description: "Requires a valid access token and passes through the ban check. Sets isDeleted/deletedBy/deletedAt, deletes all stored refresh tokens, resets/deletes the custom avatar, and clears both the refreshToken and deviceId cookies. Admin accounts cannot be deleted and return 404. The already-issued access token itself is not revoked server-side, so the frontend should still discard it after success.",

            security: [
                {
                    bearerAuth: []
                }
            ],

            responses: {
                200: {
                    description: "User deleted successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Success"
                            },

                            example: {
                                success: true,
                                message: "user deleted successfully"
                            }
                        }
                    }
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/UserBanned"
                },

                404: {
                    $ref: "#/components/responses/UserNotFoundOrWasAdmin"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobal"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/users/me/delete-avatar": {
        delete: {
            tags: ["Users"],
            operationId: "deleteUserAvatar",
            summary: "Delete the current user's custom avatar",
            description: "Requires a valid access token and passes through the ban check. If a custom Cloudinary avatar exists it is deleted, then avatar is reset to `/images/default-avatar.png` with publicId=null. Calling this while already using the default avatar still returns success.",

            security: [
                {
                    bearerAuth: []
                }
            ],

            responses: {
                200: {
                    description: "Avatar deleted successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Success"
                            },

                            example: {
                                success: true,
                                message: "avatar deleted successfully"
                            }
                        }
                    }
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/UserBanned"
                },

                404: {
                    $ref: "#/components/responses/UserNotFound"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobal"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/users/me/get-courses": {
        get: {
            tags: ["Users"],
            operationId: "getUserCourses",
            summary: "List the current user's enrolled courses",
            description: "Reads only active Enrollment documents for the authenticated user (`status=active`), sorts by Enrollment.createdAt, and returns only course _id/title/slug/price/discountPercentage. Cancelled enrollments are excluded. Empty results are returned as the literal string `no course found`, not an empty array.",

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    $ref: "#/components/parameters/PageParameter"
                },

                {
                    $ref: "#/components/parameters/LimitParameter"
                },

                {
                    $ref: "#/components/parameters/CreatedAtSortByParameter"
                },

                {
                    $ref: "#/components/parameters/SortOrderParameter"
                }
            ],

            responses: {
                200: {
                    description: "Courses fetched successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/UserCoursesListResponse"
                            }
                        }
                    }
                },

                400: {
                    $ref: "#/components/responses/FailedValidation"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobal"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/users/me/get-comments": {
        get: {
            tags: ["Users", "Comments"],
            operationId: "getUserComments",
            summary: "List the current user's comments",
            description: "Returns comments whose authorId is the authenticated user. Optional rating filtering is exact and case-sensitive. Empty results are returned as the literal string `you don't have any comment`, not an empty array.",

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    $ref: "#/components/parameters/PageParameter"
                },

                {
                    $ref: "#/components/parameters/LimitParameter"
                },

                {
                    $ref: "#/components/parameters/CommentRatingFilterParameter"
                },

                {
                    $ref: "#/components/parameters/CommentSortByParameter"
                },

                {
                    $ref: "#/components/parameters/SortOrderParameter"
                }
            ],

            responses: {
                200: {
                    description: "Comments fetched successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/UserCommentsListResponse"
                            }
                        }
                    }
                },

                400: {
                    $ref: "#/components/responses/FailedValidation"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobal"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/users/me/dashboard": {
        get: {
            tags: ["Users"],
            operationId: "getUserDashboard",
            summary: "Get the current user's dashboard summary",
            description: "Returns selected profile fields, enrollment/comment/pending-role-request counts, accountStatus, and whether at least one pending role request exists.",

            security: [
                {
                    bearerAuth: []
                }
            ],

            responses: {
                200: {
                    description: "Dashboard fetched successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/UserDashboardResponse"
                            }
                        }
                    }
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                404: {
                    $ref: "#/components/responses/UserNotFound"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobal"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/users/change-password": {
        patch: {
            tags: ["Users"],
            operationId: "changeUserPassword",
            summary: "Change the current user's password",
            description: "Revokes refresh tokens for all devices, hashes/saves the new password, and clears the current refreshToken cookie. The deviceId cookie is not cleared and the current access token is not revoked server-side; the frontend should remove the access token and log in again.",

            security: [
                {
                    bearerAuth: []
                }
            ],

            requestBody: {
                required: true,

                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ChangePassword"
                        }
                    }
                }
            },

            responses: {
                200: {
                    description: "Password changed successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Success"
                            },

                            example: {
                                success: true,
                                message: "password changed successfully, please Login again"
                            }
                        }
                    }
                },

                400: {
                    $ref: "#/components/responses/FailedValidation"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/UserBanned"
                },

                404: {
                    $ref: "#/components/responses/UserNotFound"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobal"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/users/request-role": {
        post: {
            tags: ["Users"],
            operationId: "requestNewRole",
            summary: "Request a role change",
            description: "Requests a role change to user, teacher, or admin. Requesting the same role as the current access-token role returns 409. A partial unique MongoDB index on `{ userId, status }` for `status=pending` enforces at most one pending role request per user, including concurrent submissions; duplicate-key creation is translated to the documented 403 pending-request error. After creation, the service retains the pending request plus at most two previously processed requests.",
            security: [
                {
                    bearerAuth: []
                }
            ],

            requestBody: {
                required: true,

                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/UserRoleChangeBody"
                        }
                    }
                }
            },

            responses: {
                200: {
                    description: "Request sent successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Success"
                            },

                            example: {
                                success: true,
                                message: "request sent successfully"
                            }
                        }
                    }
                },

                400: {
                    $ref: "#/components/responses/FailedValidation"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/RequestRoleForbidden"
                },

                404: {
                    $ref: "#/components/responses/UserNotFound"
                },

                409: {
                    $ref: "#/components/responses/AlreadyHasRole"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrRequestRole"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/users/admin/requests/get-pending": {
        get: {
            tags: ["Users", "Admins"],
            operationId: "getPendingRequests",
            summary: "List pending role-change requests",
            description: "Admin only. Query validation runs before authentication. Returns raw userId/processedBy ObjectIds rather than populated user objects. Empty results use the literal string `no request found`.",

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    $ref: "#/components/parameters/PageParameter"
                },

                {
                    $ref: "#/components/parameters/LimitParameter"
                },

                {
                    $ref: "#/components/parameters/CreatedAtSortByParameter"
                },

                {
                    $ref: "#/components/parameters/SortOrderParameter"
                }
            ],

            responses: {
                200: {
                    description: "Requests fetched successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/RequestsListResponse"
                            }
                        }
                    }
                },

                400: {
                    $ref: "#/components/responses/FailedValidation"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/Forbidden"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrAdmin"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/users/admin/requests/get-all": {
        get: {
            tags: ["Users", "Admins"],
            operationId: "getAllRequests",
            summary: "List all role-change requests",
            description: "Admin only. Supports status/requestedRole filters plus pagination/sorting. Query validation runs before authentication. Empty results use the literal string `no request found`.",

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    $ref: "#/components/parameters/PageParameter"
                },

                {
                    $ref: "#/components/parameters/LimitParameter"
                },

                {
                    $ref: "#/components/parameters/RequestStatusFilterParameter"
                },

                {
                    $ref: "#/components/parameters/RequestedRoleFilterParameter"
                },

                {
                    $ref: "#/components/parameters/CreatedAtSortByParameter"
                },

                {
                    $ref: "#/components/parameters/SortOrderParameter"
                }
            ],

            responses: {
                200: {
                    description: "Requests fetched successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/RequestsListResponse"
                            }
                        }
                    }
                },

                400: {
                    $ref: "#/components/responses/FailedValidation"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/Forbidden"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrAdmin"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/users/admin/requests/{id}": {
        get: {
            tags: ["Users", "Admins"],
            operationId: "getRequestById",
            summary: "Get a role-change request by id",
            description: "Admin only. Unlike the list endpoints, userId and processedBy are populated with _id/username/email. processedBy remains null for an unprocessed request.",

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    $ref: "#/components/parameters/IdParameter"
                }
            ],

            responses: {
                200: {
                    description: "Request fetched successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/RequestByIdResponse"
                            }
                        }
                    }
                },

                400: {
                    $ref: "#/components/responses/InvalidId"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/Forbidden"
                },

                404: {
                    $ref: "#/components/responses/RequestNotFound"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrAdmin"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/users/admin/requests/{id}/accept": {
        patch: {
            tags: ["Users", "Admins"],
            operationId: "acceptRequest",
            summary: "Accept a pending role-change request",
            description: "Admin only. The request must still be pending. On success it becomes accepted, processedBy/processedAt are set, and the target user's database role becomes requestedRole. Existing access tokens keep their old role claim until a new access token is issued (for example through refresh/login).",

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    $ref: "#/components/parameters/IdParameter"
                }
            ],

            responses: {
                200: {
                    description: "Request accepted successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Success"
                            },

                            example: {
                                success: true,
                                message: "request accepted successfully"
                            }
                        }
                    }
                },

                400: {
                    $ref: "#/components/responses/InvalidId"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/ProcessRequestForbidden"
                },

                404: {
                    $ref: "#/components/responses/RequestOrUserNotFound"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrAdmin"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/users/admin/requests/{id}/reject": {
        patch: {
            tags: ["Users", "Admins"],
            operationId: "rejectRequest",
            summary: "Reject a pending role-change request",
            description: "Admin only. Rejection is performed atomically with `findOneAndUpdate` and only matches a request whose status is currently `pending`. On success, the request status becomes `rejected` and `processedBy`/`processedAt` are recorded; the user's role is not changed. If no pending request with the given id exists, including a request that has already been processed, the endpoint returns 403 with `no pending request found`.",

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    $ref: "#/components/parameters/IdParameter"
                }
            ],

            responses: {
                200: {
                    description: "Request rejected successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Success"
                            },

                            example: {
                                success: true,
                                message: "request rejected successfully"
                            }
                        }
                    }
                },

                400: {
                    $ref: "#/components/responses/InvalidId"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/RejectRequestForbidden"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrAdmin"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/users/admin/{id}": {
        get: {
            tags: ["Users", "Admins"],
            operationId: "getUserById",
            summary: "Get a user by id",
            description: "Admin only. Returns the same User data shape as GET /users/me but without the profile meta block.",

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    $ref: "#/components/parameters/IdParameter"
                }
            ],

            responses: {
                200: {
                    description: "User fetched successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/GetUserById"
                            }
                        }
                    }
                },

                400: {
                    $ref: "#/components/responses/InvalidId"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/Forbidden"
                },

                404: {
                    $ref: "#/components/responses/UserNotFound"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrAdmin"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        },

        delete: {
            tags: ["Users", "Admins"],
            operationId: "deleteUserById",
            summary: "Soft-delete a user by id",
            description: "Admin only. Sets soft-delete fields, deletes the target user's stored refresh tokens, and resets/deletes the target avatar. Targets with role=admin cannot be deleted and return the same 404 used for not-found/already-deleted users.",

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    $ref: "#/components/parameters/IdParameter"
                }
            ],

            responses: {
                200: {
                    description: "User deleted successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Success"
                            },

                            example: {
                                success: true,
                                message: "user deleted successfully"
                            }
                        }
                    }
                },

                400: {
                    $ref: "#/components/responses/InvalidId"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/Forbidden"
                },

                404: {
                    $ref: "#/components/responses/UserNotFoundOrWasAdmin"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrAdminChange"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/users/admin/{id}/ban": {
        patch: {
            tags: ["Users", "Admins"],
            operationId: "banUser",
            summary: "Ban a user",
            description: "Admin only. The JSON object must be sent, but `{}` is valid and creates a permanent ban with banReason=null. banDays=0 means permanent; a positive value sets banExpiresAt. A target admin cannot be banned.",

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    $ref: "#/components/parameters/IdParameter"
                }
            ],

            requestBody: {
                required: true,

                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/BanUser"
                        }
                    }
                }
            },

            responses: {
                200: {
                    description: "User banned successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Success"
                            },

                            example: {
                                success: true,
                                message: "user banned successfully"
                            }
                        }
                    }
                },

                400: {
                    $ref: "#/components/responses/InvalidIdOrValidationFailed"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/BanUserForbidden"
                },

                404: {
                    $ref: "#/components/responses/UserNotFound"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrAdminChange"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/users/admin/{id}/unban": {
        patch: {
            tags: ["Users", "Admins"],
            operationId: "unBanUser",
            summary: "Unban a user",
            description: "Admin only. Clears isBanned, banReason, banExpiresAt, and bannedBy. If the target is not currently banned the backend returns 409 with the exact message `this user is not ban`.",

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    $ref: "#/components/parameters/IdParameter"
                }
            ],

            responses: {
                200: {
                    description: "User unbanned successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Success"
                            },

                            example: {
                                success: true,
                                message: "user unbanned successfully"
                            }
                        }
                    }
                },

                400: {
                    $ref: "#/components/responses/InvalidId"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/Forbidden"
                },

                404: {
                    $ref: "#/components/responses/UserNotFound"
                },

                409: {
                    $ref: "#/components/responses/UserNotBanned"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrAdminChange"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/users/admin/{id}/change-role": {
        patch: {
            tags: ["Users", "Admins"],
            operationId: "changeUserRole",
            summary: "Change a user's role",
            description: "Admin only. newRole may be user/teacher/admin, but a target that is already an admin cannot be changed through this endpoint. Existing access tokens keep their previous role claim until the user obtains a new access token.",

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    $ref: "#/components/parameters/IdParameter"
                }
            ],

            requestBody: {
                required: true,

                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/UserRoleChangeBody"
                        }
                    }
                }
            },

            responses: {
                200: {
                    description: "Role changed successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Success"
                            },

                            example: {
                                success: true,
                                message: "user amir: amir@gmail.com role changed to teacher successfully"
                            }
                        }
                    }
                },

                400: {
                    $ref: "#/components/responses/InvalidIdOrValidationFailed"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/ChangeRoleForbidden"
                },

                404: {
                    $ref: "#/components/responses/UserNotFound"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrAdminChange"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    }
}