import { BlogModel } from 'models/blog'
import { BlogCommentsModel } from 'models/blog_comment'

/**
 * Dùng để tạo một comment cho blog.
 * @param body body của HTTP Post
 * @returns
 */
async function createBlogComment(body) {
  try {
    if (!body.blogId) throw new Error('Comment to a blog need its _id')
    if (!body.comment?.authorId) throw new Error('Who did write this comment?')
    if (!body.comment?.text) throw new Error('Empty comment!')

    if (!(await BlogModel.findOneBlog({ blogId: body.blogId }))) throw new Error('This blog is not exist!')

    let result = await BlogCommentsModel.insertOneBlogComment(body)

    await BlogModel.updateOneBlogByCase(result.blogId, undefined, 'inc:userCommentsTotal')

    return result
  } catch (error) {
    console.error(error.message)
    return undefined
  }
}

/**
 * Dùng để lấy nhiều comments trong một blog.
 * @param query là query params của HTTP Get
 * @returns
 */
async function getBlogComments(query) {
  try {
    for (let paramKey in query) {
      if (/^(\d)+$/.test(query[paramKey])) query[paramKey] = parseInt(query[paramKey])
    }
    let result = await BlogCommentsModel.findManyBlogComment(query)
    return result
  } catch (error) {
    console.error(error.message)
    return undefined
  }
}

/**
 * Dùng để xoá đi một comment nào đó trong một blog. Để xoá được thì cần phải cung cấp
 * `blogId` và `blogCommentId`
 * @param body body của HTTP Post
 * @returns
 */
async function deleteBlogComment(body) {
  try {
    console.log('Body [Delete blog comment]: ', body)
    let result = await BlogCommentsModel.deleteOneBlogComment(body)

    if (result.modifiedCount !== 0) {
      await BlogModel.updateOneBlogByCase(body.blogId, undefined, 'dec:userCommentsTotal')
    }

    return result
  } catch (error) {
    console.error(error.message)
    return undefined
  }
}

export const BlogCommentsService = {
  createBlogComment,
  getBlogComments,
  deleteBlogComment
}