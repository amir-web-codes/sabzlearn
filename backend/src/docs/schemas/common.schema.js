module.exports = {
    MongoObjectId: {
        type: "string",
        pattern: "^[a-fA-F0-9]{24}$",
        description: "MongoDB ObjectId serialized as a 24-character hexadecimal string",
        example: "6857e4d1e5d82d0d1f5d8c40"
    },

    TimestampedMongoDocumentMeta: {
        type: "object",
        description: "Common Mongo/Mongoose metadata for documents created with timestamps=true and returned without excluding __v.",
        properties: {
            _id: {
                $ref: "#/components/schemas/MongoObjectId"
            },
            createdAt: {
                type: "string",
                format: "date-time",
                readOnly: true,
                example: "2026-08-24T10:00:00.000Z"
            },
            updatedAt: {
                type: "string",
                format: "date-time",
                readOnly: true,
                example: "2026-08-24T10:00:00.000Z"
            },
            __v: {
                type: "integer",
                minimum: 0,
                readOnly: true,
                example: 0
            }
        },
        required: ["_id", "createdAt", "updatedAt", "__v"]
    },

    Error: {
        type: "object",
        description: "Standard error response. Optional diagnostic fields are included only when the thrown error provides them.",
        properties: {
            success: { type: "boolean", enum: [false], example: false },
            message: { type: "string", example: "error" },
            errors: {
                type: "array",
                items: { $ref: "#/components/schemas/ValidationErrorItem" }
            },
            code: {
                description: "Optional application/library/database error code. MongoDB errors may expose a numeric code such as 11000.",
                nullable: true,
                oneOf: [
                    { type: "string" },
                    { type: "integer" }
                ]
            },
            details: {
                type: "object",
                description: "Optional structured error details",
                nullable: true,
                additionalProperties: true
            }
        },
        required: ["success", "message"]
    },

    Success: {
        type: "object",
        description: "Standard success response without a data payload",
        properties: {
            success: { type: "boolean", enum: [true], example: true },
            message: { type: "string", example: "success" }
        },
        required: ["success", "message"]
    },

    PaginationMeta: {
        type: "object",
        description: "Pagination metadata",
        properties: {
            totalNumber: { type: "integer", minimum: 0, example: 42 },
            totalPages: { type: "integer", minimum: 0, example: 3 },
            page: { type: "integer", minimum: 1, example: 1 },
            limit: {
                type: "integer",
                minimum: 1,
                maximum: 100,
                example: 20
            }
        },
        required: ["totalNumber", "totalPages", "page", "limit"]
    },

    ValidationErrorItem: {
        type: "object",
        description: "A single Zod 4 validation issue",
        properties: {
            code: { type: "string", example: "too_small" },
            path: {
                type: "array",
                items: {
                    oneOf: [
                        { type: "string" },
                        { type: "integer" }
                    ]
                },
                example: ["password"]
            },
            message: {
                type: "string",
                example: "Too small: expected string to have >=5 characters"
            }
        },
        required: ["code", "path", "message"]
    },

    ValidationError: {
        type: "object",
        properties: {
            success: { type: "boolean", enum: [false], example: false },
            message: {
                type: "string",
                enum: ["validation failed"],
                example: "validation failed"
            },
            errors: {
                type: "array",
                items: { $ref: "#/components/schemas/ValidationErrorItem" }
            }
        },
        required: ["success", "message", "errors"]
    },

    PopulatedUserReference: {
        type: "object",
        description: "A user reference populated with the fields selected by the service layer",
        properties: {
            _id: {
                $ref: "#/components/schemas/MongoObjectId"
            },
            username: { type: "string", example: "amir" },
            email: {
                type: "string",
                format: "email",
                example: "amir@example.com"
            }
        },
        required: ["_id", "username", "email"]
    }
}