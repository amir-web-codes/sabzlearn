const categoryService = require("../services/categoryService")
const asyncWrapper = require("../utils/asyncWrapper")

async function getAllCategories(req, res) {
    const { search, inactive, sortBy, sortOrder } = req.query
    const isAdmin = req.user?.role === "admin"

    const page = req.query.page || 1
    const limit = req.query.limit || 20

    const { data, totalNumber } = await categoryService.getAllCategories(
        { page, limit, search, inactive, sortBy, sortOrder },
        isAdmin
    )

    res.json({
        success: true,
        message: "categories fetched successfully",
        data,
        meta: {
            totalNumber,
            totalPages: Math.ceil(totalNumber / limit),
            page,
            limit
        }
    })
}

async function getBySlug(req, res) {
    const isAdmin = req.user?.role === "admin"

    const data = await categoryService.findCategoryBySlug(req.params.slug, isAdmin)

    res.json({
        success: true,
        message: "category fetched successfully",
        data
    })
}

async function createCategory(req, res) {

    const data = await categoryService.createCategory(req.body, req.file, req.user.id)

    res.status(201).json({
        success: true,
        message: "category created successfully",
        data
    })
}

async function updateCategory(req, res) {
    const data = await categoryService.updateCategory(req.params.slug, req.body, req.file)

    res.json({
        success: true,
        message: "category updated successfully",
        data
    })
}

async function deleteCategory(req, res) {
    const force = req.query.force === "true"

    await categoryService.deleteCategory(req.params.slug, { force })

    res.json({
        success: true,
        message: "category deleted successfully"
    })
}

async function getCategoryCourses(req, res) {
    const { sortBy, sortOrder } = req.query

    const page = req.query.page || 1
    const limit = req.query.limit || 20

    const { data, totalNumber } = await categoryService.getCategoryCourses(req.params.slug, { page, limit, sortBy, sortOrder })

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
    getAllCategories: asyncWrapper(getAllCategories),
    getBySlug: asyncWrapper(getBySlug),
    createCategory: asyncWrapper(createCategory),
    updateCategory: asyncWrapper(updateCategory),
    deleteCategory: asyncWrapper(deleteCategory),
    getCategoryCourses: asyncWrapper(getCategoryCourses)
}