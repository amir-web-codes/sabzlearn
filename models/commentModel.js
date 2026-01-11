const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 60
    },
    text: {
        type: String,
        requied: true,
        minlength: 3,
        maxlength: 300
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    rating: {
        type: String,
        enum: ["Very Bad", "Bad", "Medium", "Good", "Very Good"],
        default: "Medium"
    }
})

const commentModel = mongoose.model("Comment", commentSchema)

module.exports = commentModel