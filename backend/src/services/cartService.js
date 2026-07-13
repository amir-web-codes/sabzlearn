const mongoose = require("mongoose")
const cartModel = require("../models/cartModel")
const orderModel = require("../models/orderModel")
const courseModel = require("../models/courseModel")
const enrollmentModel = require("../models/enrollmentModel")


async function getCart(userId, session) {
    const queryOptions = session ? { session } : {};

    let cart = await cartModel
        .findOne({ userId })
        .session(session || null);


    if (!cart) {
        const [createdCart] = await cartModel.create(
            [
                {
                    userId,
                    items: []
                }
            ],
            queryOptions
        );

        return {
            data: createdCart,
            totalPrice: 0
        };
    }


    const courseIds = cart.items.map(
        item => item.courseId
    );


    const courses = await courseModel
        .find({
            _id: {
                $in: courseIds
            }
        })
        .session(session || null);


    const courseMap = new Map(
        courses.map(course => [
            course._id.toString(),
            course
        ])
    );


    let totalPrice = 0;


    const validItems = [];

    for (const item of cart.items) {

        const course = courseMap.get(
            item.courseId.toString()
        );

        if (!course) {
            continue;
        }


        if (item.price !== course.price) {
            item.oldPrice = item.price;
            item.priceChanged = true;
        }

        item.price = course.price;

        totalPrice += course.price;

    }


    if (validItems.length !== cart.items.length) {

        cart.items = validItems;

        await cart.save({
            session
        });
    }

    return {
        data: cart,
        totalPrice
    };
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
        {
            $setOnInsert: {
                items: []
            }
        },
        {
            upsert: true
        }
    )

    const data = await cartModel.findOneAndUpdate(
        {
            userId,
            "items.courseId": { $ne: course._id },
            $expr: {
                $lt: [
                    { $size: "$items" },
                    50
                ]
            }
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
        {
            new: true
        }
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

        if (cart.items.length >= 50) {
            const err = new Error("cart can contain at most 50 items")
            err.status = 400
            throw err
        }

        const err = new Error("failed to add item")
        err.status = 500
        throw err
    }

    const totalPrice = data.items.reduce(
        (sum, item) => sum + item.price,
        0
    )

    return {
        data,
        totalPrice
    }
}

async function deleteItems(userId, session = null) {

    const options = {
        new: true,
        upsert: true
    }

    if (session) {
        options.session = session
    }

    let oldCart = await cartModel.findOneAndUpdate(
        { userId },
        {
            $set: {
                items: []
            }
        },
        options
    )
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
        {
            $pull: {
                items: {
                    courseId: foundCourse._id
                }
            }
        },
        {
            new: true,
            upsert: true
        }
    )

    let totalPrice = 0
    data.items.forEach(item => totalPrice += item.price)

    return { data, totalPrice }
}

async function checkOut(userId) {
    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        const { data, totalPrice } = await getCart(userId, session)

        if (!data.items.length) {
            const err = new Error("no items in cart")
            err.status = 400
            throw err
        }

        const pendingOrder = (await orderModel.create([{
            userId,
            items: data.items,
            totalPrice,
            status: "pending"
        }], { session }))[0]

        const order = await orderModel.findOneAndUpdate(
            { _id: pendingOrder._id },
            { $set: { status: "paid" } },
            { session, new: true }
        )


        for (const item of data.items) {
            await enrollmentModel.updateOne(
                { userId, courseId: item.courseId },
                { $setOnInsert: { userId, courseId: item.courseId, status: "active" } },
                { upsert: true, session }
            )
        }

        await deleteItems(userId, session)


        await session.commitTransaction()

        return order

    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
}

async function getOrderById(id) {
    const data = await orderModel.findById(id).lean()

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
    getOrderById
}