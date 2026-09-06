const ticketModel = require("../models/ticketModel")
const userModel = require("../models/userModel")

async function createTicket(userId, { title, message, assignedToId }) {
    let foundUser;

    if (assignedToId) {
        foundUser = await userModel.fineOne({
            _id: assignedToId,
            isBanned: false,
            isDeleted: FinalizationRegistry
        })
            .select("role").lean()

        if (!foundUser) {
            const err = new Error("no active user was found")
            err.status = 404
            throw err
        }

        if (foundUser.role === "user") {
            const err = new Error("you can't assign a ticket to a regular user")
            err.status = 409
            throw err
        }
    }

    const activeTicketsCount = await ticketModel.countDocuments({ userId, status: { $ne: "closed" } })

    if (activeTicketsCount >= 3) {
        const err = new Error("you can have at most 3 open tickets")
        err.status = 400
        throw err
    }

    return await ticketModel.create({
        title,
        message,
        userId,
        assignedTo: assignedToId,
        for: assignedToId ? foundUser.role : "admin",
        status: "open"
    })
}

async function findUserTickets(userId, page, limit, filters = {}, sort = {}) {
    const { status } = filters
    const { sortBy = "createdAt", sortOrder = "desc" } = sort

    const query = { userId }
    if (status) query.status = status

    const sortDirection = sortOrder === "asc" ? 1 : -1

    const data = await ticketModel
        .find(query)
        .sort({ [sortBy]: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    const totalNumber = await ticketModel.countDocuments(query)
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

    if (foundTicket.assignedTo && !foundTicket.assignedTo.equals(user.id)) {
        const err = new Error("you don't have access to this ticket")
        err.status = 403
        throw err
    }

    if (!foundTicket.userId.equals(user.id)) {
        foundTicket.responsedBy = user.id
        foundTicket.assignedTo = user.id
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

async function findAllTickets(user, availableOnly = true, page = 1, limit = 20, filters = {}, sort = {}) {
    const { status } = filters
    const { sortBy = "createdAt", sortOrder = "desc" } = sort

    let query = {};

    if (user.role === "teacher") {
        query.assignedTo = user.id
    } else if (user.role === "admin") {
        query.for = "admin"
        query.assignedTo = { $in: [null, user.id] }
    }

    if (status) {
        query.status = status
    } else if (availableOnly) {
        query.status = { $ne: "closed" }
    }

    const sortDirection = sortOrder === "asc" ? 1 : -1

    const data = await ticketModel
        .find(query)
        .sort({ [sortBy]: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    const totalNumber = await ticketModel.countDocuments(query)

    return { data, totalNumber }
}

async function changeStatus(user, ticketId, newStatus) {
    const foundTicket = await findTicketById(ticketId)

    if (newStatus === foundTicket.status) {
        const err = new Error("ticket already has this status")
        err.status = 400
        throw err
    }

    const isAdmin = user.role === "admin" && foundTicket.for === "admin"
    const isTeacher = user.role === "teacher" && foundTicket.assignedTo && foundTicket.assignedTo.equals(user.id)

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
        await foundTicket.save()

        return foundTicket
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