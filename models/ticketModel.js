const mongoose = require("mongoose")

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 150
    },
    message: {
        type: String,
        required: true,
        maxlength: 1000
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    responsedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    for: {
        type: String,
        enum: ["admin", "teacher"],
        default: "admin"
    },
    status: {
        type: String,
        enum: ["open", "pending", "closed"],
        index: true,
        default: "open"
    },
    replies: [
        {
            senderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            message: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true })

const ticketModel = mongoose.model("Ticket", ticketSchema)

module.exports = ticketModel