const tagService = require("../services/tagService")
const asyncWrapper = require("../utils/asyncWrapper")

async function getBySlug(req, res) {
    const data = await tagService.findTagBySlug(req.params.slug)

    res.json({
        success: true,
        message: "tag fetched successfully",
        data
    })
}

async function createTag(req, res) {
    const data = await tagService.createTag(req.body, req.user.id)

    res.status(201).json({
        success: true,
        message: "tag created successfully",
        data
    })
}

async function updateTag(req, res) {
    const data = await tagService.updateTag(req.params.slug, req.body)

    res.json({
        success: true,
        message: "tag updated successfully",
        data
    })
}

async function deleteTag(req, res) {
    const force = req.query.force === "true"

    await tagService.deleteTag(req.params.slug, { force })

    res.json({
        success: true,
        message: "tag deleted successfully"
    })
}

async function getTagCourses(req, res) {
    const { page, limit, sortBy, sortOrder } = req.query

    const { data, totalNumber } = await tagService.getTagCourses(req.params.slug, { page, limit, sortBy, sortOrder })

    res.json({
        success: true,
        message: "courses fetched successfully",
        data,
        meta: {
            totalNumber,
            totalPages: Math.ceil(totalNumber / limit),
            page,
            limit
        }
    })
}

module.exports = {
    getBySlug: asyncWrapper(getBySlug),
    createTag: asyncWrapper(createTag),
    updateTag: asyncWrapper(updateTag),
    deleteTag: asyncWrapper(deleteTag),
    getTagCourses: asyncWrapper(getTagCourses)
}