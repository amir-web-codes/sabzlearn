
const multer = require("multer")
const path = require("path")
const crypto = require("crypto")
const fs = require("fs")

const storage = multer.diskStorage({
    destination(req, file, cb) {
        const uploadPath = path.join(__dirname, "../../public/uploads/avatars")
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

const avatarUpload = multer({
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
        fileSize: 1024 * 1024 * 2
    }
})

module.exports = avatarUpload