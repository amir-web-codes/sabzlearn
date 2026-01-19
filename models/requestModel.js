const mongoose = require("mongoose")

const requestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    acceptedAt: {
        type: Date,
        default: null
    },
    requestedRole: {
        type: String,
        enum: ["user", "teacher"],
        default: "teacher"
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "cancelled"],
        default: "pending"
    }
}, { timestamps: true })

const requestModel = mongoose.model("Request", requestSchema)

module.exports = requestModel