module.exports = {
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
                description: "Optional application or library error code",
                nullable: true
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
                type: "string",
                example: "6857e4d1e5d82d0d1f5d8c32"
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