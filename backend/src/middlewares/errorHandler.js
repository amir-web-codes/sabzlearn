const logger = require("../utils/logger")
const { deleteFile } = require("../services/fileService")

function normalizeUploadError(err) {
    if (err.name !== "MulterError") {
        return
    }

    if (err.code === "LIMIT_FILE_SIZE") {
        err.status = 413
        err.message = "uploaded file is too large"
        return
    }

    err.status = 400

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
        err.message = "unexpected upload field"
        return
    }

    err.message = err.message || "invalid upload"
}

const errorHandler = async (err, req, res, next) => {
    normalizeUploadError(err)

    const status = err.status || 500

    if (status >= 500) {
        if (process.env.NODE_ENV === "development") {
            console.log(`server error: ${err.stack}`)
        }

        err.message = "internal server error"
    }

    if (req.uploadedFile) {
        try {
            await deleteFile(req.uploadedFile.public_id, req.uploadedFile.resource_type || "image")
        } catch (cleanupErr) {
            logger.error({ err: cleanupErr }, "failed to cleanup orphaned uploaded file")
        }
    }

    res.status(status).json({
        success: false,
        message: err.message,
        errors: err.errors,
        code: err.code,
        details: err.details
    })
}

module.exports = errorHandler