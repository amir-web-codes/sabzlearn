module.exports = {
    CartItem: {
        type: "object",
        properties: {
            title: { type: "string", example: "React from zero to hero" },
            slug: { type: "string", example: "react-from-zero-to-hero" },
            thumbnail: { type: "string", example: "https://cdn.example.com/react.webp" },
            courseId: { type: "string", example: "6857e4d1e5d82d0d1f5d8c10" },
            price: { type: "number", default: 0, example: 250000 },
            oldPrice: { type: "number", default: 0, description: "Previous price when the server detects a price change.", example: 300000 },
            priceChanged: { type: "boolean", default: false, description: "The user must review a changed price before checkout.", example: false }
        }
    },

    Cart: {
        type: "object",
        properties: {
            _id: { type: "string", example: "6857e4d1e5d82d0d1f5d8c70" },
            userId: { type: "string", example: "6857e4d1e5d82d0d1f5d8c32" },
            items: { type: "array", items: { $ref: "#/components/schemas/CartItem" } },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
        }
    },

    OrderItem: {
        type: "object",
        properties: {
            courseId: { type: "string", example: "6857e4d1e5d82d0d1f5d8c10" },
            title: { type: "string", example: "React from zero to hero" },
            slug: { type: "string", example: "react-from-zero-to-hero" },
            price: { type: "number", example: 250000 }
        }
    },

    Order: {
        type: "object",
        properties: {
            _id: { type: "string", example: "6857e4d1e5d82d0d1f5d8c80" },
            userId: { type: "string", example: "6857e4d1e5d82d0d1f5d8c32" },
            items: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
            totalPrice: { type: "number", example: 250000 },
            status: { type: "string", enum: ["pending", "paid", "failed", "expired"], example: "paid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
        },
        required: ["userId", "items", "totalPrice", "status"]
    }
}
