module.exports = {
    CartItem: {
        type: "object",
        properties: {
            title: { type: "string", example: "React from zero to hero" },
            courseId: { type: "string", example: "6857e4d1e5d82d0d1f5d8c10" },
            price: { type: "number", default: 0, example: 250000 },
            oldPrice: { type: "number", default: 0, description: "در حال حاضر تو منطق سرویس هیچ‌جا آپدیت نمی‌شه، همیشه 0 است", example: 0 },
            priceChanged: { type: "boolean", default: false, description: "در حال حاضر تو منطق سرویس هیچ‌جا آپدیت نمی‌شه، همیشه false است", example: false }
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
            status: { type: "string", enum: ["pending", "paid", "failed", "processing", "cancelled"], example: "paid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
        },
        required: ["userId", "items", "totalPrice", "status"]
    }
}