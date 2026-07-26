module.exports = {
    User: {
        type: "object",
        properties: {
            _id: {
                type: "string",
                readOnly: true,
                example: "6857e4d1e5d82d0d1f5d8c32"
            },

            username: {
                type: "string",
                example: "amir"
            },

            email: {
                type: "string",
                format: "email",
                example: "amir@gmail.com"
            },

            password: {
                type: "string",
                writeOnly: true,
                example: "StrongPassword123"
            },

            role: {
                type: "string",
                enum: ["user", "admin", "teacher"],
                example: "user"
            },

            avatar: {
                type: "object",
                properties: {
                    url: { type: "string", example: "https://res.cloudinary.com/.../avatars/xyz.jpg" },
                    publicId: { type: "string", nullable: true, example: "sabzlearn/avatars/xyz" }
                }
            },

            isBanned: {
                type: "boolean",
                example: false
            },

            banReason: {
                type: "string",
                nullable: true,
                example: "Spam"
            },

            bannedBy: {
                type: "string",
                nullable: true,
                example: "6857e4d1e5d82d0d1f5d8c32"
            },

            banExpiresAt: {
                type: "string",
                format: "date-time",
                nullable: true,
                description: "null means either the user isn't banned, or the ban is permanent",
                example: "2026-08-01T12:00:00.000Z"
            },

            isDeleted: {
                type: "boolean",
                example: true
            },

            deletedBy: {
                type: "string",
                nullable: true,
                example: "6857e4d1e5d82d0d1f5d8c32"
            },

            deletedAt: {
                type: "string",
                format: "date-time",
                nullable: true,
                example: "2026-07-09T12:00:00.000Z"
            },

            lastLogin: {
                type: "string",
                format: "date-time",
                example: "2026-07-09T18:30:00.000Z"
            },

            createdAt: {
                type: "string",
                format: "date-time",
                readOnly: true,
                example: "2026-06-01T10:15:30.000Z"
            },

            updatedAt: {
                type: "string",
                format: "date-time",
                readOnly: true,
                example: "2026-07-09T18:30:00.000Z"
            }
        },

        required: [
            "username",
            "email",
            "role",
            "isBanned",
            "isDeleted",
            "lastLogin"
        ]
    },
    GetUserProfile: {
        type: "object",
        description: "GET /users/me — includes the extra `meta` block (only present on this endpoint, not on the admin get-by-id one)",
        properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "user fetched successfully" },
            data: { $ref: "#/components/schemas/User" },
            meta: {
                type: "object",
                properties: {
                    signUpDate: { type: "string", format: "date-time", example: "2026-06-01T10:15:30.000Z" },
                    lastLogin: { type: "string", format: "date-time", example: "2026-07-09T18:30:00.000Z" }
                }
            }
        },
        required: ["success", "message", "data"]
    },
    GetUserById: {
        type: "object",
        description: "GET /users/admin/{id} — admin fetching any user; no `meta` block here, unlike GET /users/me",
        properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "user fetched successfully" },
            data: { $ref: "#/components/schemas/User" }
        },
        required: ["success", "message", "data"]
    },
    AuthSuccess: {
        type: "object",
        properties: {
            success: {
                type: "boolean",
                example: true
            },
            message: {
                type: "string",
                example: "login successful"
            },
            accessToken: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNTIzNjg2ZTUxMGE3M2ZlNDgyNGM3MCIsInJvbGUiOiJ1c2VyIiwiaXNCYW5uZWQiOmZhbHNlLCJiYW5FeHBpcmVzQXQiOm51bGwsImlhdCI6MTc4Mzc3MjgwNywiZXhwIjoxNzgzNzczMTA3fQ.hBYqg7qbmQqrRzrTUrusEJFtiuNswvDg7kzMbECul-k"
            }
        },
        required: [
            "success",
            "message",
            "accessToken"
        ]
    },
    UserSignUp: {
        type: "object",
        description: "Kept for reference. The actual signup endpoint requires multipart/form-data — see UserSignUpMultipart.",
        properties: {
            username: { type: "string", minLength: 3, maxLength: 30, example: "amir" },
            email: { type: "string", format: "email", minLength: 5, maxLength: 50, example: "amir@gmail.com" },
            password: { type: "string", minLength: 5, maxLength: 70, example: "StrongPassword123" },
            rememberMe: { type: "boolean", default: false, example: false }
        },
        required: ["username", "email", "password"]
    },
    UserSignUpMultipart: {
        type: "object",
        description: "multipart/form-data body. Field name for the file must be exactly `avatar`.",
        properties: {
            username: { type: "string", minLength: 3, maxLength: 30, example: "amir" },
            email: { type: "string", format: "email", minLength: 5, maxLength: 50, example: "amir@gmail.com" },
            password: { type: "string", minLength: 5, maxLength: 70, example: "StrongPassword123" },
            rememberMe: { type: "boolean", default: false, example: false },
            avatar: {
                type: "string",
                format: "binary",
                description: "Optional. jpeg/png/webp only, max 2MB. If the upload fails, signup still succeeds with the default avatar."
            }
        },
        required: ["username", "email", "password"]
    },
    UserLogin: {
        type: "object",
        properties: {
            email: { type: "string", format: "email", minLength: 5, maxLength: 50, example: "amir@gmail.com" },
            password: { type: "string", minLength: 5, maxLength: 70, example: "StrongPassword123" },
            rememberMe: { type: "boolean", default: false, example: false }
        },
        required: ["email", "password"]
    },
    UpdateUser: {
        type: "object",
        description: "Kept for reference. The actual update-profile endpoint requires multipart/form-data — see UpdateUserMultipart.",
        properties: {
            username: { type: "string", minLength: 3, maxLength: 30, example: "amir_new" },
            email: { type: "string", format: "email", minLength: 5, maxLength: 50, example: "new-amir@gmail.com" }
        }
    },
    UpdateUserMultipart: {
        type: "object",
        description: "multipart/form-data body. All fields optional. Field name for the file must be exactly `newAvatar`.",
        properties: {
            username: { type: "string", minLength: 3, maxLength: 30, example: "amir_new" },
            email: { type: "string", format: "email", minLength: 5, maxLength: 50, example: "new-amir@gmail.com" },
            newAvatar: {
                type: "string",
                format: "binary",
                description: "Optional. jpeg/png/webp only, max 2MB. Replaces (and deletes from storage) the previous avatar."
            }
        }
    },
    ChangePassword: {
        type: "object",
        properties: {
            password: { type: "string", minLength: 5, maxLength: 70, example: "NewStrongPassword123" }
        },
        required: ["password"]
    },
    RequestRole: {
        type: "object",
        description: "A user can only request to become a teacher or admin (never back to plain user through this flow)",
        properties: {
            newRole: { type: "string", enum: ["user", "teacher", "admin"], example: "teacher" }
        },
        required: ["newRole"]
    },
    ChangeUserRole: {
        type: "object",
        properties: {
            newRole: { type: "string", enum: ["user", "teacher", "admin"], example: "teacher" }
        },
        required: ["newRole"]
    },
    BanUser: {
        type: "object",
        properties: {
            banDays: {
                type: "number",
                minimum: 0,
                default: 0,
                description: "0 or omitted means a permanent ban",
                example: 7
            },
            banReason: {
                type: "string",
                maxLength: 200,
                nullable: true,
                default: null,
                example: "Spam"
            }
        }
    },
    RefreshTokenBody: {
        type: "object",
        properties: {
            rememberMe: { type: "boolean", default: false, example: false }
        }
    },
    Request: {
        type: "object",
        properties: {
            _id: { type: "string", example: "6857e4d1e5d82d0d1f5d8c40" },
            userId: { type: "string", example: "6857e4d1e5d82d0d1f5d8c32" },
            processedBy: { type: "string", nullable: true, example: null },
            processedAt: { type: "string", format: "date-time", nullable: true, example: null },
            requestedRole: { type: "string", enum: ["teacher", "admin"], example: "teacher" },
            currentRole: { type: "string", enum: ["user", "teacher", "admin"], example: "user" },
            status: { type: "string", enum: ["pending", "accepted", "rejected"], example: "pending" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
        }
    },
    RequestPopulated: {
        description: "Request with userId and processedBy populated with username/email",
        allOf: [
            { $ref: "#/components/schemas/Request" },
            {
                type: "object",
                properties: {
                    userId: { $ref: "#/components/schemas/PopulatedUserRef" },
                    processedBy: { $ref: "#/components/schemas/PopulatedUserRef" }
                }
            }
        ]
    },
    UserDashboard: {
        type: "object",
        properties: {
            user: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    username: { type: "string" },
                    email: { type: "string" },
                    role: { type: "string" },
                    isBanned: { type: "boolean" },
                    lastLogin: { type: "string", format: "date-time" },
                    memberSince: { type: "string", format: "date-time" }
                }
            },
            stats: {
                type: "object",
                properties: {
                    enrolledCourses: { type: "number", example: 4 },
                    commentsCount: { type: "number", example: 12 },
                    pendingRequests: { type: "number", example: 0 }
                }
            },
            overview: {
                type: "object",
                properties: {
                    accountStatus: { type: "string", enum: ["active", "banned"] },
                    hasPendingRoleRequest: { type: "boolean" }
                }
            }
        }
    },
    UserCourse: {
        type: "object",
        properties: {
            _id: { type: "string" },
            title: { type: "string", example: "React from zero to hero" },
            slug: { type: "string", example: "react-from-zero-to-hero" },
            price: { type: "number", example: 250000 },
            discountPrecentage: { type: "number", example: 20 }
        }
    },
    UserCoursesListResponse: {
        type: "object",
        properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "courses fetched successfully" },
            data: {
                oneOf: [
                    { type: "array", items: { $ref: "#/components/schemas/UserCourse" } },
                    { type: "string", example: "no course found" }
                ],
                description: "An array of enrolled courses, or the literal string \"no course found\" when the user has none"
            },
            meta: { $ref: "#/components/schemas/PaginationMeta" }
        },
        required: ["success", "message", "data", "meta"]
    },
    UserCommentsListResponse: {
        type: "object",
        properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "comments fetched successfully" },
            data: {
                oneOf: [
                    { type: "array", items: { $ref: "#/components/schemas/Comment" } },
                    { type: "string", example: "you don't have any comment" }
                ],
                description: "An array of the user's comments, or the literal string \"you don't have any comment\" when there are none"
            },
            meta: { $ref: "#/components/schemas/PaginationMeta" }
        },
        required: ["success", "message", "data", "meta"]
    },
    RequestsListResponse: {
        type: "object",
        description: "Shared shape for both GET /admin/requests/get-pending and GET /admin/requests/get-all",
        properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "requests fetched successfully" },
            data: {
                oneOf: [
                    { type: "array", items: { $ref: "#/components/schemas/Request" } },
                    { type: "string", example: "no request found" }
                ],
                description: "An array of requests, or the literal string \"no request found\" when there are none"
            },
            meta: { $ref: "#/components/schemas/PaginationMeta" }
        },
        required: ["success", "message", "data", "meta"]
    },
    RequestByIdResponse: {
        type: "object",
        properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "request fetched successfully" },
            data: { $ref: "#/components/schemas/RequestPopulated" }
        },
        required: ["success", "message", "data"]
    },
    UserDashboardResponse: {
        type: "object",
        properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "dashboard fetched successfully" },
            data: { $ref: "#/components/schemas/UserDashboard" }
        },
        required: ["success", "message", "data"]
    },
    UserDeletedError: {
        type: "object",
        description: "Returned on login when the account has been soft-deleted",
        properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "user deleted" },
            details: {
                type: "object",
                properties: {
                    deletedBy: { $ref: "#/components/schemas/PopulatedUserRef" },
                    deletedAt: { type: "string", format: "date-time", example: "2026-07-01T10:00:00.000Z" }
                }
            }
        },
        required: ["success", "message"]
    }
}