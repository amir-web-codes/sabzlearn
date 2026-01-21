const ticketService = require("../../services/ticketService")

function checkSelfTicketAuthor(adminAllowed = false) {
    return async (req, res, next) => {

        const foundTicket = await ticketService.findTicketById(req.params.id)

        if (foundTicket.for === "teacher" && foundTicket.assignedTo.equals(req.user.id)) {

            req.ticket = foundTicket
            return next()

        } else if (foundTicket.userId.equals(req.user.id) || (adminAllowed && req.user.role === "admin")) {
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