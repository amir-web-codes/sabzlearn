const express = require("express")
const router = express.Router()

const { checkRoles, checkToken, checkUserBan, validateId, limiters, checkSelfs } = require("../middlewares")

const ticketController = require("../controllers/ticketController")

router.post("/create", checkToken, checkUserBan, limiters.ticketLimiter, ticketController.createNewTicket)

router.get("/me", checkToken, checkUserBan, ticketController.getUserTickets)
router.get("/:id", validateId, checkToken, checkUserBan, checkSelfs.checkSelfTicketAuthor(true), ticketController.getTicketById)

module.exports = router