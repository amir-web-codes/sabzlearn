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
    }
}, { timestamps: true })

const tokenModel = mongoose.model("Token", tokenSchema)

module.exports = tokenModel