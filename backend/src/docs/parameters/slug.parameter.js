module.exports = {
    SlugParameter: {
        name: "slug",
        in: "path",
        required: true,
        description: "URL-safe resource slug",
        schema: { type: "string" },
        example: "react-from-zero-to-hero"
    }
}