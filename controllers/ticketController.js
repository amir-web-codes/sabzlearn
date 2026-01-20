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

module.exports = {
    createNewTicket: asyncWrapper(createNewTicket),
    getUserTickets: asyncWrapper(getUserTickets)
}