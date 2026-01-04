const errorHandler = (err, req, res, next) => {

    if (err.status >= 500) {
        console.log(`server error: ${err.stack}`)
        err.message = "internal server error"
    }

    res.status(err.status).json({
        success: false,
        message: err.message
    })
}

module.exports = errorHandler