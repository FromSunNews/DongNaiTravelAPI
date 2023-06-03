import { Buffer } from 'buffer'

import { CloudinaryProvider } from 'providers/CloudinaryProvider'

import { ContentModel } from 'models/content.model'
import { BlogModel } from 'models/blog'
import { UserModel } from 'models/user.model'

import {
  getBase64PhotoInMD,
  replaceBase64PhotoWithLink,
  removeMDFromString
} from 'utilities/string'

import {
  BlogDataProps,
  ContentDataProps
} from 'types'

const cloudinaryFolderName = 'blog_photos'

/*
  Dữ liệu mà createBlog sẽ nhận được là:
  {
    blog: {...} // Bao gồm tất cả dữ liệu của blog trong `BlogDataProps`
    content: {...}
  }
*/

/**
 * Hàm này dùng để tạo ra một blog. Để tạo ra một blog thì phải cần thoả 2 tiêu chí sau:
 * 1. Người dùng phải đăng nhập
 * 2. Trong `data` phải có nội dung của blog
 *
 * Để có thể thêm được dữ liệu của blog thì cần phải:
 * 1. Xử lý ảnh ở trong blog content.
 * 2. Upload tất cả ảnh lên Cloudinary, lấy tất cả link tải ảnh từ cloudinary để thêm lại vào trong cho `content`.
 * 3. Xử lý dữ liệu còn lại trong `blog`.
 * 4. Thêm `content` vào trong DB.
 * 5. Lấy _id của content vừa thêm và thêm blog vào trong db.
 *
 * @param {{blog: BlogDataProps, content: string}} data
 * @returns
 */
async function createBlog(data) {
  try {
    let { content, blog } = data
    content = JSON.parse(content)
    let base64Photos = getBase64PhotoInMD(content)
    base64Photos.unshift(blog.avatar)
    let completeContent = content
    let plainText
    let base64PhotoBuffers = base64Photos.map(base64Photo => Buffer.from(base64Photo))
    let [blogAvatarLink, ...photoLinks] = await CloudinaryProvider.streamUploadMutiple(base64PhotoBuffers, cloudinaryFolderName)

    if (photoLinks.length > 1) {
      let links = photoLinks.map(photoLink => photoLink.url)
      completeContent = replaceBase64PhotoWithLink(content, links)
    }

    plainText = removeMDFromString(completeContent)

    /**
     * @type {ContentDataProps}
    */
    let contentDoc = {
      plainText: {
        vi: plainText
      },
      plainTextMarkFormat: {
        vi: completeContent
      }
    }
    let insertedContent = await ContentModel.createNew(contentDoc)

    blog.contentId = insertedContent.insertedId.toString()
    blog.avatar = blogAvatarLink.url

    const insertResult = await BlogModel.insertOneBlog(blog)
    return insertResult
  } catch (error) {
    console.error(error.message)
    return undefined
  }
}

async function getBlog(query) {
  try {
    let data = {
      blogId: query.blogId,
      fields: query.fields || ''
    }
    let user
    if (query.userId) user = await UserModel.findOneById(query.userId)
    query.user = user
    let blog = await BlogModel.findOneBlog(data)
    return blog
  } catch (error) {
    console.error(error.message)
    return undefined
  }
}

async function getBlogs(query) {
  try {
    let { limit, skip, fields, filter } = query
    console.log('Query: ', query)
    let user
    if (query.userId) user = await UserModel.findOneById(query.userId)
    let data = {
      filter,
      fields,
      limit: parseInt(limit),
      skip: parseInt(skip),
      user
    }
    console.log(`Limit: ${data.limit}; Skip: ${data.skip}`)
    console.log(`Type of limit and skip: ${typeof data.limit} and ${typeof data.skip}`)
    let result = await BlogModel.findManyBlog(data)
    return result
  } catch (error) {
    console.error(error.message)
    return undefined
  }
}

export const BlogService = {
  createBlog,
  getBlog,
  getBlogs
}