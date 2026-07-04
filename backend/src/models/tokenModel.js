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
        required: true,
        index: true
    },
    revoked: {
        type: Boolean,
        required: true
    },
    deviceId: {
        type: String,
        required: true,
        index: true
    },
    userAgent: {
        type: String
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    }
}, { timestamps: true })

tokenSchema.pre("save", async function () {
    if (!this.isModified("hashedToken")) { return }
    this.hashedToken = await bcrypt.hash(this.hashedToken, 12)
})

const tokenModel = mongoose.model("Token", tokenSchema)

module.exports = tokenModel