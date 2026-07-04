const cartModel = require("../models/cartModel")

async function createItem(userId, course) {
    const cart = await cartModel.findOne({ userId })

    if (!cart) {
        return cartModel.create({
            userId,
            items: [{
                title: course.title,
                courseId: course._id,
                price: course.price,
                oldPrice: 0,
                priceChanged: false
            }]
        })
    }

    const exists = cart.items.some(
        item => item.courseId.toString() === course._id.toString()
    )

    if (!exists) {
        cart.items.push({
            title: course.title,
            courseId: course._id,
            price: course.price,
            oldPrice: 0,
            priceChanged: false
        })

        await cart.save()
    }

    return cart
}

module.exports = {
    createItem
}