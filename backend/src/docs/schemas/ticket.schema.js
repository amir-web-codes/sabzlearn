module.exports = {
    TicketReply: {
        type: "object",
        description: "A reply subdocument stored inside a ticket. Reply sender ids are not populated by the current ticket endpoints.",

        properties: {
            _id: {
                type: "string",
                pattern: "^[a-fA-F0-9]{24}$",
                readOnly: true,
                example: "6857e4d1e5d82d0d1f5d8c55"
            },

            message: {
                type: "string",
                minLength: 1,
                maxLength: 1000,
                example: "We are checking your issue."
            },

            senderId: {
                type: "string",
                pattern: "^[a-fA-F0-9]{24}$",
                example: "6857e4d1e5d82d0d1f5d8c32"
            },

            createdAt: {
                type: "string",
                format: "date-time",
                readOnly: true,
                example: "2026-08-21T10:30:00.000Z"
            }
        },

        required: [
            "_id",
            "message",
            "senderId",
            "createdAt"
        ]
    },

    TicketBase: {
        type: "object",
        description: "Fields shared by raw and populated ticket responses.",

        properties: {
            _id: {
                type: "string",
                pattern: "^[a-fA-F0-9]{24}$",
                readOnly: true,
                example: "6857e4d1e5d82d0d1f5d8c40"
            },

            title: {
                type: "string",
                minLength: 3,
                maxLength: 150,
                example: "Cannot access my course"
            },

            message: {
                type: "string",
                minLength: 1,
                maxLength: 1000,
                example: "I purchased a course but cannot access it."
            },

            for: {
                type: "string",
                enum: [
                    "admin",
                    "teacher"
                ],
                description: "Ticket destination. It is `admin` when assignedToId is omitted or points to an admin, and `teacher` when assignedToId points to a teacher.",
                example: "admin"
            },

            status: {
                type: "string",
                enum: [
                    "open",
                    "pending",
                    "closed"
                ],
                example: "open"
            },

            replies: {
                type: "array",
                items: {
                    $ref: "#/components/schemas/TicketReply"
                }
            },

            createdAt: {
                type: "string",
                format: "date-time",
                readOnly: true,
                example: "2026-08-21T10:00:00.000Z"
            },

            updatedAt: {
                type: "string",
                format: "date-time",
                readOnly: true,
                example: "2026-08-21T10:30:00.000Z"
            },

            __v: {
                type: "integer",
                minimum: 0,
                readOnly: true,
                example: 0
            }
        },

        required: [
            "_id",
            "title",
            "message",
            "for",
            "status",
            "replies",
            "createdAt",
            "updatedAt",
            "__v"
        ]
    },

    Ticket: {
        allOf: [
            {
                $ref: "#/components/schemas/TicketBase"
            },

            {
                type: "object",
                description: "Ticket shape returned by create/reply/list endpoints. User references are raw MongoDB ObjectIds.",

                properties: {
                    userId: {
                        type: "string",
                        pattern: "^[a-fA-F0-9]{24}$",
                        example: "6857e4d1e5d82d0d1f5d8c32"
                    },

                    assignedTo: {
                        type: "string",
                        pattern: "^[a-fA-F0-9]{24}$",
                        nullable: true,
                        example: null
                    },

                    responsedBy: {
                        type: "string",
                        pattern: "^[a-fA-F0-9]{24}$",
                        nullable: true,
                        example: null,
                        description: "Exact field name used by the backend. It is set when a non-owner staff member replies."
                    }
                },

                required: [
                    "userId",
                    "assignedTo",
                    "responsedBy"
                ]
            }
        ]
    },

    TicketPopulated: {
        allOf: [
            {
                $ref: "#/components/schemas/TicketBase"
            },

            {
                type: "object",
                description: "Ticket shape returned by GET /tickets/{id}. Top-level user references are populated with _id/username/email, while replies[].senderId remains a raw ObjectId.",

                properties: {
                    userId: {
                        $ref: "#/components/schemas/PopulatedUserReference"
                    },

                    assignedTo: {
                        $ref: "#/components/schemas/NullablePopulatedUserReference"
                    },

                    responsedBy: {
                        $ref: "#/components/schemas/NullablePopulatedUserReference"
                    }
                },

                required: [
                    "userId",
                    "assignedTo",
                    "responsedBy"
                ]
            }
        ]
    },

    CreateTicket: {
        type: "object",
        description: "JSON body for creating a support ticket.",

        properties: {
            title: {
                type: "string",
                minLength: 3,
                maxLength: 150,
                example: "Cannot access my course"
            },

            message: {
                type: "string",
                minLength: 1,
                maxLength: 1000,
                example: "I purchased a course but cannot access it."
            },

            assignedToId: {
                type: "string",
                pattern: "^[a-fA-F0-9]{24}$",
                description: "Optional target user id. If supplied, the target must exist and currently have role `admin` or `teacher`. JSON null is not accepted by the current validator.",
                example: "6857e4d1e5d82d0d1f5d8c99"
            }
        },

        required: [
            "title",
            "message"
        ]
    },

    ReplyMessage: {
        type: "object",
        description: "JSON body for adding a reply to a ticket.",

        properties: {
            message: {
                type: "string",
                minLength: 1,
                maxLength: 1000,
                example: "We are checking your issue."
            }
        },

        required: [
            "message"
        ]
    },

    ChangeTicketStatus: {
        type: "object",
        description: "JSON body for changing ticket status. The current API does not accept `open` as a target status.",

        properties: {
            newStatus: {
                type: "string",
                enum: [
                    "pending",
                    "closed"
                ],
                example: "closed"
            }
        },

        required: [
            "newStatus"
        ]
    },

    TicketResponse: {
        type: "object",
        description: "Success response used by ticket creation and ticket reply endpoints.",

        properties: {
            success: {
                type: "boolean",
                enum: [true],
                example: true
            },

            message: {
                type: "string",
                example: "ticket created successfully"
            },

            data: {
                $ref: "#/components/schemas/Ticket"
            }
        },

        required: [
            "success",
            "message",
            "data"
        ]
    },

    UserTicketListResponse: {
        type: "object",
        description: "Response for GET /tickets/me. The endpoint returns the literal string `no ticket found` instead of an empty array when there are no matches.",

        properties: {
            success: {
                type: "boolean",
                enum: [true],
                example: true
            },

            message: {
                type: "string",
                example: "tickets fetched successfully"
            },

            data: {
                oneOf: [
                    {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/Ticket"
                        }
                    },

                    {
                        type: "string",
                        enum: [
                            "no ticket found"
                        ],
                        example: "no ticket found"
                    }
                ]
            },

            meta: {
                $ref: "#/components/schemas/PaginationMeta"
            }
        },

        required: [
            "success",
            "message",
            "data",
            "meta"
        ]
    },

    TicketListResponse: {
        type: "object",
        description: "Response for GET /tickets/admin/get-all. Unlike GET /tickets/me, an empty result is returned as an empty array.",

        properties: {
            success: {
                type: "boolean",
                enum: [true],
                example: true
            },

            message: {
                type: "string",
                example: "tickets fetched successfully"
            },

            data: {
                type: "array",
                items: {
                    $ref: "#/components/schemas/Ticket"
                }
            },

            meta: {
                $ref: "#/components/schemas/PaginationMeta"
            }
        },

        required: [
            "success",
            "message",
            "data",
            "meta"
        ]
    },

    SingleTicketResponse: {
        type: "object",
        description: "Response for GET /tickets/{id}.",

        properties: {
            success: {
                type: "boolean",
                enum: [true],
                example: true
            },

            message: {
                type: "string",
                example: "ticket fetched successfully"
            },

            data: {
                $ref: "#/components/schemas/TicketPopulated"
            }
        },

        required: [
            "success",
            "message",
            "data"
        ]
    }
}