const express = require("express")
const router = express.Router()

const { checkRoles, checkToken, checkUserBan, validateId, limiters, checkSelfs } = require("../middlewares")

const ticketController = require("../controllers/ticketController")

const ticketValidations = require("../middlewares/validations/ticket.validation")
const validator = require("../middlewares/validator")

router.post("/create", validator(ticketValidations.createSchema), checkToken, checkUserBan, limiters.ticketLimiter, ticketController.createNewTicket)
router.post("/:id/reply", validateId, validator(ticketValidations.replySchema), checkToken, checkUserBan, checkSelfs.checkSelfTicketAuthor(false), ticketController.addTicketReply)
router.patch("/:id/change-status", validateId, validator(ticketValidations.changeStatusSchema), checkToken, checkUserBan, checkSelfs.checkSelfTicketAuthor(true), ticketController.changeTicketStatus)

router.get("/me", checkToken, checkUserBan, ticketController.getUserTickets)
router.get("/get-all", checkToken, checkUserBan, checkRoles(["admin", "teacher"]), ticketController.getAllTickets)
router.get("/:id", validateId, checkToken, checkUserBan, checkSelfs.checkSelfTicketAuthor(true), ticketController.getTicketById)


module.exports = router