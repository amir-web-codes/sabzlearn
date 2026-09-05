const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            title: String,
            courseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
                index: true,
                required: true
            },
            price: {
                type: Number,
                min: 0,
                default: 0
            },
            oldPrice: {
                type: Number,
                min: 0,
                default: 0
            },
            priceChanged: {
                type: Boolean,
                default: false
            }
        }
    ]
}, { timestamps: true })

cartSchema.index({ userId: 1, "items.courseId": 1 }, { unique: true })
cartSchema.index({ userId: 1 }, { unique: true })

const cartModel = mongoose.model("Cart", cartSchema)

module.exports = cartModel