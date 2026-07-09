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
                example: false
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
    }
}