module.exports = {
    CourseAlreadyOwned: {
        description: "User already owns (is enrolled in) this course",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "you already own this course" }
            }
        }
    },
    CourseAlreadyInCart: {
        description: "Course already exists in the user's cart",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "course already exists in cart" }
            }
        }
    },
    CartFull: {
        description: "Cart already contains the maximum of 50 items",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "cart can contain at most 50 items" }
            }
        }
    },
    EmptyCart: {
        description: "Cart has no items to check out",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "no items in cart" }
            }
        }
    },
    OrderNotFound: {
        description: "Order not found",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "order not found" }
            }
        }
    },
    TooManyCartRequests: {
        description: "Too many requests to cart endpoints (10 per 2 minutes, shared between checkout and viewing the cart)",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "too many requests, please try again later" }
            }
        }
    }
}