const courseModel = require("../models/courseModel")
const slugify = require("slugify")

function generateSlug(title) {
    return slugify(title, {
        lower: true,
        strict: true,
        trim: true
    })
}

async function generateUniqueSlug(title) {
    const baseSlug = generateSlug(title)
    let slug = baseSlug
    let counter = 1

    while (await courseModel.exists({ slug })) {
        slug = `${baseSlug}-${counter}`
        counter++
    }

    return slug
}

async function findCourseBySlug(slug) {
    const data = await courseModel.findOne({ slug })

    if (!data) {
        const err = new Error("course not found")
        err.status = 404
        throw err
    }

    return data
}

async function createCourse({ title, description, price, level, language }, userId) {
    const slug = await generateUniqueSlug(title)

    await courseModel.create({
        title,
        slug,
        description,
        price: Number(price),
        instructor: userId,
        level,
        language,
        studentCount: 0,
    })
}

module.exports = {
    findCourseBySlug,
    createCourse
}