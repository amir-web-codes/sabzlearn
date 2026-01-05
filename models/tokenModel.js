const mongoose = require("mongoose")

const tokenSchema = new mongoose.Schema({
    hashedToken: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    revoked: {
        type: Boolean,
        required: true
    },
    deviceId: {
        type: String,
        required: true
    },
    userAgent: {
        type: String
    },
    expiresAt: {
        type: Date
    }
}, { timestamps: true })

const tokenModel = mongoose.model("Token", tokenSchema)

module.exports = tokenModel