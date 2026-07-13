module.exports = {
    SlugParameter: {
        name: "slug",
        in: "path",
        required: true,
        description: "Course slug",
        schema: { type: "string" },
        example: "react-from-zero-to-hero"
    }
}