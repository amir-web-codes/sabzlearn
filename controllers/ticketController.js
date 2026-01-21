const ticketModel = require("../models/ticketModel")
const ticketService = require("../services/ticketService")
const asyncWrapper = require("../utils/asyncWrapper")

async function createNewTicket(req, res) {
    const data = await ticketService.createTicket(req.user.id, req.body)

    res.status(201).json({
        success: true,
        message: "ticket created successfully",
        data
    })
}

async function getUserTickets(req, res) {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20

    const { data, totalNumber } = await ticketService.findUserTickets(req.user.id, page, limit)

    res.json({
        success: true,
        message: "tickets fetched successfully",
        data: data.length ? data : "no ticket found",
        meta: {
            totalNumber,
            totalPages: Math.ceil(totalNumber / limit),
            page,
            limit
        }
    })
}

async function getTicketById(req, res) {
    const data = await ticketModel.findById(req.params.id).populate("userId responsedBy assignedTo").select("username email").lean()

    res.json({
        success: true,
        message: "ticket fetched successfully",
        data
    })
}

async function addTicketReply(req, res) {
    const data = await ticketService.createReply(req.user, req.params.id, req.body)

    res.status(201).json({
        success: true,
        message: "reply created successfully",
        data
    })
}

module.exports = {
    createNewTicket: asyncWrapper(createNewTicket),
    getUserTickets: asyncWrapper(getUserTickets),
    getTicketById: asyncWrapper(getTicketById),
    addTicketReply: asyncWrapper(addTicketReply)
}