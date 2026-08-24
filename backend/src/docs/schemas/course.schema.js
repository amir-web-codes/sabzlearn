module.exports = {
    CourseRating: {
        type: "object",
        properties: {
            average: {
                type: "number",
                minimum: 0,
                example: 4.6
            },
            count: {
                type: "integer",
                minimum: 0,
                example: 120
            }
        },
        required: ["average", "count"]
    },

    CourseDocument: {
        allOf: [
            { $ref: "#/components/schemas/TimestampedMongoDocumentMeta" },
            {
                type: "object",
                description: "Raw Course document returned by queries that use lean() without populate/projection, including GET /categories/{slug}/courses.",
                properties: {
                    title: {
                        type: "string",
                        minLength: 3,
                        maxLength: 50,
                        example: "Node.js Mastery"
                    },
                    slug: {
                        type: "string",
                        example: "nodejs-mastery"
                    },
                    description: {
                        type: "string",
                        example: "A complete backend development course with Node.js."
                    },
                    price: {
                        type: "number",
                        minimum: 0,
                        example: 120
                    },
                    discountPrecentage: {
                        type: "number",
                        minimum: 0,
                        maximum: 100,
                        description: "Field name is intentionally documented with the backend model's current spelling: discountPrecentage.",
                        example: 20
                    },
                    finalPrice: {
                        type: "number",
                        minimum: 0,
                        example: 96
                    },
                    category: {
                        $ref: "#/components/schemas/NullableMongoObjectId"
                    },
                    tags: {
                        type: "array",
                        maxItems: 5,
                        items: {
                            $ref: "#/components/schemas/MongoObjectId"
                        }
                    },
                    instructor: {
                        $ref: "#/components/schemas/MongoObjectId"
                    },
                    level: {
                        type: "string",
                        enum: ["beginner", "intermediate", "advanced"],
                        example: "intermediate"
                    },
                    language: {
                        type: "string",
                        enum: ["en", "fa"],
                        example: "fa"
                    },
                    studentsCount: {
                        type: "integer",
                        minimum: 0,
                        example: 350
                    },
                    thumbnail: {
                        $ref: "#/components/schemas/MediaAssetReference"
                    },
                    coverVideoURL: {
                        $ref: "#/components/schemas/MediaAssetReference"
                    },
                    isDeleted: {
                        type: "boolean",
                        example: false
                    },
                    deletedBy: {
                        $ref: "#/components/schemas/NullableMongoObjectId"
                    },
                    deletedAt: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        example: null
                    },
                    status: {
                        type: "string",
                        enum: ["draft", "published", "archived", "closed"],
                        example: "published"
                    },
                    rating: {
                        $ref: "#/components/schemas/CourseRating"
                    }
                },
                required: [
                    "title",
                    "slug",
                    "description",
                    "price",
                    "discountPrecentage",
                    "finalPrice",
                    "category",
                    "tags",
                    "instructor",
                    "level",
                    "language",
                    "studentsCount",
                    "thumbnail",
                    "coverVideoURL",
                    "isDeleted",
                    "deletedBy",
                    "deletedAt",
                    "status",
                    "rating"
                ]
            }
        ]
    }
}
