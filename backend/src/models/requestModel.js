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
        enum: ["user", "teacher", "admin"],
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

requestSchema.index(
    {
        userId: 1,
        status: 1
    },
    {
        unique: true,
        partialFilterExpression: {
            status: "pending"
        },
        name: "unique_pending_role_request_per_user"
    }
)

const requestModel = mongoose.model("Request", requestSchema)

module.exports = requestModel