const mongoose = require("mongoose")
const { number } = require("zod")

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

const cartModel = mongoose.model("Cart", cartSchema)

module.exports = cartModel