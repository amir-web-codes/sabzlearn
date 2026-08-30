function getRatingSortExpression() {
    return {
        $switch: {
            branches: [
                {
                    case: {
                        $eq: [
                            "$rating",
                            "Very Bad"
                        ]
                    },
                    then: 1
                },
                {
                    case: {
                        $eq: [
                            "$rating",
                            "Bad"
                        ]
                    },
                    then: 2
                },
                {
                    case: {
                        $eq: [
                            "$rating",
                            "Medium"
                        ]
                    },
                    then: 3
                },
                {
                    case: {
                        $eq: [
                            "$rating",
                            "Good"
                        ]
                    },
                    then: 4
                },
                {
                    case: {
                        $eq: [
                            "$rating",
                            "Very Good"
                        ]
                    },
                    then: 5
                }
            ],
            default: 0
        }
    }
}

function buildRatingSortPipeline(match, page, limit, sortDirection) {
    return [
        {
            $match: match
        },
        {
            $addFields: {
                __ratingValue: getRatingSortExpression()
            }
        },
        {
            $sort: {
                __ratingValue: sortDirection,
                createdAt: -1,
                _id: 1
            }
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: limit
        },
        {
            $project: {
                __ratingValue: 0
            }
        }
    ]
}

module.exports = {
    getRatingSortExpression,
    buildRatingSortPipeline
}