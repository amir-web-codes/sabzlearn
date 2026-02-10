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

async function findTicketWithPopulate(userId, ticketId) {
    const data = await ticketModel.findById(ticketId).populate("userId responsedBy assignedTo", "username email")

    if (!data) {
        const err = new Error("ticket not found")
        err.status = 404
        throw err
    }

    return data
}

async function findAllTickets(user, availableOnly, page, limit) {

    let query = {};

    if (user.role === "teacher") {

        query.assignedTo = user.id

    } else if (user.role === "admin") {

        query.for = "admin"
    }


    if (availableOnly) {
        query.status = { $ne: "closed" }
    }

    const data = await ticketModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    const totalNumber = await ticketModel.countDocuments(query)

    return { data, totalNumber }
}

async function changeStatus(user, ticketId, newStatus) {
    const availableStatuses = ["pending", "closed"]

    if (!availableStatuses.includes(newStatus)) {
        const err = new Error("status not available")
        err.status = 400
        throw err
    }

    const foundTicket = await findTicketById(ticketId)

    if (newStatus === foundTicket.status) {
        const err = new Error("ticket already has this status")
        err.status = 400
        throw err
    }

    const isAdmin = user.role === "admin" && foundTicket.for === "admin"
    const isTeacher = user.role === "teacher" && foundTicket.assignedTo && foundTicket.assignedTo.equals(user.id)

    console.log(isAdmin)
    console.log(isTeacher)

    if (!isAdmin && !isTeacher) {
        const err = new Error("you don't have permission to change this ticket")
        err.status = 403
        throw err
    } else {

        if (foundTicket.status === "closed" && user.role !== "admin") {

            const err = new Error("you can't reopen ticket")
            err.status = 403
            throw err
        }


        foundTicket.status = newStatus
        return await foundTicket.save()
    }

}

module.exports = {
    createTicket,
    findUserTickets,
    findTicketById,
    createReply,
    findTicketWithPopulate,
    findAllTickets,
    changeStatus
}