const commentService = require("../services/commentService")
const asyncWrapper = require("../utils/asyncWrapper")

async function getUserComments(req, res) {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const userId = req.params.id

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

async function getCommentById(req, res) {
    res.json({
        success: true,
        message: "comment fetched successfully",
        data: req.comment
    })
}

async function deleteCommentById(req, res) {
    await commentService.deleteCommentById(req.params.id)

    res.json({
        success: true,
        message: "comment deleted successfully"
    })
}

async function editCommentById(req, res) {
    await commentService.updateCommentById(req.comment, req.params.id, req.body)

    res.json({
        success: true,
        message: "comment edited successfully"
    })
}

async function createNewComment(req, res) {
    await commentService.createComment(req.params.slug, req.user.id, req.body)

    res.status(201).json({
        success: true,
        message: "comment created successfully"
    })
}

module.exports = {
    getUserComments: asyncWrapper(getUserComments),
    getCommentById: asyncWrapper(getCommentById),
    deleteCommentById: asyncWrapper(deleteCommentById),
    editCommentById: asyncWrapper(editCommentById),
    createNewComment: asyncWrapper(createNewComment)
}