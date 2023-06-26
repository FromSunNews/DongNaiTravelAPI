import { Buffer } from 'buffer'

import { CloudinaryProvider } from 'providers/cloudinary'

import { BlogContentModel } from 'models/blog_content'
import { ContentModel } from 'models/content.model'
import { BlogModel } from 'models/blog'
import { UserModel } from 'models/user.model'

import {
  getBase64PhotoInMD,
  replaceBase64PhotoWithLink,
  removeMDFromString,
  countWord
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
    blog.readTime = Math.floor(countWord(plainText) / 200 * 60)

    const insertResult = await BlogModel.insertOneBlog(blog)
    return insertResult
  } catch (error) {
    console.error(error.message)
    return undefined
  }
}

/**
 * Về cơ bản thì thằng getBlog với thằng getBlogs là y hệt nhau, nhưng khác ở chỗ là
 * thằng getBlog sẽ tìm chính xác một blog dựa theo blogId còn thằng getBlogs tìm trừu
 * tượng nhiều blogs.
 */

/**
 * Hàm này dùng để lấy dữ liệu của một blog nào đó. `query` là một object bao gồm có các
 * thuộc tính như là:
 * - author: là `_id` của tác giả.
 * - blogId: là `_id` của blog cần tìm.
 * - fields: là những trường dữ liệu mong muốn lấy được.
 * - userId: là `_id` của người dùng đang lấy dữ liệu.
 *
 * Sau khi lấy ra được `user` đang lấy dữ liệu từ `userId` (hoặc có thể không) thì mình sẽ tới bước tìm dữ liệu
 * @param query Một object query.
 * @returns
 */
async function getBlog(query) {
  try {
    let data = {
      author: query.author,
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

/**
 * Hàm này dùng để tìm nhiều blogs theo các tiêu chí như là:
 * - quality: là một chuỗi bao gồm cặp `key:value` được ngăn cách nhau bởi dấu `,`.
 * - author: là `_id` của tác giả. Dùng cái này để tìm xem một người dùng đã viết những blog nào?
 *
 * Tương tự như `getBlog` thì `getBlogs` cũng sẽ lấy thông tin `user` yêu cầu dữ liệu (hoặc có thể không)
 * sau đó là tiến hành lấy dữ liệu.
 * @param query Một object query.
 * @returns
 */
async function getBlogs(query) {
  try {
    let { limit = 5, skip = 0, fields, quality, author } = query

    let user
    if (query.userId) user = await UserModel.findOneById(query.userId)
    let data = {
      quality,
      fields,
      limit: parseInt(limit),
      skip: parseInt(skip),
      user,
      author
    }

    let result = await BlogModel.findManyBlog(data)
    return result
  } catch (error) {
    console.error(error.message)
    return undefined
  }
}

/**
 * Hàm này dùng để update dữ liệu theo trường hợp, mặc định là `default` :D.
 * @param data Bao gồm `blogId`, `updateData`, `updateCase`
 * @returns
 */
async function updateOneBlogByCase(data) {
  try {
    let { blogId, updateData, updateCase = 'default' } = data
    let result = await BlogModel.updateOneBlogByCase(blogId, updateData, updateCase)
    return result
  } catch (error) {
    console.error(error.message)
    return undefined
  }
}

/**
 * Hàm này dùng để xoá đi một blog nào đó theo `blogId` hoặc là `author` (`_id` của user).
 * Nhận vào một object là request body.
 *
 * Để xoá một blog, thì mình phải xác định xem các đối tượng có quan hệ với blog.
 * - blog content: là một đối tượng chứa content của blog.
 * - comment ids: là một đối tượng chứa các comments của blog.
 * Đó là những resource nằm trong database, ngoài ra còn một số resource khác như là:
 * - Ảnh đại diện của blog.
 * - Ảnh trong content của blog.
 * - Speech của content.
 *
 * Như vậy thì đàu tiên mình phải xoá các resource khác của blog, sau khi xoá xong thì
 * sẽ xoá resource trong database.
 *
 * @param {{ blogId: string }} data
 */
async function deleteOneBlog(data) {
  try {
    if (!data.blogId) throw new Error('Delete a blog require its _id. Blog\'s _id not found!')
    let blog = await BlogModel.findOneBlog(data)
    let cloudinaryResourceUrls = [blog.avatar]
    let speechKeys = Object.keys(blog.content.speech)
    let [cloudinaryImageUrls] = getBase64PhotoInMD(blog.content.plainTextMarkFormat, { removeMD: true })
    let deleteResourcesResult

    // Lấy các url trong
    for (let speechKey of speechKeys) {
      cloudinaryResourceUrls.push(blog.content.speech[speechKey])
    }

    for (let cloudinaryImageUrl of cloudinaryImageUrls) {
      cloudinaryResourceUrls.push(cloudinaryImageUrl)
    }

    console.log('Cloudinary resource urls of blog: ', cloudinaryResourceUrls)
    deleteResourcesResult = await CloudinaryProvider.deleteResources(cloudinaryResourceUrls)
    if (!deleteResourcesResult) throw new Error('Cannot delete cloudinary resource of this blog.')
    console.log('Delete cloudinary resource result: ', deleteResourcesResult)

    let deleteBlogContentResult = await BlogContentModel.deleteOneBlogContent(blog.contentId)
    if (deleteBlogContentResult.deletedCount < 1) throw new Error('Cannot delete blog\'s content.')

    let deleletBlogResult = await BlogModel.deleteOneBlog(blog._id.toString())
    return deleletBlogResult
  } catch (error) {
    console.error(error.message)
    return error.message
  }
}

export const BlogService = {
  createBlog,
  getBlog,
  getBlogs,
  updateOneBlogByCase,
  deleteOneBlog
}