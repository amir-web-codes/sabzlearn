const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

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

tokenSchema.pre("save", async function () {
    if (!this.isModified("hashedToken")) { return }
    this.hashedToken = await bcrypt.hash(this.hashedToken, 12)
})

const tokenModel = mongoose.model("Token", tokenSchema)

module.exports = tokenModel