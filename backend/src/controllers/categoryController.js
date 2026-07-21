const categoryService = require("../services/categoryService")
const asyncWrapper = require("../utils/asyncWrapper")

async function createCategory(req, res) {
    const data = await categoryService.createCategory(req.body, req.user.id)

    res.status(201).json({
        success: true,
        message: "category created successfully",
        data
    })
}

module.exports = {
    createCategory: asyncWrapper(createCategory)
}