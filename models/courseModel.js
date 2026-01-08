const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    discountPrice: {
        type: Number
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    level: {
        type: String,
        required: true,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner"
    },
    language: {
        type: String,
        required: true,
        enum: ["en", "fa"],
        default: "fa"
    },
    studentsCount: {
        type: Number
    },
    // thumbnail: {
    //     type: String
    // },
    // coverVideoURL: {
    //     type: String,
    //     required: true
    // },
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft"
    },
    rating: {
        average: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    }
}, { timestamps: true })

const courseModel = mongoose.model("Course", courseSchema)

module.exports = courseModel