const cartModel = require("../models/cartModel")
const courseModel = require("../models/courseModel")

async function getCart(userId) {
    let data = await cartModel.findOne({ userId })
    let totalPrice = 0

    if (!data) {
        data = await cartModel.create({
            userId,
            items: []
        })

        return { data, totalPrice }
    }

    const courseIds = data.items.map(item => item.courseId)

    const courses = await courseModel.find({
        _id: { $in: courseIds }
    })

    const courseMap = new Map(
        courses.map(course => [course._id.toString(), course])
    )

    for (const item of data.items) {
        const course = courseMap.get(item.courseId.toString())

        if (!course) continue

        if (item.price !== course.price) {
            item.oldPrice = item.price
            item.price = course.price
            item.priceChanged = true
        } else {
            item.priceChanged = false
        }
    }


    data.items.forEach(item => totalPrice += item.price)

    await data.save()

    return { data, totalPrice }
}

async function createItem(userId, course) {
    let data = await cartModel.findOne({ userId })
    let totalPrice = 0;

    if (!data) {
        data = cartModel.create({
            userId,
            items: [{
                title: course.title,
                courseId: course._id,
                price: course.price,
                oldPrice: 0,
                priceChanged: false
            }]
        })
        return data
    }

    const exists = data.items.some(
        item => item.courseId.toString() === course._id.toString()
    )

    if (data.items.length >= 50) {
        const err = new Error("you can't add more than 50 items in your cart")
        err.status = 400
        throw err
    }

    if (!exists) {
        data.items.push({
            title: course.title,
            courseId: course._id,
            price: course.price,
            oldPrice: 0,
            priceChanged: false
        })


        await data.save()
    }

    data.items.forEach(item => totalPrice += item.price)

    return { data, totalPrice }
}

module.exports = {
    getCart,
    createItem
}