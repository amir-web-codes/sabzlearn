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
        min: 0,
        default: 0
    },
    discountPrecentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    finalPrice: {
        type: Number,
        min: 0,
        default: 0,
        index: true
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
        type: Number,
        default: 0
    },
    thumbnail: {
        url: {
            type: String,
            default: "/images/default-thumbnail.png"
        },
        publicId: {
            type: String,
            default: null
        }
    },
    coverVideoURL: {
        url: {
            type: String,
            default: null
        },
        publicId: {
            type: String,
            default: null
        }
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    deletedAt: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["draft", "published", "archived", "closed"],
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

courseSchema.pre("save", function (next) {
    if (this.isModified("price") || this.isModified("discountPrecentage")) {
        const discountAmount = this.price * (this.discountPrecentage / 100)
        this.finalPrice = Math.round((this.price - discountAmount) * 100) / 100
    }
    next()
})

const courseModel = mongoose.model("Course", courseSchema)

module.exports = courseModel