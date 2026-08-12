module.exports = {
    "/tickets/create": {
        post: {
            tags: ["Tickets"],
            operationId: "createTicket",
            summary: "Create a ticket",
            description: "Creates an admin ticket when `assignedToId` is omitted. When supplied, `assignedToId` must identify an existing teacher or admin. A user can have at most three tickets in total, regardless of status.",
            security: [{ bearerAuth: [] }],
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
                    $ref: "#/components/responses/CannotAssignTicketToRegularUser"
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
            description: "Closed tickets reject replies. In the current backend, the owner can reply only while the ticket is unassigned; after assignment, only the assigned staff member can reply. An unassigned admin ticket can also be claimed by an admin reply. A staff reply assigns `responsedBy`/`assignedTo` and changes status to `pending`; an owner reply leaves status unchanged.",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/IdParameter" }
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
            description: "The owner passes the route-level access check but is rejected by the service. An admin can change an admin ticket; an assigned teacher can change their ticket. Only an admin can reopen a closed ticket, and the request body supports only `pending` or `closed`.",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/IdParameter" }
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
            description: "Returns `\"no ticket found\"` instead of an empty array when no ticket matches.",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/PageParameter" },
                { $ref: "#/components/parameters/LimitParameter" },
                { $ref: "#/components/parameters/TicketStatusParameter" },
                { $ref: "#/components/parameters/TicketSortByParameter" },
                { $ref: "#/components/parameters/SortOrderParameter" }
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
            tags: ["Tickets", "Admins"],
            operationId: "getAllTickets",
            summary: "List tickets available to staff",
            description: "Teachers receive only tickets assigned to them. Admins receive admin tickets that are unassigned or assigned to themselves. When `status` is omitted and `availableOnly=true`, closed tickets are excluded. This endpoint always returns an array.",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/PageParameter" },
                { $ref: "#/components/parameters/LimitParameter" },
                { $ref: "#/components/parameters/TicketStatusParameter" },
                { $ref: "#/components/parameters/AvailableOnlyParameter" },
                { $ref: "#/components/parameters/TicketSortByParameter" },
                { $ref: "#/components/parameters/SortOrderParameter" }
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
            description: "Available to the ticket owner, assigned staff member, or any admin. For an unassigned admin ticket, an admin also has access. Top-level user references are populated; reply sender ids are not.",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/IdParameter" }
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