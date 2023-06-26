import Joi from 'joi'

/**
 * Với schema này thì hơi đặc biệt một xíu, nó sẽ bao gồm 2 cái:
 * - BlogCommentList: là những document chính trong blog_comments collection.
 * - BlogComment: chính là những comment của người dùng, trong field `comments`.
 */

export const blogCommentFields = {
  text: 'text',
  authorId: 'authorId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
}

export const blogCommentListFields = {
  blogId: 'blogId',
  comments: 'comments',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
}

export const blogCommentSchema = Joi.object({
  [blogCommentFields.text]: Joi.string().required(),
  [blogCommentFields.authorId]: Joi.string().required(),
  [blogCommentFields.createdAt]: Joi.date().timestamp('javascript').default(Date.now),
  [blogCommentFields.updatedAt]: Joi.date().timestamp().default(null)
})

export const blogCommentListCollectionSchema = Joi.object({
  [blogCommentListFields.blogId]: Joi.string().required(),
  [blogCommentListFields.comments]: Joi.array().default(null),
  [blogCommentFields.createdAt]: Joi.date().timestamp('javascript').default(Date.now),
  [blogCommentFields.updatedAt]: Joi.date().timestamp().default(null)
})