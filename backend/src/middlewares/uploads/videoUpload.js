const multer = require("multer")

const videoUpload = multer({
    storage: multer.memoryStorage(),

    fileFilter(req, file, cb) {
        const allowed = [
            "video/mp4"
        ]

        if (!allowed.includes(file.mimetype)) {
            const err = new Error(
                "invalid video file type"
            )

            err.status = 415
            err.code = "INVALID_VIDEO_TYPE"

            return cb(err)
        }

        cb(null, true)
    },

    limits: {
        fileSize:
            1024 *
            1024 *
            100
    }
})

module.exports = videoUpload