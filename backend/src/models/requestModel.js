const mongoose = require("mongoose")

const requestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
        required: true
    },
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    processedAt: {
        type: Date,
        default: null
    },
    requestedRole: {
        type: String,
        enum: ["user", "teacher"],
        default: "teacher"
    },
    currentRole: {
        type: String,
        enum: ["user", "teacher", "admin"],
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }
}, { timestamps: true })

const requestModel = mongoose.model("Request", requestSchema)

module.exports = requestModel