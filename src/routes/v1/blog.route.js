import express from 'express'
import multer from 'multer'

import { BlogController } from 'controllers/blog.controller'

import { AuthMiddleware } from 'middlewares/auth.middleware'

const router = express.Router()
const upload = multer()

router.route('/test')
  .post(upload.none(), AuthMiddleware.isAuthorized, (req, res) => {
    try {
      return res.status(200).json({ message: 'ok' })
    } catch (error) {
      return res.status(500).json({
        errors: error.message
      })
    }
  })

router.route('/create_new')
  .post(AuthMiddleware.isAuthorized, BlogController.createBlog)

router.route('/update_one')
  .post(AuthMiddleware.isAuthorized, BlogController.updateOneBlogByCase)

router.route('/get_one')
  .get(BlogController.getBlog)

router.route('/get_multiple')
  .get(BlogController.getBlogs)

router.route('/delete_one')
  .delete(/*AuthMiddleware.isAuthorized,*/ BlogController.deleteOneBlog)

router.route('/create_comment')
  .post(AuthMiddleware.isAuthorized, BlogController.createBlogComment)

router.route('/get_comments')
  .get(BlogController.getBlogComments)

router.route('/delete_comment')
  .delete(AuthMiddleware.isAuthorized, BlogController.deleteBlogComent)

export const blogRoutes = router