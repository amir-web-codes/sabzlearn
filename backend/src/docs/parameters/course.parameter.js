module.exports = {
    CourseListSortByParameter: {
        name: "sortBy",
        in: "query",
        required: false,
        description: "Course sort key. Backend mapping: createdAt -> createdAt, price -> finalPrice, students -> studentsCount, rating -> rating.average, title -> title.",
        schema: {
            type: "string",
            enum: [
                "createdAt",
                "price",
                "students",
                "rating",
                "title"
            ],
            default: "createdAt"
        },
        example: "rating"
    }
}