const adminLimiter = require("./adminLimiter")
const commentLimiter = require("./commentLimiter")
const enrollLimiter = require("./enrollLimiter")
const loginLimiter = require("./loginLimiter")
const adminChangeLimiter = require("./adminChangeLimiter")

module.exports = {
    adminLimiter,
    commentLimiter,
    enrollLimiter,
    loginLimiter,
    adminChangeLimiter
}