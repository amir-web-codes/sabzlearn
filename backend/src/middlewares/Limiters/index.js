const adminLimiter = require("./adminLimiter")
const commentLimiter = require("./commentLimiter")
const enrollLimiter = require("./enrollLimiter")
const loginLimiter = require("./loginLimiter")
const adminChangeLimiter = require("./adminChangeLimiter")
const requestLimiter = require("./requestLimiter")
const ticketLimiter = require("./ticketLimiter")
const courseLimiter = require("./courseLimiter")
const cartLimiter = require("./cartLimiter")

module.exports = {
    adminLimiter,
    commentLimiter,
    enrollLimiter,
    loginLimiter,
    adminChangeLimiter,
    requestLimiter,
    ticketLimiter,
    courseLimiter,
    cartLimiter
}