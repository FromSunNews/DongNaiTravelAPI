import express from 'express'
import { BlogController } from 'controllers/blog.controller'
import { AuthMiddleware } from 'middlewares/auth.middleware'

const router = express.Router()

router.route('/create_new')
  .post(AuthMiddleware.isAuthorized, BlogController.createBlog)

router.route('/update_one')
  .post(AuthMiddleware.isAuthorized, BlogController.updateOneBlogByCase)

router.route('/get_one')
  .get(BlogController.getBlog)

router.route('/get_multiple')
  .get(BlogController.getBlogs)

export const blogRoutes = router