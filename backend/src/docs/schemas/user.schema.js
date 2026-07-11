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
        }
    }
}