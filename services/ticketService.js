const ticketModel = require("../models/ticketModel")

async function createTicket(userId, { title, message, teacherId }) {
    return await ticketModel.create({
        title,
        message,
        userId,
        assignedTo: teacherId,
        for: teacherId ? "teacher" : "admin",
        status: "open"
    })
}

async function findUserTickets(userId, page, limit) {
    const data = await ticketModel.find({ userId }).skip((page - 1) * limit).limit(limit).lean()
    const totalNumber = await ticketModel.countDocuments({ userId })
    return { data, totalNumber }
}

async function findTicketById(ticketId) {
    const ticket = await ticketModel.findById(ticketId)

    if (!ticket) {
        const err = new Error("ticket not found")
        err.status = 404
        throw err
    }

    return ticket
}

async function createReply(user, ticketId, { message }) {
    const foundTicket = await findTicketById(ticketId)
    console.log(user)

    if (foundTicket.status === "closed") {
        const err = new Error("this ticket is closed")
        err.status = 403
        throw err
    }

    if (!foundTicket.userId.equals(user.id)) {
        // if user didn't send the reply
        foundTicket.responsedBy = user.id
        foundTicket.status = "pending"
    }

    const reply = {
        message,
        senderId: user.id,
        createdAt: new Date()
    }

    foundTicket.replies.push(reply)
    await foundTicket.save()

    return foundTicket
}

async function findTicketWithPopulate(ticketId) {
    const data = ticketModel.findById(ticketId).populate("userId responsedBy assignedTo", "username email").lean()

    if (!data) {
        const err = new Error("ticket not found")
        err.status = 404
        throw err
    }

    return data
}

// async function findAllTickets(user, availableOnly, page, limit) {
//     let query

//     if (availableOnly) {
//         query.status !== "closed"
//     }

//     if (user.role === "teacher") {
//         const data = await ticketModel.find({ query, for: "teacher", assignedTo: user.id }).skip((page - 1) * limit).limit(limit).lean()
//         const totalNumber = await ticketModel.countDocuments({ query, for: "teacher", assignedTo: user.id })

//         return { data, totalNumber }
//     }

//     const data = await ticketModel.find({ query, for: user.role }).skip((page - 1) * limit).limit(limit).lean()
//     const totalNumber = await ticketModel.countDocuments({})
//     return { data, totalNumber }
// }

module.exports = {
    createTicket,
    findUserTickets,
    findTicketById,
    createReply,
    findTicketWithPopulate
}