const multer = require("multer")
const path = require("path")
const crypto = require("crypto")

const storage = multer.diskStorage({
    destination(req, file, cb) {
        const uploadPath = path.join(__dirname, "../public/uploads/thumbnails")
        if (!fs.existsSync(uploadPath)) {

            fs.mkdirSync(uploadPath, {
                recursive: true
            })

        }

        cb(null, uploadPath)
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname)

        const name = crypto.randomBytes(16).toString("hex") + ext

        cb(null, name)
    }
})

const thumbnailUpload = multer({
    storage,
    fileFiler(req, file, cb) {
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