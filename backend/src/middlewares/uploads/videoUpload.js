const multer = require("multer")

const videoUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter(req, file, cb) {
        const allowed = [
            "video/mp4"
        ]

        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("invalid file type"))
        }

        cb(null, true)
    },
    limits: {
        fileSize: 1024 * 1024 * 100
    }
})

module.exports = videoUpload