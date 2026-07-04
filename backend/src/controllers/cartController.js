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
    const oldCart = await cartService.deleteItems(req.user.id)

    res.json({
        success: true,
        message: "cart items deleted successfully",
        meta: {
            deletedItems: oldCart.items.length
        }
    })
}

async function deleteItemBySlug(req, res) {
    const { data, totalPrice } = await cartService.deleteBySlug(req.user.id, req.params.slug)

    res.json({
        success: true,
        message: "course deleted successfully from cart",
        meta: {
            totalItems: data.items.length,
            totalPrice
        }
    })
}

module.exports = {
    getUserCart,
    addNewItem,
    deleteUserCart,
    deleteItemBySlug
}