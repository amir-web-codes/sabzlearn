const slugify = require("slugify")

function generateSlug(value) {
    return slugify(value, {
        lower: true,
        strict: true,
        trim: true
    })
}

async function generateUniqueSlug(model, value) {
    const baseSlug = generateSlug(value)

    let slug = baseSlug
    let counter = 1

    while (await model.exists({ slug })) {
        slug = `${baseSlug}-${counter}`
        counter++
    }

    return slug
}

module.exports = generateUniqueSlug