const ticketService = require("../../services/ticketService")

function checkSelfTicketAuthor(adminAllowed = false) {
    return async (req, res, next) => {

        const foundTicket = await ticketService.findById(req.params.id)

        if (foundTicket.userId.equals(req.user.id) || (adminAllowed && req.user.role === "admin")) {
            req.ticket = foundTicket
            return next()
        }

        res.status(403).json({
            success: false,
            message: "you don't have access to this ticket"
        })
    }
}

module.exports = checkSelfTicketAuthor