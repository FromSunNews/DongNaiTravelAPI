import {
  Response,
  Request
} from 'express'

import { BlogService } from 'services/blog.service'
import { HttpStatusCode } from 'utilities/constants'

/**
 *
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

export const BlogController = {
  createBlog,
  getBlog,
  getBlogs,
  updateOneBlogByCase
}