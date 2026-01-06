const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 70
    },
    role: {
        type: String,
        enum: ["user", "admin", "teacher"],
        default: "user",
        required: true
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    banReason: {
        type: String,
        default: null
    },
    banExpiresAt: {
        type: Date,
        default: null
    }
}, { timestamps: true })

userSchema.pre("save", async function () {
    if (!this.isModified("password")) { return }
    this.password = await bcrypt.hash(this.password, 12)
})


const userModel = mongoose.model("User", userSchema)

module.exports = userModel