const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null,
        index: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    icon: {
        url: {
            type: String,
            default: null
        },
        publicId: {
            type: String,
            default: null
        }
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
        index: true
    }
}, {
    timestamps: true
})

categorySchema.index({ parent: 1, status: 1 })
categorySchema.index({ status: 1, sortOrder: 1 })

const categoryModel = mongoose.model("Category", categorySchema)

module.exports = categoryModel