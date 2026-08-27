module.exports = {
    CartFetchedSuccessfully: {
        description: "Current user's cart fetched successfully. If no cart exists yet, the backend creates and returns an empty cart.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CartWithMetaResponse"
                },

                example: {
                    success: true,
                    message: "cart fetched successfully",
                    data: {
                        _id: "6857e4d1e5d82d0d1f5d8c70",
                        userId: "6857e4d1e5d82d0d1f5d8c32",
                        items: [
                            {
                                _id: "6857e4d1e5d82d0d1f5d8ca1",
                                title: "Node.js Backend Mastery",
                                courseId: "6857e4d1e5d82d0d1f5d8c10",
                                price: 1250000,
                                oldPrice: 0,
                                priceChanged: false
                            }
                        ],
                        createdAt: "2026-08-27T10:00:00.000Z",
                        updatedAt: "2026-08-27T10:05:00.000Z",
                        __v: 0
                    },
                    meta: {
                        totalItems: 1,
                        totalPrice: 1250000
                    }
                }
            }
        }
    },

    CartItemAddedSuccessfully: {
        description: "Course added to the current user's cart successfully.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CartWithMetaResponse"
                },

                example: {
                    success: true,
                    message: "item added successfully",
                    data: {
                        _id: "6857e4d1e5d82d0d1f5d8c70",
                        userId: "6857e4d1e5d82d0d1f5d8c32",
                        items: [
                            {
                                _id: "6857e4d1e5d82d0d1f5d8ca1",
                                title: "Node.js Backend Mastery",
                                courseId: "6857e4d1e5d82d0d1f5d8c10",
                                price: 1250000,
                                oldPrice: 0,
                                priceChanged: false
                            }
                        ],
                        createdAt: "2026-08-27T10:00:00.000Z",
                        updatedAt: "2026-08-27T10:05:00.000Z",
                        __v: 0
                    },
                    meta: {
                        totalItems: 1,
                        totalPrice: 1250000
                    }
                }
            }
        }
    },

    CartClearedSuccessfully: {
        description: "All items were removed from the current user's cart. The operation succeeds even when the cart did not previously exist.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Success"
                },

                example: {
                    success: true,
                    message: "cart items deleted successfully"
                }
            }
        }
    },

    CartItemRemovedSuccessfully: {
        description: "The selected course was removed from the cart. If the course exists but was not present in the cart, the endpoint still succeeds and returns the current cart totals.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CartMutationMetaResponse"
                },

                example: {
                    success: true,
                    message: "course deleted successfully from cart",
                    meta: {
                        totalItems: 1,
                        totalPrice: 1000000
                    }
                }
            }
        }
    },

    CheckoutCompletedSuccessfully: {
        description: "Checkout completed successfully. The current implementation creates an order, immediately marks it paid, activates enrollments for all order items, and clears the cart in MongoDB transactions.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/CheckoutResponse"
                },

                example: {
                    success: true,
                    message: "payment done successfully",
                    data: {
                        _id: "6857e4d1e5d82d0d1f5d8c80",
                        userId: "6857e4d1e5d82d0d1f5d8c32",
                        items: [
                            {
                                _id: "6857e4d1e5d82d0d1f5d8cb1",
                                courseId: "6857e4d1e5d82d0d1f5d8c10",
                                title: "Node.js Backend Mastery",
                                price: 1250000
                            }
                        ],
                        totalPrice: 1250000,
                        authority: null,
                        refId: null,
                        failReason: null,
                        status: "paid",
                        createdAt: "2026-08-27T10:10:00.000Z",
                        updatedAt: "2026-08-27T10:10:00.000Z",
                        __v: 0
                    },
                    meta: {
                        pricePaid: 1250000
                    }
                }
            }
        }
    },

    OrderFetchedSuccessfully: {
        description: "Order fetched successfully by an administrator.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/OrderResponse"
                },

                example: {
                    success: true,
                    message: "order fetched successfully",
                    data: {
                        _id: "6857e4d1e5d82d0d1f5d8c80",
                        userId: "6857e4d1e5d82d0d1f5d8c32",
                        items: [
                            {
                                _id: "6857e4d1e5d82d0d1f5d8cb1",
                                courseId: "6857e4d1e5d82d0d1f5d8c10",
                                title: "Node.js Backend Mastery",
                                price: 1250000
                            }
                        ],
                        totalPrice: 1250000,
                        authority: null,
                        refId: null,
                        failReason: null,
                        status: "paid",
                        createdAt: "2026-08-27T10:10:00.000Z",
                        updatedAt: "2026-08-27T10:10:00.000Z",
                        __v: 0
                    }
                }
            }
        }
    },

    AddCartItemBadRequest: {
        description: "The course cannot be added because the user already has an active enrollment for it or because the cart has reached the 50-item limit.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                examples: {
                    alreadyOwned: {
                        summary: "User already owns the course",
                        value: {
                            success: false,
                            message: "you already own this course"
                        }
                    },

                    cartFull: {
                        summary: "Maximum cart size reached",
                        value: {
                            success: false,
                            message: "cart can contain at most 50 items"
                        }
                    }
                }
            }
        }
    },

    CourseAlreadyInCart: {
        description: "The selected course already exists in the current user's cart.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                example: {
                    success: false,
                    message: "course already exists in cart"
                }
            }
        }
    },

    EmptyCart: {
        description: "Checkout cannot start because the synchronized cart has no items.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                example: {
                    success: false,
                    message: "no items in cart"
                }
            }
        }
    },

    CartPriceChanged: {
        description: "Checkout was stopped because synchronization detected at least one changed course price. The frontend should fetch/review the cart before retrying checkout.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                example: {
                    success: false,
                    message: "some items' prices have changed, please review your cart",
                    code: "PRICE_CHANGED"
                }
            }
        }
    },

    OrderNotFound: {
        description: "No order exists with the supplied id.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                example: {
                    success: false,
                    message: "order not found"
                }
            }
        }
    },

    TooManyRequestsGlobalOrCart: {
        description: "Either the app-wide global limiter (100 requests per IP / 20 minutes) or the cart limiter (10 requests per IP / 2 minutes) was exceeded. The same cart limiter instance is shared by POST /cart/checkout and GET /cart/me.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                examples: {
                    global: {
                        summary: "Global rate limit exceeded",
                        value: {
                            success: false,
                            message: "you're sending too many requests, slow down cowboy🤠"
                        }
                    },

                    cart: {
                        summary: "Cart rate limit exceeded",
                        value: {
                            success: false,
                            message: "too many requests, please try again later"
                        }
                    }
                }
            }
        }
    }
}