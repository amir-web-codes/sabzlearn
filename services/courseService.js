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

async function findCourseBySlug(slug, select) {
    let data;

    if (select) {
        data = await courseModel.findOne({ slug }).select(select)
    } else {
        data = await courseModel.findOne({ slug })
    }

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

async function removeCourseFromDb(slug) {
    return await courseModel.findOneAndDelete({ slug })
}

async function updateCourse({ title, description, price, level, language }, slug) {

    const foundCourse = await courseModel.findOne({ slug })

    if (title !== undefined && title.trim() !== foundCourse.title) {
        foundCourse.title = title
        const sluged = await generateUniqueSlug(title)
        foundCourse.slug = sluged
    }

    if (description !== undefined) foundCourse.description = description
    if (price !== undefined) foundCourse.price = price
    if (level !== undefined) foundCourse.level = level
    if (language !== undefined) foundCourse.language = language

    await foundCourse.save()
}

async function getAllCourses() {
    return await courseModel.find().lean()
}

module.exports = {
    findCourseBySlug,
    createCourse,
    removeCourseFromDb,
    updateCourse,
    getAllCourses
}