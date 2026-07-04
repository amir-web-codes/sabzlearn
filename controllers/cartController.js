const cartService = require("../services/cartService")
const courseService = require("../services/courseService")

async function getUserCart(req, res) {

}

async function addNewItem(req, res) {

    const foundCourse = await courseService.findCourseBySlug(req.params.slug, "title price")
    const data = await cartService.createItem(req.user.id, foundCourse)

    res.status(201).json({
        success: true,
        message: "item added successfully",
        data
    })
}

module.exports = {
    getUserCart,
    addNewItem
}