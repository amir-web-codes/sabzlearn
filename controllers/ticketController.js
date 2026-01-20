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

module.exports = {
    createNewTicket: asyncWrapper(createNewTicket)
}