const mongoose = require("mongoose")

const enrollmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ["active", "completed", "cancelled"],
        default: "active"
    },
    progress: {
        type: String,
        default: 0
    },
    lastAccessedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true })

const enrollmentModel = mongoose.model("Enrollment", enrollmentSchema)

module.exports = enrollmentModel