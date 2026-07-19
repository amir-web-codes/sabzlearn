const mongoose = require("mongoose")
const cartModel = require("../models/cartModel")
const orderModel = require("../models/orderModel")
const courseModel = require("../models/courseModel")
const enrollmentModel = require("../models/enrollmentModel")

const invalidatePattern = require("../utils/invalidatePattern")

const MAX_CART_ITEMS = 50

async function withTransaction(session, fn) {
    while (true) {
        session.startTransaction()
        try {
            const result = await fn()
            await commitWithRetry(session)
            return result
        } catch (err) {
            await session.abortTransaction()
            if (err.errorLabels && err.errorLabels.includes("TransientTransactionError")) {
                continue
            }
            throw err
        }
    }
}

async function commitWithRetry(session) {
    while (true) {
        try {
            await session.commitTransaction()
            return
        } catch (err) {
            if (err.errorLabels && err.errorLabels.includes("UnknownTransactionCommitResult")) {
                continue
            }
            throw err
        }
    }
}

async function getCart(userId, session) {
    let cart = await cartModel
        .findOne({ userId })
        .session(session || null)

    if (!cart) {
        const [createdCart] = await cartModel.create(
            [{ userId, items: [] }],
            session ? { session } : {}
        )

        return {
            data: createdCart,
            totalPrice: 0
        }
    }

    const courseIds = cart.items.map(item => item.courseId)

    const courses = await courseModel
        .find({ _id: { $in: courseIds } })
        .session(session || null)

    const courseMap = new Map(
        courses.map(course => [course._id.toString(), course])
    )

    let totalPrice = 0
    let needsSave = false
    const validItems = []

    for (const item of cart.items) {
        const course = courseMap.get(item.courseId.toString())

        // course was deleted / unpublished -> drop it silently from the cart
        if (!course) {
            needsSave = true
            continue
        }

        if (item.price !== course.price) {
            item.oldPrice = item.price
            item.priceChanged = true
            item.price = course.price
            needsSave = true
        } else if (item.priceChanged) {
            // price matches again (or is being synced for the first time) -> clear the flag
            item.priceChanged = false
            item.oldPrice = 0
            needsSave = true
        }

        if (item.title !== course.title) {
            item.title = course.title
            needsSave = true
        }

        totalPrice += course.price
        validItems.push(item)
    }

    if (needsSave) {
        cart.items = validItems
        await cart.save({ session: session || undefined })
    }

    return {
        data: cart,
        totalPrice
    }
}

async function createItem(userId, course) {
    const foundEnrollment = await enrollmentModel.exists({
        userId,
        courseId: course._id,
        status: { $ne: "closed" }
    })

    if (foundEnrollment) {
        const err = new Error("you already own this course")
        err.status = 400
        throw err
    }

    await cartModel.updateOne(
        { userId },
        { $setOnInsert: { items: [] } },
        { upsert: true }
    )

    const data = await cartModel.findOneAndUpdate(
        {
            userId,
            "items.courseId": { $ne: course._id },
            $expr: { $lt: [{ $size: "$items" }, MAX_CART_ITEMS] }
        },
        {
            $push: {
                items: {
                    title: course.title,
                    courseId: course._id,
                    price: course.price,
                    oldPrice: 0,
                    priceChanged: false
                }
            }
        },
        { new: true }
    )

    if (!data) {
        const cart = await cartModel.findOne({ userId })

        const exists = cart.items.some(
            item => item.courseId.toString() === course._id.toString()
        )

        if (exists) {
            const err = new Error("course already exists in cart")
            err.status = 409
            throw err
        }

        if (cart.items.length >= MAX_CART_ITEMS) {
            const err = new Error(`cart can contain at most ${MAX_CART_ITEMS} items`)
            err.status = 400
            throw err
        }

        const err = new Error("failed to add item")
        err.status = 500
        throw err
    }

    const totalPrice = data.items.reduce((sum, item) => sum + item.price, 0)

    return { data, totalPrice }
}

async function deleteItems(userId, session = null) {
    const options = { new: true, upsert: true }

    if (session) {
        options.session = session
    }

    const cart = await cartModel.findOneAndUpdate(
        { userId },
        { $set: { items: [] } },
        options
    )

    return cart
}

async function deleteBySlug(userId, slug) {
    const foundCourse = await courseModel.findOne({ slug }).select("_id")

    if (!foundCourse) {
        const err = new Error("course not found")
        err.status = 404
        throw err
    }

    await getCart(userId)

    const data = await cartModel.findOneAndUpdate(
        { userId },
        { $pull: { items: { courseId: foundCourse._id } } },
        { new: true, upsert: true }
    )

    let totalPrice = 0
    data.items.forEach(item => totalPrice += item.price)

    return { data, totalPrice }
}

async function createOrder(userId) {
    const session = await mongoose.startSession()

    try {
        return await withTransaction(session, async () => {
            const { data, totalPrice } = await getCart(userId, session)

            if (!data.items.length) {
                const err = new Error("no items in cart")
                err.status = 400
                throw err
            }

            if (data.items.some(item => item.priceChanged)) {
                const err = new Error("some items' prices have changed, please review your cart")
                err.status = 409
                err.code = "PRICE_CHANGED"
                throw err
            }

            const [order] = await orderModel.create(
                [{ userId, items: data.items, totalPrice, status: "pending" }],
                { session }
            )

            return order
        })
    } finally {
        await session.endSession()
    }
}

async function completeOrder(orderId, userId) {
    const session = await mongoose.startSession()

    try {
        return await withTransaction(session, async () => {
            const order = await orderModel.findOne({ _id: orderId, userId }).session(session)

            if (!order) {
                const err = new Error("order not found")
                err.status = 404
                throw err
            }

            if (order.status === "paid") {
                return order // idempotency guard
            }

            if (order.status !== "pending") {
                const err = new Error(`cannot complete an order with status "${order.status}"`)
                err.status = 400
                throw err
            }

            order.status = "paid"
            await order.save({ session })

            for (const item of order.items) {
                await enrollmentModel.updateOne(
                    { userId, courseId: item.courseId },
                    { $setOnInsert: { userId, courseId: item.courseId, status: "active" } },
                    { upsert: true, session }
                )
            }

            await deleteItems(userId, session)
            invalidatePattern(`courses:users:${userId}:*`)

            return order
        })
    } finally {
        await session.endSession()
    }
}

async function failOrder(orderId, userId, reason) {
    const order = await orderModel.findOneAndUpdate(
        { _id: orderId, userId, status: "pending" },
        { $set: { status: "failed", failReason: reason || "payment failed" } },
        { new: true }
    )

    if (!order) {
        const err = new Error("pending order not found")
        err.status = 404
        throw err
    }

    return order
}

async function checkOut(userId) {
    const order = await createOrder(userId)
    return completeOrder(order._id, userId)
}

async function getOrderById(id, userId) {
    const filter = userId ? { _id: id, userId } : { _id: id }
    const data = await orderModel.findOne(filter).lean()

    if (!data) {
        const err = new Error("order not found")
        err.status = 404
        throw err
    }

    return data
}

module.exports = {
    getCart,
    createItem,
    deleteItems,
    deleteBySlug,
    checkOut,
    createOrder,
    completeOrder,
    failOrder,
    getOrderById
}