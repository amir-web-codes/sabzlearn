module.exports = {
    TicketReply: {
        type: "object",
        description: "A single reply/message within a ticket thread",
        properties: {
            message: { type: "string", example: "Thanks, I'll look into it." },
            senderId: { type: "string", example: "6857e4d1e5d82d0d1f5d8c32" },
            createdAt: { type: "string", format: "date-time", example: "2026-07-09T18:30:00.000Z" }
        }
    },

    Ticket: {
        type: "object",
        properties: {
            _id: { type: "string", example: "6857e4d1e5d82d0d1f5d8c40" },
            title: { type: "string", example: "Can't access my course" },
            message: { type: "string", example: "I purchased the React course but it doesn't show up in my dashboard." },
            userId: { type: "string", example: "6857e4d1e5d82d0d1f5d8c32" },
            assignedTo: { type: "string", nullable: true, example: "6857e4d1e5d82d0d1f5d8c99" },
            responsedBy: { type: "string", nullable: true, example: "6857e4d1e5d82d0d1f5d8c99" },
            for: { type: "string", enum: ["teacher", "admin"], example: "admin" },
            status: { type: "string", enum: ["open", "pending", "closed"], example: "open" },
            replies: {
                type: "array",
                items: { $ref: "#/components/schemas/TicketReply" }
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
        },
        required: ["title", "message", "userId", "for", "status"]
    },

    PopulatedUserRef: {
        type: "object",
        nullable: true,
        description: "Populated user reference (only _id, username, email)",
        properties: {
            _id: { type: "string", example: "6857e4d1e5d82d0d1f5d8c32" },
            username: { type: "string", example: "amir" },
            email: { type: "string", example: "amir@gmail.com" }
        }
    },

    TicketPopulated: {
        description: "Ticket with userId, responsedBy and assignedTo populated with username/email",
        allOf: [
            { $ref: "#/components/schemas/Ticket" },
            {
                type: "object",
                properties: {
                    userId: { $ref: "#/components/schemas/PopulatedUserRef" },
                    assignedTo: { $ref: "#/components/schemas/PopulatedUserRef" },
                    responsedBy: { $ref: "#/components/schemas/PopulatedUserRef" }
                }
            }
        ]
    },

    CreateTicket: {
        type: "object",
        properties: {
            title: { type: "string", minLength: 3, maxLength: 150, example: "Can't access my course" },
            message: { type: "string", maxLength: 1000, example: "I purchased the React course but it doesn't show up in my dashboard." },
            teacherId: {
                type: "string",
                pattern: "^[a-fA-F0-9]{24}$",
                example: "6857e4d1e5d82d0d1f5d8c99",
                description: "If this field is provided, the ticket will be assigned directly to the specified teacher(for: \"teacher\"). Otherwise, the ticket will be submitted to administrators (for: \"admin\").}'
            },
            required: ["title", "message"]
        },
    },

    ReplyMessage: {
        type: "object",
        properties: {
            message: { type: "string", maxLength: 1000, example: "Thanks, I'll look into it." }
        },
        required: ["message"]
    },

    ChangeTicketStatus: {
        type: "object",
        properties: {
            newStatus: { type: "string", enum: ["pending", "closed"], example: "closed" }
        },
        required: ["newStatus"]
    }
}