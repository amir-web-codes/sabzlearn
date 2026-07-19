const multer = require("multer")

const thumbnailUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter(req, file, cb) {
        const allowed = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ]

        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("invalid file type"))
        }

        cb(null, true)
    },
    limits: {
        fileSize: 1024 * 1024 * 3
    }
})

module.exports = thumbnailUpload