import {
  Response,
  Request
} from 'express'

import { HttpStatusCode } from 'utilities/constants'

import { BlogService } from 'services/blog.service'
import { BlogCommentsService } from 'services/blog_comment.service'

/**
 * (Tạm thời không dùng đến cái này)
 *
 * Dùng để tạo một blog
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
async function createBlog(req, res) {
  try {
    let result = await BlogService.createBlog(req.body)
    return res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

/**
 * Dùng để lấy ra một blog theo một vài tiêu chí như là
 * - `blogId`: dùng `_id` của blog thông qua blogId để tìm chính xác blog đó.
 * - `author`: dùng `_id` của user để tìm xem blog này là của tác giả nào.
 *
 * Nếu như không có queries thì nó sẽ luôn lấy blog đầu tiên trong Blog Collection.
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
async function getBlog(req, res) {
  try {
    let result = await BlogService.getBlog(req.query)
    return res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

/**
 * Dùng để lấy các blogs theo nhiều tiêu trí, đọc thêm trong `BlogService.getBlogs`
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
async function getBlogs(req, res) {
  try {
    let result = await BlogService.getBlogs(req.query)
    return res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

/**
 * Dùng để cập nhật thông tin của một blog. Theo các cases cho trước và các case này không có
 * update `content` cho blog.
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
async function updateOneBlogByCase(req, res) {
  try {
    let result = await BlogService.updateOneBlogByCase(req.body)
    return res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

/**
 * Dùng để xoá đi một blog nào đó theo:
 * - `blogId`: là `_id` của blog cần xoá.
 * - `author`: là `_id` của user, tác giả của blog.
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
async function deleteOneBlog(req, res) {
  try {
    let result = await BlogService.deleteOneBlog(req.body)
    return res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

/**
 * Dùng để tạo comment cho một blog
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
async function createBlogComment(req, res) {
  try {
    let result = await BlogCommentsService.createBlogComment(req.body)
    return res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

/**
 * Dùng để lấy comments cho blog.
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
async function getBlogComments(req, res) {
  try {
    let result = await BlogCommentsService.getBlogComments(req.query)
    return res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

/**
 * Dùng để xoá đi comment của một blog.
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
async function deleteBlogComent(req, res) {
  try {
    let result = await BlogCommentsService.deleteBlogComment(req.body)
    return res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

export const BlogController = {
  createBlog,
  getBlog,
  getBlogs,
  updateOneBlogByCase,
  deleteOneBlog,
  createBlogComment,
  getBlogComments,
  deleteBlogComent
}