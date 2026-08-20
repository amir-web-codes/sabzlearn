module.exports = {
    "/tickets/create": {
        post: {
            tags: ["Tickets"],
            operationId: "createTicket",
            summary: "Create a support ticket",

            description: "Creates a ticket for the authenticated user. If `assignedToId` is omitted, the ticket targets admins (`for=admin`) and starts unassigned. If `assignedToId` is supplied, the target must exist and have role `admin` or `teacher`; the ticket is immediately assigned to that user and `for` is derived from the target role. The current service counts all of the user's ticket documents regardless of status, so after three total tickets (open, pending, or closed) creation returns 400. Body validation runs before authentication; the ticket-specific rate limiter runs after authentication and the ban check. The assigned-user lookup currently checks only id/role and does not filter soft-deleted or banned accounts.",

            security: [
                {
                    bearerAuth: []
                }
            ],

            requestBody: {
                required: true,

                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/CreateTicket"
                        }
                    }
                }
            },

            responses: {
                201: {
                    $ref: "#/components/responses/TicketCreatedSuccessfully"
                },

                400: {
                    $ref: "#/components/responses/CreateTicketBadRequest"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/UserBanned"
                },

                404: {
                    $ref: "#/components/responses/UserNotFound"
                },

                409: {
                    $ref: "#/components/responses/CannotAssignTicketToNormalUser"
                },

                429: {
                    $ref: "#/components/responses/TooManyRequestsGlobalOrTicket"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/tickets/{id}/reply": {
        post: {
            tags: ["Tickets"],
            operationId: "replyToTicket",
            summary: "Reply to a ticket",

            description: "Adds a reply to an existing ticket. The `id` and body are validated before authentication. Route-level access is granted to the ticket owner, the currently assigned staff member, or an admin for an unassigned admin ticket. The service then rejects closed tickets and also rejects a request when `assignedTo` exists but does not equal the current user. Because of that second check, the owner can reply only while the ticket is still unassigned; after a staff member claims/replies to it, the owner currently receives 403. A non-owner staff reply sets both `responsedBy` and `assignedTo` to that staff user and changes status to `pending`. An owner reply to an unassigned ticket appends the reply but leaves assignment and status unchanged. Reply sender ids remain raw ObjectIds.",

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

            requestBody: {
                required: true,

                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ReplyMessage"
                        }
                    }
                }
            },

            responses: {
                201: {
                    $ref: "#/components/responses/ReplyCreatedSuccessfully"
                },

                400: {
                    $ref: "#/components/responses/InvalidIdOrValidationFailed"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/ReplyTicketForbidden"
                },

                404: {
                    $ref: "#/components/responses/TicketNotFound"
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

    "/tickets/{id}/change-status": {
        patch: {
            tags: ["Tickets"],
            operationId: "changeTicketStatus",
            summary: "Change ticket status",

            description: "Changes a ticket to `pending` or `closed`; `open` is not accepted by the request validator. The `id` and body are validated before authentication. The route-level access middleware allows the owner, assigned staff, or any admin to reach the service. The service is stricter: an admin may change only tickets whose `for` field is `admin`, and a teacher may change only a ticket assigned to that teacher. Therefore a normal owner can pass the route-level check but is still rejected with 403 by the service. Setting the already-current status returns 400. Reopening means changing a closed ticket to `pending`; only an admin can do that, so an assigned teacher receives 403 when attempting it. An admin can read any ticket by id but cannot change a teacher ticket through this endpoint because the service requires `for=admin` for admins.",

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

            requestBody: {
                required: true,

                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ChangeTicketStatus"
                        }
                    }
                }
            },

            responses: {
                200: {
                    $ref: "#/components/responses/TicketStatusChangedSuccessfully"
                },

                400: {
                    $ref: "#/components/responses/TicketStatusBadRequest"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/ChangeTicketStatusForbidden"
                },

                404: {
                    $ref: "#/components/responses/TicketNotFound"
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

    "/tickets/me": {
        get: {
            tags: ["Tickets"],
            operationId: "getCurrentUserTickets",
            summary: "List the current user's tickets",

            description: "Returns only tickets whose `userId` is the authenticated user's id. Supports optional status filtering plus pagination and createdAt sorting. Query validation runs before authentication. The response contains raw ObjectIds for user references. When no ticket matches, `data` is the literal string `no ticket found` rather than an empty array. Defaults are page=1, limit=20, sortBy=createdAt, sortOrder=desc.",

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    $ref: "#/components/parameters/PageParameter"
                },

                {
                    $ref: "#/components/parameters/LimitParameter"
                },

                {
                    $ref: "#/components/parameters/TicketStatusParameter"
                },

                {
                    $ref: "#/components/parameters/CreatedAtSortByParameter"
                },

                {
                    $ref: "#/components/parameters/SortOrderParameter"
                }
            ],

            responses: {
                200: {
                    $ref: "#/components/responses/UserTicketsFetchedSuccessfully"
                },

                400: {
                    $ref: "#/components/responses/FailedValidation"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/UserBanned"
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

    "/tickets/admin/get-all": {
        get: {
            tags: ["Tickets"],
            operationId: "getAllTickets",
            summary: "List tickets visible to staff",

            description: "Despite the `/admin/` path segment, this endpoint is available to both admins and teachers. Query validation runs before authentication. A teacher receives only tickets whose `assignedTo` equals that teacher's id. An admin receives only tickets with `for=admin` whose `assignedTo` is either null or that same admin's id; admin tickets assigned to another admin and teacher tickets are not included. If `status` is supplied, it is the effective status filter and `availableOnly` is ignored. If `status` is omitted, `availableOnly=true` (the default) excludes closed tickets, while `availableOnly=false` applies no status filter. User references are raw ObjectIds, and an empty result is returned as an empty array. Defaults are page=1, limit=20, sortBy=createdAt, sortOrder=desc.",

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    $ref: "#/components/parameters/PageParameter"
                },

                {
                    $ref: "#/components/parameters/LimitParameter"
                },

                {
                    $ref: "#/components/parameters/TicketStatusParameter"
                },

                {
                    $ref: "#/components/parameters/AvailableOnlyParameter"
                },

                {
                    $ref: "#/components/parameters/CreatedAtSortByParameter"
                },

                {
                    $ref: "#/components/parameters/SortOrderParameter"
                }
            ],

            responses: {
                200: {
                    $ref: "#/components/responses/StaffTicketsFetchedSuccessfully"
                },

                400: {
                    $ref: "#/components/responses/FailedValidation"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/StaffTicketsForbidden"
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

    "/tickets/{id}": {
        get: {
            tags: ["Tickets"],
            operationId: "getTicketById",
            summary: "Get a ticket by id",

            description: "Returns one ticket after id validation, authentication, ban checking, and ticket-access checking. The current access middleware allows the ticket owner, the assigned staff member, or any admin. This means admin read access is broader than the admin staff-list endpoint: an admin who knows a teacher-ticket id can fetch it directly even though that ticket is not returned by GET /tickets/admin/get-all. The service populates top-level `userId`, `assignedTo`, and `responsedBy` with `_id`, `username`, and `email`; `replies[].senderId` remains a raw ObjectId.",

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
                    $ref: "#/components/responses/TicketFetchedSuccessfully"
                },

                400: {
                    $ref: "#/components/responses/InvalidId"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                403: {
                    $ref: "#/components/responses/TicketReadForbidden"
                },

                404: {
                    $ref: "#/components/responses/TicketNotFound"
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