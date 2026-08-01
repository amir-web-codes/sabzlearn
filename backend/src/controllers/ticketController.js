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
    const { status, sortBy, sortOrder } = req.query

    const page = req.query.page || 1
    const limit = req.query.limit || 20

    const { data, totalNumber } = await ticketService.findUserTickets(req.user.id, page, limit, { status }, { sortBy, sortOrder })

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
    const data = await ticketService.findTicketWithPopulate(req.user.id, req.params.id)

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

async function getAllTickets(req, res) {
    const { status, sortBy, sortOrder } = req.query
    const availableOnly = req.query.availableOnly === "true"

    const page = req.query.page || 1
    const limit = req.query.limit || 20

    const { data, totalNumber } = await ticketService.findAllTickets(req.user, availableOnly, page, limit, { status }, { sortBy, sortOrder })

    res.json({
        success: true,
        message: "tickets fetched successfully",
        data,
        meta: {
            totalNumber,
            totalPages: Math.ceil(totalNumber / limit),
            page,
            limit
        }
    })
}

async function changeTicketStatus(req, res) {
    await ticketService.changeStatus(req.user, req.params.id, req.body.newStatus)

    res.status(200).json({
        success: true,
        message: "ticket status changed successfully"
    })
}

module.exports = {
    createNewTicket: asyncWrapper(createNewTicket),
    getUserTickets: asyncWrapper(getUserTickets),
    getTicketById: asyncWrapper(getTicketById),
    addTicketReply: asyncWrapper(addTicketReply),
    getAllTickets: asyncWrapper(getAllTickets),
    changeTicketStatus: asyncWrapper(changeTicketStatus)
}