module.exports = {
    "/cart/checkout": {
        post: {
            tags: ["Cart"],

            operationId: "checkoutCart",

            summary: "Checkout the current cart",

            description: `Creates and completes an order from the authenticated user's cart. After the app-wide global limiter, route middleware order is cart limiter -> access-token authentication -> ban check. The cart is synchronized before checkout: missing/soft-deleted courses are removed, changed titles are updated, and changed final prices set priceChanged=true. An empty synchronized cart returns 400. Any detected price change blocks checkout with 409/PRICE_CHANGED so the client can show the updated cart before retrying. The current implementation does not call an external payment gateway: it creates a pending order and immediately completes it as paid inside MongoDB transactions, activates an enrollment for every order item, clears the cart, and returns the paid order. MongoDB therefore needs transaction support (the local project uses a replica set).`,

            security: [
                {
                    bearerAuth: []
                }
            ],

            responses: {
                200: {
                    $ref: "#/components/responses/CheckoutCompletedSuccessfully"
                },

                400: {
                    $ref: "#/components/responses/EmptyCart"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/UserBanned"
                },

                409: {
                    $ref: "#/components/responses/CartPriceChanged"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrCart"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/cart/admin/orders/{id}": {
        get: {
            tags: ["Cart", "Admins"],

            operationId: "getOrderById",

            summary: "Get an order by id (admin only)",

            description: `Returns any order by MongoDB ObjectId. After the app-wide global limiter, middleware order is id validation -> access-token authentication -> ban check -> admin-role check. The controller intentionally calls the order service without a user filter, so an authenticated non-banned admin can retrieve an order belonging to any user. Order references are returned as raw ObjectIds and are not populated.`,

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    $ref: "#/components/parameters/IdParameter"
                }
            ],

            responses: {
                200: {
                    $ref: "#/components/responses/OrderFetchedSuccessfully"
                },

                400: {
                    $ref: "#/components/responses/InvalidId"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/ForbiddenOrBanned"
                },

                404: {
                    $ref: "#/components/responses/OrderNotFound"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobal"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/cart/me": {
        get: {
            tags: ["Cart"],

            operationId: "getCurrentUserCart",

            summary: "Get the current user's cart",

            description: `Returns the authenticated user's cart and synchronizes stored cart snapshots with current course data. Middleware order after the global limiter is access-token authentication -> cart limiter; this route does not run the ban-check middleware, so a valid token carrying a banned account can currently read the cart. If no cart exists, an empty cart is created. During synchronization, missing or soft-deleted courses are silently removed, course titles are refreshed, and price changes update price/oldPrice/priceChanged. The service does not currently remove a course solely because its status is no longer published. totalPrice is calculated from synchronized course finalPrice values. The cart limiter is shared with POST /cart/checkout.`,

            security: [
                {
                    bearerAuth: []
                }
            ],

            responses: {
                200: {
                    $ref: "#/components/responses/CartFetchedSuccessfully"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrCart"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        },

        delete: {
            tags: ["Cart"],

            operationId: "clearCurrentUserCart",

            summary: "Clear the current user's cart",

            description: `Removes every item from the authenticated user's cart. After the app-wide global limiter, this route only runs access-token authentication; it does not run the ban-check or cart-specific limiter. The service uses upsert=true, so clearing a cart also succeeds when the user had no cart document yet and leaves an empty cart document behind.`,

            security: [
                {
                    bearerAuth: []
                }
            ],

            responses: {
                200: {
                    $ref: "#/components/responses/CartClearedSuccessfully"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobal"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/cart/{slug}": {
        post: {
            tags: ["Cart"],

            operationId: "addCourseToCart",

            summary: "Add a course to the current user's cart",

            description: `Adds a published, non-deleted course identified by its exact slug to the authenticated user's cart. After the app-wide global limiter, middleware order is access-token authentication -> ban check; there is no cart-specific limiter and no dedicated slug-validation middleware on this route. The course lookup selects title/price/finalPrice and only accepts status=published and isDeleted=false. A user with an active enrollment cannot add the course. Duplicate cart items return 409 and a cart may contain at most 50 items. The stored cart item contains title, courseId, price, oldPrice, and priceChanged; slug/thumbnail are not stored. This operation calculates totalPrice from the prices already stored in the returned cart and does not resynchronize older cart items first; GET /cart/me and checkout perform that synchronization.`,

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    $ref: "#/components/parameters/SlugParameter"
                }
            ],

            responses: {
                201: {
                    $ref: "#/components/responses/CartItemAddedSuccessfully"
                },

                400: {
                    $ref: "#/components/responses/AddCartItemBadRequest"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/UserBanned"
                },

                404: {
                    $ref: "#/components/responses/CourseNotFound"
                },

                409: {
                    $ref: "#/components/responses/CourseAlreadyInCart"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobal"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        },

        delete: {
            tags: ["Cart"],

            operationId: "removeCourseFromCart",

            summary: "Remove a course from the current user's cart",

            description: `Removes the course identified by slug from the authenticated user's cart. After the app-wide global limiter, this route runs access-token authentication only; it does not run the ban check or cart-specific limiter. The slug itself is not Zod-validated. The course lookup used here does not restrict status or isDeleted, so an existing draft/archived/closed/soft-deleted course document can still be resolved for removal. Before pulling the selected item, the service synchronizes the cart, which removes missing/soft-deleted course items and refreshes title/price state. If the course exists but is not currently in the cart, the operation still returns 200 with unchanged totals.`,

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    $ref: "#/components/parameters/SlugParameter"
                }
            ],

            responses: {
                200: {
                    $ref: "#/components/responses/CartItemRemovedSuccessfully"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                404: {
                    $ref: "#/components/responses/CourseNotFound"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobal"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    }
}