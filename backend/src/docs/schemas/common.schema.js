const populatedUserReferenceProperties = {
    _id: {
        $ref: "#/components/schemas/MongoObjectId"
    },

    username: {
        type: "string",
        example: "amir"
    },

    email: {
        type: "string",
        format: "email",
        example: "amir@example.com"
    }
}

module.exports = {
    MongoObjectId: {
        type: "string",
        pattern: "^[0-9a-fA-F]{24}$",
        description: "MongoDB ObjectId serialized as a 24-character hexadecimal string",
        example: "6857e4d1e5d82d0d1f5d8c40"
    },

    NullableMongoObjectId: {
        type: "string",
        pattern: "^[0-9a-fA-F]{24}$",
        nullable: true,
        description: "MongoDB ObjectId serialized as a 24-character hexadecimal string, or null",
        example: "6857e4d1e5d82d0d1f5d8c40"
    },

    TimestampedMongoDocumentMeta: {
        type: "object",
        description: "Common Mongo/Mongoose metadata for timestamped documents returned without excluding __v.",
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

    MediaAssetReference: {
        type: "object",
        description: "Stored media reference returned by models that keep both a public URL/path and a storage-provider public id.",
        properties: {
            url: {
                type: "string",
                nullable: true,
                example: "https://res.cloudinary.com/example/image/upload/v1/sabzlearn/categories/icons/web-development.webp"
            },
            publicId: {
                type: "string",
                nullable: true,
                example: "sabzlearn/categories/icons/web-development"
            }
        },
        required: ["url", "publicId"]
    },

    ImageUploadFile: {
        type: "string",
        format: "binary",
        description: "Image upload. Current image middleware accepts image/jpeg, image/png, and image/webp up to 2 MiB."
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
                example: ["name"]
            },
            message: {
                type: "string",
                example: "Too small: expected string to have >=2 characters"
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

        properties: populatedUserReferenceProperties,

        required: [
            "_id",
            "username",
            "email"
        ]
    },

    NullablePopulatedUserReference: {
        type: "object",
        nullable: true,
        description: "A populated user reference, or null.",

        properties: populatedUserReferenceProperties,

        required: [
            "_id",
            "username",
            "email"
        ]
    },

    KebabSlug: {
        type: "string",
        minLength: 2,
        maxLength: 100,
        pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
        description: "Lowercase alphanumeric kebab-case slug accepted by validated slug inputs.",
        example: "web-development"
    },

    PublishedCoursesListResponse: {
        allOf: [
            {
                $ref: "#/components/schemas/Success"
            },

            {
                type: "object",

                properties: {
                    message: {
                        type: "string",
                        enum: ["courses fetched successfully"],
                        example: "courses fetched successfully"
                    },

                    data: {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/CourseDocument"
                        }
                    },

                    meta: {
                        $ref: "#/components/schemas/PaginationMeta"
                    }
                },

                required: [
                    "data",
                    "meta"
                ]
            }
        ]
    }
}