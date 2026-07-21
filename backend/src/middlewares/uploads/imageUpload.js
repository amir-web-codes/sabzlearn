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
            return cb(new Error("invalid file type"))
        }

        cb(null, true)
    },
    limits: {
        fileSize: 1024 * 1024 * 2
    }
})

module.exports = imageUpload