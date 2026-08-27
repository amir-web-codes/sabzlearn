module.exports = {
    CartItem: {
        type: "object",
        description: "A course snapshot stored inside the user's cart. The cart stores only the course title/id and pricing state; it does not store course slug or thumbnail.",

        properties: {
            _id: {
                $ref: "#/components/schemas/MongoObjectId"
            },

            title: {
                type: "string",
                description: "Course title snapshot. GET /cart/me synchronizes this value with the current course title.",
                example: "Node.js Backend Mastery"
            },

            courseId: {
                $ref: "#/components/schemas/MongoObjectId"
            },

            price: {
                type: "number",
                minimum: 0,
                description: "Current course finalPrice known by the cart.",
                example: 1250000
            },

            oldPrice: {
                type: "number",
                minimum: 0,
                default: 0,
                description: "Previous cart price when GET /cart/me or checkout detects that the course finalPrice changed. Reset to 0 after the price matches again.",
                example: 1450000
            },

            priceChanged: {
                type: "boolean",
                default: false,
                description: "True when the backend detects a changed course price. Checkout is blocked until the user reviews the cart and the flag is cleared by a later synchronization.",
                example: false
            }
        },

        required: [
            "_id",
            "title",
            "courseId",
            "price",
            "oldPrice",
            "priceChanged"
        ]
    },

    Cart: {
        allOf: [
            {
                $ref: "#/components/schemas/TimestampedMongoDocumentMeta"
            },

            {
                type: "object",

                properties: {
                    userId: {
                        $ref: "#/components/schemas/MongoObjectId"
                    },

                    items: {
                        type: "array",
                        maxItems: 50,
                        items: {
                            $ref: "#/components/schemas/CartItem"
                        }
                    }
                },

                required: [
                    "userId",
                    "items"
                ]
            }
        ]
    },

    CartMeta: {
        type: "object",
        description: "Current cart summary returned by cart read/mutation endpoints.",

        properties: {
            totalItems: {
                type: "integer",
                minimum: 0,
                maximum: 50,
                example: 2
            },

            totalPrice: {
                type: "number",
                minimum: 0,
                description: "Sum of the item prices returned by the operation.",
                example: 2250000
            }
        },

        required: [
            "totalItems",
            "totalPrice"
        ]
    },

    CartWithMetaResponse: {
        allOf: [
            {
                $ref: "#/components/schemas/Success"
            },

            {
                type: "object",

                properties: {
                    data: {
                        $ref: "#/components/schemas/Cart"
                    },

                    meta: {
                        $ref: "#/components/schemas/CartMeta"
                    }
                },

                required: [
                    "data",
                    "meta"
                ]
            }
        ]
    },

    CartMutationMetaResponse: {
        allOf: [
            {
                $ref: "#/components/schemas/Success"
            },

            {
                type: "object",

                properties: {
                    meta: {
                        $ref: "#/components/schemas/CartMeta"
                    }
                },

                required: [
                    "meta"
                ]
            }
        ]
    },

    OrderItem: {
        type: "object",
        description: "Course snapshot persisted inside an order at checkout time.",

        properties: {
            _id: {
                $ref: "#/components/schemas/MongoObjectId"
            },

            courseId: {
                $ref: "#/components/schemas/MongoObjectId"
            },

            title: {
                type: "string",
                example: "Node.js Backend Mastery"
            },

            price: {
                type: "number",
                minimum: 0,
                example: 1250000
            }
        },

        required: [
            "_id",
            "courseId",
            "title",
            "price"
        ]
    },

    Order: {
        allOf: [
            {
                $ref: "#/components/schemas/TimestampedMongoDocumentMeta"
            },

            {
                type: "object",

                properties: {
                    userId: {
                        $ref: "#/components/schemas/MongoObjectId"
                    },

                    items: {
                        type: "array",
                        minItems: 1,
                        items: {
                            $ref: "#/components/schemas/OrderItem"
                        }
                    },

                    totalPrice: {
                        type: "number",
                        minimum: 0,
                        example: 2250000
                    },

                    authority: {
                        type: "string",
                        nullable: true,
                        description: "Reserved payment authority. The current immediate checkout flow does not populate it.",
                        example: null
                    },

                    refId: {
                        type: "string",
                        nullable: true,
                        description: "Reserved payment reference id. The current immediate checkout flow does not populate it.",
                        example: null
                    },

                    failReason: {
                        type: "string",
                        nullable: true,
                        description: "Failure reason for failed orders; null for successful/pending orders unless a failure flow sets it.",
                        example: null
                    },

                    status: {
                        type: "string",
                        enum: [
                            "pending",
                            "paid",
                            "failed",
                            "expired"
                        ],
                        example: "paid"
                    }
                },

                required: [
                    "userId",
                    "items",
                    "totalPrice",
                    "status"
                ]
            }
        ]
    },

    CheckoutMeta: {
        type: "object",

        properties: {
            pricePaid: {
                type: "number",
                minimum: 0,
                description: "The final totalPrice stored on the completed order.",
                example: 2250000
            }
        },

        required: [
            "pricePaid"
        ]
    },

    CheckoutResponse: {
        allOf: [
            {
                $ref: "#/components/schemas/Success"
            },

            {
                type: "object",

                properties: {
                    data: {
                        $ref: "#/components/schemas/Order"
                    },

                    meta: {
                        $ref: "#/components/schemas/CheckoutMeta"
                    }
                },

                required: [
                    "data",
                    "meta"
                ]
            }
        ]
    },

    OrderResponse: {
        allOf: [
            {
                $ref: "#/components/schemas/Success"
            },

            {
                type: "object",

                properties: {
                    data: {
                        $ref: "#/components/schemas/Order"
                    }
                },

                required: [
                    "data"
                ]
            }
        ]
    }
}