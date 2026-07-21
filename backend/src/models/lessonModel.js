const mongoose = require("mongoose")

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 5,
        maxlength: 150,
        required: true
    },
    description: {
        type: String
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    publisherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    video: {
        url: {
            type: String,
            default: null
        },
        publicId: {
            type: String,
            default: null
        }
    },
    duration: {
        type: Number,
        default: 0,
        required: true
    }
}, { timestamps: true })

const lessonModel = mongoose.model("Lesson", lessonSchema)

module.exports = lessonModel