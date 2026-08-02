const idParameter = require("./id.parameter")
const paginationParameters = require("./pagination.parameter")
const ticketParameter = require("./ticket.parameter")
const slugParameter = require("./slug.parameter")
const userParameter = require("./user.parameter")
const sortParameter = require("./sort.parameter")
const commentParameter = require("./comment.parameter")
const lessonParameter = require("./lesson.parameter")

module.exports = {
    ...idParameter,
    ...paginationParameters,
    ...ticketParameter,
    ...slugParameter,
    ...userParameter,
    ...sortParameter,
    ...commentParameter,
    ...lessonParameter
}