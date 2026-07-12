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
        properties: {
            success: {
                type: "boolean",
                example: true
            },
            message: {
                type: "string",
                example: "user fetched successfully"
            },
            data: {
                $ref: "#/components/schemas/User"
            },
            meta: {
                type: "object",
                properties: {
                    signUpDate: {
                        type: "string",
                        format: "date-time",
                        example: "2026-08-01T12:00:00.000Z"
                    },
                    lastLogin: {
                        type: "string",
                        format: "date-time",
                        example: "2026-08-01T12:00:00.000Z"
                    }
                }
            }
        },
        required: [
            "success",
            "message",
            "data"
        ]
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
        properties: {
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
                example: "StrongPassword123",
                minlength: 8
            }
        },
        required: [
            "username",
            "email",
            "password"
        ]
    },
    UserLogin: {
        type: "object",
        properties: {
            email: {
                type: "string",
                example: "amir@gmail.com"
            },
            password: {
                type: "string",
                example: "StrongPassword123"
            }
        },
        required: [
            "email",
            "password"
        ]
    },
    UpdateUser: {
        type: "object",
        description: "Fields that can be updated on the current user's profile",
        properties: {
            username: { type: "string", minLength: 3, maxLength: 30, example: "amir_new" },
            email: { type: "string", format: "email", example: "new-amir@gmail.com" }
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
                example: 7,
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
            requestedRole: { type: "string", enum: ["user", "teacher"], example: "teacher" },
            currentRole: { type: "string", enum: ["user", "teacher", "admin"], example: "user" },
            status: { type: "string", enum: ["pending", "accepted", "rejected"], example: "pending" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
        }
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
            price: { type: "number", example: 250000 }
        }
    }
}