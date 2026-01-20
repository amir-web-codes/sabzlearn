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
        const err = new error("ticket not found")
        err.status = 404
        throw err
    }

    return ticket
}

module.exports = {
    createTicket,
    findUserTickets,
    findTicketById
}