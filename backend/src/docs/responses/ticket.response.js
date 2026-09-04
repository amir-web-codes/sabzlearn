module.exports = {
    TicketNotFound: {
        description: "Ticket not found",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                example: {
                    success: false,
                    message: "ticket not found"
                }
            }
        }
    },

    CannotAssignTicketToNormalUser: {
        description: "The supplied assignedToId belongs to a user whose current role is `user`; tickets can be assigned only to admins or teachers.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                example: {
                    success: false,
                    message: "you can't assign a ticket to a regular user"
                }
            }
        }
    },

    TicketCreatedSuccessfully: {
        description: "Ticket created successfully",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/TicketResponse"
                },

                example: {
                    success: true,
                    message: "ticket created successfully",

                    data: {
                        _id: "6857e4d1e5d82d0d1f5d8c40",
                        title: "Cannot access my course",
                        message: "I purchased a course but cannot access it.",
                        userId: "6857e4d1e5d82d0d1f5d8c32",
                        assignedTo: null,
                        responsedBy: null,
                        for: "admin",
                        status: "open",
                        replies: [],
                        createdAt: "2026-08-21T10:00:00.000Z",
                        updatedAt: "2026-08-21T10:00:00.000Z",
                        __v: 0
                    }
                }
            }
        }
    },

    ReplyCreatedSuccessfully: {
        description: "Reply created successfully. A staff reply claims/keeps the ticket for that staff member and sets status to `pending`; an owner reply to an unassigned ticket does not change assignment/status.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/TicketResponse"
                },

                examples: {
                    staffReply: {
                        summary: "Staff member replies",

                        value: {
                            success: true,
                            message: "reply created successfully",

                            data: {
                                _id: "6857e4d1e5d82d0d1f5d8c40",
                                title: "Cannot access my course",
                                message: "I purchased a course but cannot access it.",
                                userId: "6857e4d1e5d82d0d1f5d8c32",
                                assignedTo: "6857e4d1e5d82d0d1f5d8c99",
                                responsedBy: "6857e4d1e5d82d0d1f5d8c99",
                                for: "admin",
                                status: "pending",

                                replies: [
                                    {
                                        _id: "6857e4d1e5d82d0d1f5d8c55",
                                        message: "We are checking your issue.",
                                        senderId: "6857e4d1e5d82d0d1f5d8c99",
                                        createdAt: "2026-08-21T10:30:00.000Z"
                                    }
                                ],

                                createdAt: "2026-08-21T10:00:00.000Z",
                                updatedAt: "2026-08-21T10:30:00.000Z",
                                __v: 1
                            }
                        }
                    },

                    ownerReply: {
                        summary: "Owner replies before the ticket is assigned",

                        value: {
                            success: true,
                            message: "reply created successfully",

                            data: {
                                _id: "6857e4d1e5d82d0d1f5d8c40",
                                title: "Cannot access my course",
                                message: "I purchased a course but cannot access it.",
                                userId: "6857e4d1e5d82d0d1f5d8c32",
                                assignedTo: null,
                                responsedBy: null,
                                for: "admin",
                                status: "open",

                                replies: [
                                    {
                                        _id: "6857e4d1e5d82d0d1f5d8c56",
                                        message: "Here is some more information.",
                                        senderId: "6857e4d1e5d82d0d1f5d8c32",
                                        createdAt: "2026-08-21T10:20:00.000Z"
                                    }
                                ],

                                createdAt: "2026-08-21T10:00:00.000Z",
                                updatedAt: "2026-08-21T10:20:00.000Z",
                                __v: 1
                            }
                        }
                    }
                }
            }
        }
    },

    TicketStatusChangedSuccessfully: {
        description: "Ticket status changed successfully",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Success"
                },

                example: {
                    success: true,
                    message: "ticket status changed successfully"
                }
            }
        }
    },

    CreateTicketBadRequest: {
        description: "The create-ticket body failed validation, or the authenticated user already has three ticket documents. The three-ticket limit counts open tickets.",

        content: {
            "application/json": {
                schema: {
                    oneOf: [
                        {
                            $ref: "#/components/schemas/ValidationError"
                        },

                        {
                            $ref: "#/components/schemas/Error"
                        }
                    ]
                },

                examples: {
                    invalidTitle: {
                        summary: "Title is too short",

                        value: {
                            success: false,
                            message: "validation failed",

                            errors: [
                                {
                                    code: "too_small",
                                    path: ["title"],
                                    message: "Too small: expected string to have >=3 characters"
                                }
                            ]
                        }
                    },

                    invalidAssignedToId: {
                        summary: "assignedToId is not a MongoDB ObjectId",

                        value: {
                            success: false,
                            message: "validation failed",

                            errors: [
                                {
                                    code: "invalid_format",
                                    path: ["assignedToId"],
                                    message: "Invalid MongoDB ObjectId"
                                }
                            ]
                        }
                    },

                    maximumTickets: {
                        summary: "User already has three open tickets",

                        value: {
                            success: false,
                            message: "you can have at most 3 open tickets"
                        }
                    }
                }
            }
        }
    },

    ReplyTicketForbidden: {
        description: "Reply is forbidden when the user is banned, lacks access to the ticket, the ticket is closed, or the ticket has already been assigned to a different staff member. In particular, once staff has claimed a ticket, the owner is currently blocked from replying because assignedTo no longer matches the owner id.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                examples: {
                    permanentBan: {
                        summary: "Permanent ban",

                        value: {
                            success: false,
                            message: "you are permanently banned. Reason: Spam"
                        }
                    },

                    noAccess: {
                        summary: "Ticket is not accessible to this user",

                        value: {
                            success: false,
                            message: "you don't have access to this ticket"
                        }
                    },

                    ticketClosed: {
                        summary: "Closed ticket",

                        value: {
                            success: false,
                            message: "this ticket is closed"
                        }
                    }
                }
            }
        }
    },

    TicketStatusBadRequest: {
        description: "The id/body is invalid, or the ticket already has the requested status.",

        content: {
            "application/json": {
                schema: {
                    oneOf: [
                        {
                            $ref: "#/components/schemas/Error"
                        },

                        {
                            $ref: "#/components/schemas/ValidationError"
                        }
                    ]
                },

                examples: {
                    invalidId: {
                        summary: "Invalid MongoDB ObjectId",

                        value: {
                            success: false,
                            message: "invalid id"
                        }
                    },

                    invalidStatus: {
                        summary: "newStatus is not pending/closed",

                        value: {
                            success: false,
                            message: "validation failed",

                            errors: [
                                {
                                    code: "invalid_value",
                                    path: ["newStatus"],
                                    message: "Invalid option"
                                }
                            ]
                        }
                    },

                    alreadySet: {
                        summary: "Ticket already has this status",

                        value: {
                            success: false,
                            message: "ticket already has this status"
                        }
                    }
                }
            }
        }
    },

    ChangeTicketStatusForbidden: {
        description: "Status change is forbidden when the user is banned, fails the route-level ticket access check, fails the service-level staff permission check, or a non-admin tries to reopen a closed ticket. The ticket owner can pass the route-level self check but normally fails the service-level permission check.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                examples: {
                    permanentBan: {
                        summary: "Permanent ban",

                        value: {
                            success: false,
                            message: "you are permanently banned. Reason: Spam"
                        }
                    },

                    noRouteAccess: {
                        summary: "No route-level access to this ticket",

                        value: {
                            success: false,
                            message: "you don't have access to this ticket"
                        }
                    },

                    cannotChange: {
                        summary: "Service-level permission denied",

                        value: {
                            success: false,
                            message: "you don't have permission to change this ticket"
                        }
                    },

                    cannotReopen: {
                        summary: "Teacher tries to reopen a closed ticket",

                        value: {
                            success: false,
                            message: "you can't reopen ticket"
                        }
                    }
                }
            }
        }
    },

    UserTicketsFetchedSuccessfully: {
        description: "Current user's tickets fetched successfully. User references are raw ObjectIds. An empty result is returned as the literal string `no ticket found`.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/UserTicketListResponse"
                },

                examples: {
                    withTickets: {
                        summary: "One or more tickets",

                        value: {
                            success: true,
                            message: "tickets fetched successfully",

                            data: [
                                {
                                    _id: "6857e4d1e5d82d0d1f5d8c40",
                                    title: "Cannot access my course",
                                    message: "I purchased a course but cannot access it.",
                                    userId: "6857e4d1e5d82d0d1f5d8c32",
                                    assignedTo: null,
                                    responsedBy: null,
                                    for: "admin",
                                    status: "open",
                                    replies: [],
                                    createdAt: "2026-08-21T10:00:00.000Z",
                                    updatedAt: "2026-08-21T10:00:00.000Z",
                                    __v: 0
                                }
                            ],

                            meta: {
                                totalNumber: 1,
                                totalPages: 1,
                                page: 1,
                                limit: 20
                            }
                        }
                    },

                    empty: {
                        summary: "No matching tickets",

                        value: {
                            success: true,
                            message: "tickets fetched successfully",
                            data: "no ticket found",

                            meta: {
                                totalNumber: 0,
                                totalPages: 0,
                                page: 1,
                                limit: 20
                            }
                        }
                    }
                }
            }
        }
    },

    StaffTicketsFetchedSuccessfully: {
        description: "Tickets visible to the authenticated admin/teacher were fetched successfully. User references are raw ObjectIds. Empty results are returned as an empty array.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/TicketListResponse"
                },

                example: {
                    success: true,
                    message: "tickets fetched successfully",
                    data: [],

                    meta: {
                        totalNumber: 0,
                        totalPages: 0,
                        page: 1,
                        limit: 20
                    }
                }
            }
        }
    },

    StaffTicketsForbidden: {
        description: "Staff listing is forbidden when the authenticated user is banned or has neither `admin` nor `teacher` role.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                examples: {
                    permanentBan: {
                        summary: "Permanent ban",

                        value: {
                            success: false,
                            message: "you are permanently banned. Reason: Spam"
                        }
                    },

                    wrongRole: {
                        summary: "Authenticated user is not admin/teacher",

                        value: {
                            success: false,
                            message: "you don't have permission"
                        }
                    }
                }
            }
        }
    },

    TicketFetchedSuccessfully: {
        description: "Single ticket fetched successfully. userId, assignedTo, and responsedBy are populated with _id/username/email; replies[].senderId remains a raw ObjectId.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/SingleTicketResponse"
                },

                example: {
                    success: true,
                    message: "ticket fetched successfully",

                    data: {
                        _id: "6857e4d1e5d82d0d1f5d8c40",
                        title: "Cannot access my course",
                        message: "I purchased a course but cannot access it.",

                        userId: {
                            _id: "6857e4d1e5d82d0d1f5d8c32",
                            username: "amir",
                            email: "amir@example.com"
                        },

                        assignedTo: null,
                        responsedBy: null,
                        for: "admin",
                        status: "open",
                        replies: [],
                        createdAt: "2026-08-21T10:00:00.000Z",
                        updatedAt: "2026-08-21T10:00:00.000Z",
                        __v: 0
                    }
                }
            }
        }
    },

    TicketReadForbidden: {
        description: "Reading a ticket is forbidden when the user is banned or fails the ticket-access middleware. The current read middleware allows the owner, the assigned staff member, or any admin.",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/Error"
                },

                examples: {
                    permanentBan: {
                        summary: "Permanent ban",

                        value: {
                            success: false,
                            message: "you are permanently banned. Reason: Spam"
                        }
                    },

                    noAccess: {
                        summary: "No access to this ticket",

                        value: {
                            success: false,
                            message: "you don't have access to this ticket"
                        }
                    }
                }
            }
        }
    }
}