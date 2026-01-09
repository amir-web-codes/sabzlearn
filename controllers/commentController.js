const commentService = require("../services/commentService")
const asyncWrapper = require("../utils/asyncWrapper")

async function getUserComments(req, res) {
    const page = Number(req.query.page) ?? 1
    const limit = Number(req.query.limit) ?? 20
    const userId = req.params.id ?? req.user.id

    const { data, totalNumber } = await commentService.findUserComments(userId, page, limit)

    res.json({
        success: true,
        message: "comments fetched successfully",
        data: data.length ? data : "no comments found",
        meta: {
            totalNumber,
            totalPages: Math.ceil(totalNumber / limit),
            page,
            limit
        }
    })
}

module.exports = {
    getUserComments: asyncWrapper(getUserComments)
}