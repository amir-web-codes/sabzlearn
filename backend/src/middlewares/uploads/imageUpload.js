const multer = require("multer")

const imageUpload = multer({
    storage: multer.memoryStorage(),

    fileFilter(req, file, cb) {
        const allowed = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ]

        if (!allowed.includes(file.mimetype)) {
            const err = new Error(
                "invalid image file type"
            )

            err.status = 415
            err.code = "INVALID_IMAGE_TYPE"

            return cb(err)
        }

        cb(null, true)
    },

    limits: {
        fileSize: 1024 * 1024 * 2
    }
})

module.exports = imageUpload