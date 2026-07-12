module.exports = {
    TicketNotFound: {
        description: "Ticket not found",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "ticket not found" }
            }
        }
    },
    TicketClosed: {
        description: "Ticket is closed and cannot receive new replies",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "this ticket is closed" }
            }
        }
    },
    NoAccessToTicket: {
        description: "User does not have access to this ticket",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "you don't have access to this ticket" }
            }
        }
    },
    MaxTicketsReached: {
        description: "User has reached the maximum number of tickets (3)",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "maximum 3 tickets" }
            }
        }
    },
    StatusAlreadySet: {
        description: "Ticket already has the requested status",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "ticket already has this status" }
            }
        }
    },
    NoPermissionChangeStatus: {
        description: "User does not have permission to change this ticket's status",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "you don't have permission to change this ticket" }
            }
        }
    },
    CannotReopenTicket: {
        description: "Only an admin can reopen a closed ticket",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "you can't reopen ticket" }
            }
        }
    },
    TooManyTickets: {
        description: "Too many tickets created recently (5 per 30 minutes)",
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { success: false, message: "you're sending too many tickets, please try again later" }
            }
        }
    }
}