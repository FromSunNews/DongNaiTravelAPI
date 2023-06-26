
import axios from 'axios'
import cloudinary from 'cloudinary'
import streamifier from 'streamifier'
import { env } from 'config/environtment'

import { CloudinaryUtils } from './utils'
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

/**
 * Dùng để upload một resource nào đó.
 * @param {*} fileBuffer
 * @param {*} folderName
 * @returns
 */
async function streamUpload(fileBuffer, folderName) {
  return new Promise((resolve, reject) => {
    let stream = cloudinaryV2.uploader.upload_stream({ folder: folderName }, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

/**
 * Hàm này dùng để upload nhiều resource dạng buffer lên cloudinary.
 * @param fileBuffers các file buffers
 * @param {cloudinary.UploadApiOptions} options các tuỳ chọn
 * @returns
 */
async function streamUploadMutiple(fileBuffers, options) {
  options = Object.assign({
    folder: ''
  }, options)
  const uploadPromises = fileBuffers.map(fileBuffer => {
    return new Promise((resolve, reject) => {
      let stream = cloudinaryV2.uploader.upload_stream(options, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })

      streamifier.createReadStream(fileBuffer).pipe(stream)
    })
  })
  // Đây là tiến trinh song song => giảm được thời gian chờ
  const results = await Promise.all(uploadPromises)
  if (results)
    return results
  else return
}

/**
 * Hàm này dùng để xoá các resource trên Cloudinary thông qua các url của resource đó.
 * Ngoài ra cũng có thể xoá một resource duy nhất.
 * @param {Array<string>} resourceUrls một mảng các url của resource trên Cloudinary
 * @returns
 */
async function deleteResources(resourceUrls) {
  try {
    let resourcesInformation = CloudinaryUtils.getResourcesInformation(resourceUrls)
    let publicIdsByType = {}
    let promises = []

    for (let resourceInformation of resourcesInformation) {
      if (!publicIdsByType[resourceInformation.resourceType]) {
        publicIdsByType[resourceInformation.resourceType] = []
      }
      publicIdsByType[resourceInformation.resourceType].push(resourceInformation.publicId)
    }

    let types = Object.keys(publicIdsByType)

    for (let type of types) {
      promises.push(cloudinaryV2.api.delete_resources(publicIdsByType[type], { resource_type: type }))
    }

    let result = await axios.all(promises)
    return result
  } catch (error) {
    console.error(error.message)
    return undefined
  }
}

export const CloudinaryProvider = {
  streamUpload,
  streamUploadMutiple,
  deleteResources
}