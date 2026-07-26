module.exports = {
    "/tickets/create": {
        post: {
            description: "Create a new support ticket. Addressed to a specific teacher (if teacherId is provided) or to admins otherwise. Maximum 3 tickets per user.",
            summary: "Create a ticket",
            tags: ["Tickets"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/CreateTicket" },
                        example: { title: "Can't access my course", message: "I purchased the React course but it doesn't show up in my dashboard." }
                    }
                }
            },
            responses: {
                201: {
                    description: "ticket created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "ticket created successfully" },
                                    data: { $ref: "#/components/schemas/Ticket" }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: "request body failed validation OR user already has 3 tickets",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            examples: {
                                failedValidation: {
                                    summary: "body validation failed",
                                    value: {
                                        success: false,
                                        message: "validation failed",
                                        errors: [
                                            { code: "too_small", path: ["title"], message: "String must contain at least 3 character(s)" }
                                        ]
                                    }
                                },
                                maxTickets: {
                                    summary: "maximum tickets reached",
                                    value: { success: false, message: "maximum 3 tickets" }
                                }
                            }
                        }
                    }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/UserBanned" },
                404: {
                    description: "teacherId does not correspond to an existing user",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            example: { success: false, message: "user not found" }
                        }
                    }
                },
                422: { $ref: "#/components/responses/AssignedToAnUser" },
                429: { $ref: "#/components/responses/TooManyTickets" },
                500: { $ref: "#/components/responses/InternalServerError" },
            }
        }
    },

    "/tickets/{id}/reply": {
        post: {
            description: "Add a reply to a ticket. If the replier is not the ticket's original author, the ticket becomes assigned to them and its status changes to \"pending\".",
            summary: "Reply to a ticket",
            tags: ["Tickets"],
            parameters: [
                { $ref: "#/components/parameters/IdParameter" }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/ReplyMessage" },
                        example: { message: "Thanks, I'll look into it." }
                    }
                }
            },
            responses: {
                201: {
                    description: "reply created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "reply created successfully" },
                                    data: { $ref: "#/components/schemas/Ticket" }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: "invalid id path parameter OR request body failed validation",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            examples: {
                                invalidId: {
                                    summary: "invalid id",
                                    value: { success: false, message: "invalid id" }
                                },
                                failedValidation: {
                                    summary: "body validation failed",
                                    value: {
                                        success: false,
                                        message: "validation failed",
                                        errors: [
                                            { code: "too_big", path: ["message"], message: "String must contain at most 1000 character(s)" }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: {
                    description: "user is banned OR user has no access to this ticket OR ticket is closed",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            examples: {
                                permanentBan: {
                                    summary: "permanent ban",
                                    value: { success: false, message: "you are permanently banned. Reason: violating rules" }
                                },
                                temporaryBan: {
                                    summary: "temporary ban",
                                    value: { success: false, message: "you are temporary banned until: 2026-08-01T12:00:00.000Z. Reason: spam" }
                                },
                                noAccess: {
                                    summary: "no access to this ticket",
                                    value: { success: false, message: "you don't have access to this ticket" }
                                },
                                ticketClosed: {
                                    summary: "ticket is closed",
                                    value: { success: false, message: "this ticket is closed" }
                                }
                            }
                        }
                    }
                },
                404: { $ref: "#/components/responses/TicketNotFound" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/tickets/{id}/change-status": {
        patch: {
            description: "Change a ticket's status to \"pending\" or \"closed\". Only the assigned teacher or an admin (for admin-addressed tickets) can change status. Only an admin can reopen a closed ticket.",
            summary: "Change ticket status",
            tags: ["Tickets"],
            parameters: [
                { $ref: "#/components/parameters/IdParameter" }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/ChangeTicketStatus" },
                        example: { newStatus: "closed" }
                    }
                }
            },
            responses: {
                201: {
                    description: "ticket status changed successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Success" },
                            example: { success: true, message: "ticket status changed successfully" }
                        }
                    }
                },
                400: {
                    description: "invalid id path parameter OR request body failed validation OR ticket already has this status",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            examples: {
                                invalidId: {
                                    summary: "invalid id",
                                    value: { success: false, message: "invalid id" }
                                },
                                failedValidation: {
                                    summary: "body validation failed",
                                    value: {
                                        success: false,
                                        message: "validation failed",
                                        errors: [
                                            { code: "invalid_enum_value", path: ["newStatus"], message: "Invalid enum value. Expected 'pending' | 'closed', received 'open'" }
                                        ]
                                    }
                                },
                                alreadySet: {
                                    summary: "status already set",
                                    value: { success: false, message: "ticket already has this status" }
                                }
                            }
                        }
                    }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: {
                    description: "user is banned OR checkSelfTicketAuthor denies access OR no permission to change this ticket OR can't reopen a closed ticket",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            examples: {
                                permanentBan: {
                                    summary: "permanent ban",
                                    value: { success: false, message: "you are permanently banned. Reason: violating rules" }
                                },
                                temporaryBan: {
                                    summary: "temporary ban",
                                    value: { success: false, message: "you are temporary banned until: 2026-08-01T12:00:00.000Z. Reason: spam" }
                                },
                                noAccess: {
                                    summary: "no access to this ticket",
                                    value: { success: false, message: "you don't have access to this ticket" }
                                },
                                noPermission: {
                                    summary: "no permission over this ticket's status",
                                    value: { success: false, message: "you don't have permission to change this ticket" }
                                },
                                cannotReopen: {
                                    summary: "can't reopen a closed ticket",
                                    value: { success: false, message: "you can't reopen ticket" }
                                }
                            }
                        }
                    }
                },
                404: { $ref: "#/components/responses/TicketNotFound" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/tickets/me": {
        get: {
            description: "Get the authenticated user's own tickets",
            summary: "Get my tickets",
            tags: ["Tickets"],
            parameters: [
                { $ref: "#/components/parameters/PageParameter" },
                { $ref: "#/components/parameters/LimitParameter" }
            ],
            responses: {
                200: {
                    description: "tickets fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "tickets fetched successfully" },
                                    data: {
                                        oneOf: [
                                            { type: "array", items: { $ref: "#/components/schemas/Ticket" } },
                                            { type: "string", example: "no ticket found" }
                                        ]
                                    },
                                    meta: { $ref: "#/components/schemas/PaginationMeta" }
                                }
                            }
                        }
                    }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: { $ref: "#/components/responses/UserBanned" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/tickets/admin/get-all": {
        get: {
            description: "Get all tickets relevant to the requesting staff member — teachers see tickets assigned to them, admins see tickets addressed to admins (for: \"admin\")",
            summary: "Get all tickets (staff)",
            tags: ["Tickets", "Admins"],
            parameters: [
                { $ref: "#/components/parameters/PageParameter" },
                { $ref: "#/components/parameters/LimitParameter" },
                { $ref: "#/components/parameters/AvailableOnlyParameter" }
            ],
            responses: {
                200: {
                    description: "tickets fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "tickets fetched successfully" },
                                    data: { type: "array", items: { $ref: "#/components/schemas/Ticket" } },
                                    meta: { $ref: "#/components/schemas/PaginationMeta" }
                                }
                            }
                        }
                    }
                },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: {
                    description: "user is banned OR user doesn't have admin/teacher role",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            examples: {
                                permanentBan: {
                                    summary: "permanent ban",
                                    value: { success: false, message: "you are permanently banned. Reason: violating rules" }
                                },
                                temporaryBan: {
                                    summary: "temporary ban",
                                    value: { success: false, message: "you are temporary banned until: 2026-08-01T12:00:00.000Z. Reason: spam" }
                                },
                                forbidden: {
                                    summary: "no permission (not admin/teacher)",
                                    value: { success: false, message: "you don't have permission" }
                                }
                            }
                        }
                    }
                },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    },

    "/tickets/{id}": {
        get: {
            description: "Get a single ticket by id, populated with author/assignee/responder username & email.",
            summary: "Get ticket by id",
            tags: ["Tickets"],
            parameters: [
                { $ref: "#/components/parameters/IdParameter" }
            ],
            responses: {
                200: {
                    description: "ticket fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "ticket fetched successfully" },
                                    data: { $ref: "#/components/schemas/TicketPopulated" }
                                }
                            }
                        }
                    }
                },
                400: { $ref: "#/components/responses/InvalidId" },
                401: { $ref: "#/components/responses/Unauthorized" },
                403: {
                    description: "user is banned OR user doesn't have access to this ticket",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            examples: {
                                permanentBan: {
                                    summary: "permanent ban",
                                    value: { success: false, message: "you are permanently banned. Reason: violating rules" }
                                },
                                temporaryBan: {
                                    summary: "temporary ban",
                                    value: { success: false, message: "you are temporary banned until: 2026-08-01T12:00:00.000Z. Reason: spam" }
                                },
                                noAccess: {
                                    summary: "no access to this ticket",
                                    value: { success: false, message: "you don't have access to this ticket" }
                                }
                            }
                        }
                    }
                },
                404: { $ref: "#/components/responses/TicketNotFound" },
                500: { $ref: "#/components/responses/InternalServerError" }
            }
        }
    }
}