const cloudinary = require("../configs/cloudinary")
const streamifier = require("streamifier")

function uploadToCloudinary(file, options = {}) {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: options.folder || "uploads",

                resource_type: options.resource_type || "image"
            },

            (error, result) => {

                if (error) {
                    return reject(error)
                }

                resolve(result)

            }
        )

        streamifier.createReadStream(file.buffer).pipe(stream)
    })
}

async function uploadImage(file, folder) {

    return uploadToCloudinary(file, {
        folder,
        resource_type: "image"
    })

}



async function uploadVideo(file, folder) {

    return uploadToCloudinary(file, {
        folder,
        resource_type: "video"
    })

}



async function deleteFile(publicId, resource_type = "image") {

    if (!publicId) {
        const err = new Error("public id is required")
        err.status = 400
        throw err
    }

    return cloudinary.uploader.destroy(
        publicId,
        {
            resource_type
        }
    )

}



module.exports = {
    uploadImage,
    uploadVideo,
    deleteFile
}