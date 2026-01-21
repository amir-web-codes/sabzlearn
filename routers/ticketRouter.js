const express = require("express")
const router = express.Router()

const { checkRoles, checkToken, checkUserBan, validateId, limiters, checkSelfs } = require("../middlewares")

const ticketController = require("../controllers/ticketController")

router.post("/create", checkToken, checkUserBan, limiters.ticketLimiter, ticketController.createNewTicket)
router.post("/:id/reply", validateId, checkToken, checkUserBan, checkSelfs.checkSelfTicketAuthor(false), ticketController.addTicketReply)

router.get("/me", checkToken, checkUserBan, ticketController.getUserTickets)
// router.get("/get-all", checkToken, checkUserBan, checkRoles(["admin", "teacher"]), ticketController.getAllTickets)
router.get("/:id", validateId, checkToken, checkUserBan, checkSelfs.checkSelfTicketAuthor(true), ticketController.getTicketById)


module.exports = router