const errorHandler = (err, req, res, next) => {

    const status = err.status || 500

    if (status >= 500) {
        console.log(`server error: ${err.stack}`)
        err.message = "internal server error"
    }

    res.status(status).json({
        success: false,
        message: err.message
    })
}

module.exports = errorHandler