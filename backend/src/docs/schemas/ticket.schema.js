module.exports = {

    TicketReply: {
        type: "object",
        description: "A single reply inside a ticket conversation",
        properties: {
            message: {
                type: "string",
                example: "Thank you for your help."
            },
            senderId: {
                type: "string",
                nullable: true,
                example: "6857e4d1e5d82d0d1f5d8c32"
            },
            createdAt: {
                type: "string",
                format: "date-time",
                example: "2026-07-26T12:30:00.000Z"
            }
        }
    },


    Ticket: {
        type: "object",
        description: "Support ticket object",
        properties: {

            _id: {
                type: "string",
                example: "6857e4d1e5d82d0d1f5d8c40"
            },

            title: {
                type: "string",
                example: "Cannot access my course"
            },

            message: {
                type: "string",
                example: "I bought a course but it is not visible in my dashboard."
            },

            userId: {
                type: "string",
                example: "6857e4d1e5d82d0d1f5d8c32"
            },

            assignedTo: {
                type: "string",
                nullable: true,
                example: "6857e4d1e5d82d0d1f5d8c99"
            },

            responsedBy: {
                type: "string",
                nullable: true,
                example: "6857e4d1e5d82d0d1f5d8c99"
            },

            for: {
                type: "string",
                enum: [
                    "admin",
                    "teacher"
                ],
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
                format: "date-time"
            },

            updatedAt: {
                type: "string",
                format: "date-time"
            }
        },

        required: [
            "title",
            "message",
            "userId",
            "for",
            "status"
        ]
    },


    PopulatedUserReference: {
        type: "object",
        nullable: true,
        description: "Populated user information",
        properties: {

            _id: {
                type: "string",
                example: "6857e4d1e5d82d0d1f5d8c32"
            },

            username: {
                type: "string",
                example: "amir"
            },

            email: {
                type: "string",
                example: "amir@example.com"
            }
        }
    },


    TicketPopulated: {
        type: "object",
        description: "Ticket with user references populated",
        allOf: [
            {
                $ref: "#/components/schemas/Ticket"
            },
            {
                type: "object",
                properties: {

                    userId: {
                        $ref: "#/components/schemas/PopulatedUserReference"
                    },

                    assignedTo: {
                        $ref: "#/components/schemas/PopulatedUserReference"
                    },

                    responsedBy: {
                        $ref: "#/components/schemas/PopulatedUserReference"
                    }
                }
            }
        ]
    },


    CreateTicket: {
        type: "object",
        description: "Request body for creating a new ticket",

        properties: {

            title: {
                type: "string",
                minLength: 3,
                maxLength: 150,
                example: "Cannot access my course"
            },

            message: {
                type: "string",
                maxLength: 1000,
                example: "I purchased a course but cannot access it."
            },

            assignedToId: {
                type: "string",
                nullable: true,
                pattern: "^[a-fA-F0-9]{24}$",
                example: "6857e4d1e5d82d0d1f5d8c99",
                description: "Optional user id. If provided, ticket will be assigned to admin or teacher based on target user's role."
            }
        },

        required: [
            "title",
            "message"
        ]
    },


    ReplyMessage: {
        type: "object",

        description: "Request body for replying to a ticket",

        properties: {

            message: {
                type: "string",
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

        description: "Request body for changing ticket status",

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


    TicketListResponse: {
        type: "object",

        properties: {

            success: {
                type: "boolean",
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
        }
    },


    SingleTicketResponse: {
        type: "object",

        properties: {

            success: {
                type: "boolean",
                example: true
            },

            message: {
                type: "string",
                example: "ticket fetched successfully"
            },

            data: {
                $ref: "#/components/schemas/TicketPopulated"
            }
        }
    },


    TicketResponse: {
        type: "object",

        properties: {

            success: {
                type: "boolean",
                example: true
            },

            message: {
                type: "string",
                example: "ticket created successfully"
            },

            data: {
                $ref: "#/components/schemas/Ticket"
            }
        }
    }

}