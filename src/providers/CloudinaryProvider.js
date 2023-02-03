
import cloudinary from 'cloudinary'
import streamifier from 'streamifier'
import { env } from '*/config/environtment'
/**
 * Tài liệu tham khảo:
 * https://cloudinary.com/blog/node_js_file_upload_to_a_local_server_or_to_the_cloud
 * https://andela.com/insights/how-to-use-cloudinary-and-nodejs-to-upload-multiple-images/
 */

// https://www.npmjs.com/package/cloudinary

const cloudinaryV2 = cloudinary.v2
cloudinaryV2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
})

const streamUpload = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinaryV2.uploader.upload_stream({ folde: folderName }, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })

    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

export const CloudinaryProvider = {
  streamUpload
}