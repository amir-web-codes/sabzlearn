const mongoose = require("mongoose")
const { string } = require("zod")

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            courseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
                required: true
            },
            title: {
                type: String,
            },
            price: {
                type: Number,
                min: 0
            }
        }
    ],
    totalPrice: {
        type: Number,
        min: 0,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "paid", "failed", "processing", "cancelled"],
        default: "pending"
    }
}, { timestamps: true })

const orderModel = mongoose.model("Order", orderSchema)

module.exports = orderModel