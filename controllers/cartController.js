const cartService = require("../services/cartService")
const courseService = require("../services/courseService")

async function getUserCart(req, res) {
    const { data, totalPrice } = await cartService.getCart(req.user.id)

    res.json({
        success: true,
        message: "cart fetched successfully",
        data,
        meta: {
            totalItems: data.items.length || 0,
            totalPrice
        }
    })
}

async function addNewItem(req, res) {

    const foundCourse = await courseService.findCourseBySlug(req.params.slug, "title price")
    const { data, totalPrice } = await cartService.createItem(req.user.id, foundCourse)

    res.status(201).json({
        success: true,
        message: "item added successfully",
        data,
        meta: {
            totalItems: data.items.length || 0,
            totalPrice
        }
    })
}

async function deleteUserCart(req, res) {
    const oldCart = await cartService.deleteItem(req.user.id)

    res.json({
        success: true,
        message: "cart items deleted successfully",
        meta: {
            deletedItems: oldCart.items.length
        }
    })
}

module.exports = {
    getUserCart,
    addNewItem,
    deleteUserCart
}