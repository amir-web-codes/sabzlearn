const cartService = require("../services/cartService")
const courseService = require("../services/courseService")
const asyncWrapper = require("../utils/asyncWrapper")

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
    const foundCourse = await courseService.findPublishedCourseBySlug(req.params.slug, "title price finalPrice")

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
    await cartService.deleteItems(req.user.id)

    res.json({
        success: true,
        message: "cart items deleted successfully"
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

async function cartCheckout(req, res) {
    const data = await cartService.checkOut(req.user.id)

    res.json({
        success: true,
        message: "payment done successfully",
        data,
        meta: {
            pricePaid: data.totalPrice
        }
    })
}

async function getOrderById(req, res) {
    const data = await cartService.getOrderById(req.params.id)

    res.json({
        success: true,
        message: "order fetched successfully",
        data
    })
}

module.exports = {
    getUserCart: asyncWrapper(getUserCart),
    addNewItem: asyncWrapper(addNewItem),
    deleteUserCart: asyncWrapper(deleteUserCart),
    deleteItemBySlug: asyncWrapper(deleteItemBySlug),
    cartCheckout: asyncWrapper(cartCheckout),
    getOrderById: asyncWrapper(getOrderById)
}