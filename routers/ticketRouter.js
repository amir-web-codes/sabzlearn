const express = require("express")
const router = express.Router()

const { checkRoles, checkToken, checkUserBan, validateId, limiters } = require("../middlewares")

const ticketController = require("../controllers/ticketController")

router.post("/create", checkToken, checkUserBan, limiters.ticketLimiter, ticketController.createNewTicket)

router.get("/me", checkToken, checkUserBan, ticketController.getUserTickets)

module.exports = router