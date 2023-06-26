import { ObjectId } from 'mongodb'
import { getDB } from 'config/mongodb'

/**
 * Model này đặc biệt ở chỗ là một lúc sẽ phải tương tác và tạo 2 object.
 * Ví dụ như một blog chưa có comment nào, thì khi mà một người dùng nào đó comment
 * thì một Blog Comment List document sẽ được tạo ra và Blog Comment mới sẽ được thêm
 * vào trong Blog Comment List.
 */

import {
  blogCommentSchema,
  blogCommentListCollectionSchema,
  blogCommentFields,
  blogCommentListFields
} from 'schemas/blog_comment.schema'

const blogCommentsCollectionName = 'blog_comments'
const BlogCommentModelParameters = {
  MAX_COMMENTS_IN_LIST: 20
}

function BlogCommentsCollection() {
  return getDB().collection(blogCommentsCollectionName)
}

const validateSchema = {
  blogComment: async function(data) {
    return await blogCommentSchema.validateAsync(data, { abortEarly: false })
  },
  blogList: async function(data) {
    return await blogCommentListCollectionSchema.validateAsync(data, { abortEarly: false })
  }
}

/**
 * Thêm một comment vào trong `blog_comments` collection. Nếu `blog_comments` collection chưa có
 * thì tạo ra một document mới và thêm comment vào. Nhận vào request.body của HTTP Post.
 * Body đó có thuộc tính như sau
 *
 * ```js
 * {
 *   blogId: string,
 *   comment: {
 *     authorId: string,
 *     text: string
 *   }
 * }
 * ```
 * @param {{blogId: string, comment: {authorId: string, text: string}}} data
 * @returns
 */
async function insertOneBlogComment(data) {
  try {
    const { blogId, comment } = data

    if (!ObjectId.isValid(blogId)) throw new Error('Invalid blog\'s _id')
    if (!ObjectId.isValid(comment.authorId)) throw new Error('Invalid authorId\'s _id')

    let newComment = await validateSchema.blogComment(comment)
    let blogCommentList
    let commentDoc = {
      _id: new ObjectId(),
      ...newComment
    }

    blogCommentList = await BlogCommentsCollection().findOne(
      {
        [blogCommentListFields.blogId]: blogId,
        $expr: {
          $lt: [ { $size: `$${blogCommentListFields.comments}` }, BlogCommentModelParameters.MAX_COMMENTS_IN_LIST ]
        }
      }
    )

    if (!blogCommentList) {
      let validatedBlogList = await validateSchema.blogList({
        [blogCommentListFields.blogId]: blogId,
        [blogCommentListFields.comments]: [commentDoc]
      })
      blogCommentList = await BlogCommentsCollection().insertOne(validatedBlogList)
    } else {
      await BlogCommentsCollection().updateOne(
        {
          _id: blogCommentList._id
        },
        {
          $addToSet: {
            [blogCommentListFields.comments]: commentDoc
          }
        }
      )
    }

    commentDoc.blodId = blogId
    commentDoc.exactKey = blogCommentList._id

    return commentDoc
  } catch (error) {
    console.error(error.message)
    return undefined
  }
}

/**
 * _**Lưu ý: vì cấu trúc của document khác với bình thường nên cách lấy dữ liệu khác**_
 *
 * Lấy các comments ở trong Blog comment list. Với các thông số truy vấn (queries) như là:
 * - skip: số lượng comments cần bỏ qua.
 * - limit: số lượng comments cần lấy.
 * - blogId: `_id` của blog cần lấy commments.
 * @param {{skipList: number, skip: number, limit: number, blogId: number}} data
 */
const findManyBlogComment = (function() {
  function getSpecialFindOptions(skipElements, amount, skipList = 0) {
    return {
      projection: {
        [blogCommentListFields.comments]: {
          $slice: ['$comments', skipElements, amount]
        }
      },
      skip: skipList
    }
  }

  function getAmount(start, end) {
    return Math.abs(end - start)
  }

  return async function(data) {
    {
      try {
        let { skip = 0, limit = 10, blogId } = data
        let result
        // let findPromises = []
        // let findFilter = { [blogCommentListFields.blogId]: blogId }
        // let completeIndex = limit + skip
        // let end = (skip + limit) >= BlogCommentModelParameters.MAX_COMMENTS_IN_LIST ? BlogCommentModelParameters.MAX_COMMENTS_IN_LIST : (skip + limit)
        // let start = skip

        // skipList = parseInt(skip / BlogCommentModelParameters.MAX_COMMENTS_IN_LIST)
        // console.log('Complete Index: ', completeIndex)
        // while (end <= completeIndex) {
        //   let amount = getAmount(start, end)
        //   let skipElements = start % BlogCommentModelParameters.MAX_COMMENTS_IN_LIST

        //   findPromises.push(BlogCommentsCollection().findOne(
        //     findFilter,
        //     getSpecialFindOptions(skipElements, amount, skipList)
        //   ))
        //   start = end
        //   end += BlogCommentModelParameters.MAX_COMMENTS_IN_LIST
        //   skipList++
        //   if (end > completeIndex) {
        //     amount = getAmount(start, completeIndex)
        //     skipElements = start % BlogCommentModelParameters.MAX_COMMENTS_IN_LIST

        //     if (amount > 0) {
        //       findPromises.push(BlogCommentsCollection().findOne(
        //         findFilter,
        //         getSpecialFindOptions(skipElements, amount, skipList)
        //       ))
        //     }
        //   }
        // }

        let cursor = BlogCommentsCollection().aggregate([
          {
            $match: {
              'blogId': blogId
            }
          },
          {
            $unwind: '$comments'
          },
          {
            $lookup: {
              from: 'users',
              let: {
                userId: { $toObjectId: '$comments.authorId' }
              },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$userId'] } } }
              ],
              as: 'author'
            }
          },
          {
            $addFields: {
              'comments.author': { $first: '$author' },
              'comments.blogId': '$blogId',
              'comments.exactKey': '$_id'
            }
          },
          {
            $replaceRoot: {
              newRoot: '$comments'
            }
          },
          {
            $project: {
              _id: 1,
              blogId: 1,
              exactKey: 1,
              text: 1,
              author: {
                displayName: 1,
                firstName: 1,
                lastName: 1,
                avatar: 1
              },
              createdAt: 1,
              updatedAt: 1
            }
          },
          {
            $skip: skip
          },
          {
            $limit: limit
          }
        ])

        // console.log('Comment: ', )

        // result = await Promise.all(findPromises)
        return await cursor.toArray()
      } catch (error) {
        console.log(error)
        return undefined
      }
    }
  }
})()

/**
 * Xoá một comment của blog nào đó. Để xoá được comment thì phải có được `blogId`, `blogCommentId` và `exactKey`
 * - `blogId`: là `_id` của một blog, với mỗi một blog có thể sẽ có nhiều Blog Comment List (blog_comments document),
 * nên mongo sẽ tìm kiểm toàn bộ trong cơ sở dữ liệu.
 * - `blogCommentId`: chính là `_id` của comment muốn xoá, khi có blogId và blogCommentId thì mongo sẽ tìm toàn bộ các
 * comment trong `comments` của các document có blogId đó.
 * - `exactKey`: chính là `_id` của Blog Comment List (blog_comments document), khi biết chính xác blogCommentId ở trong
 * Blog Comment List nào thì mình dùng cái này để xoá luôn.
 * @param {{blogId: string, blogCommentId: string, exactKey: string}} data
 * @returns
 */
async function deleteOneBlogComment(data) {
  try {
    const { blogId, blogCommentId, exactKey } = data
    let result
    result = await BlogCommentsCollection().updateOne(
      {
        ...(exactKey ? { _id: new ObjectId(exactKey) } : { blogId: blogId }),
        'comments._id': new ObjectId(blogCommentId)
      },
      {
        $pull: {
          'comments': {
            _id: new ObjectId(blogCommentId)
          }
        }
      }
    )
    return result
  } catch (error) {
    console.log(error)
    return undefined
  }
}

/**
 * Hàm này dùng để xoá nhiều blog comment. Đặc biệt là nhiều comments của ai đó, cho
 * nên nó sẽ nhận vào blogId, authorId và số lượng cần xoá
 * @param {{blogId: string, authorId: string, amount: number}} data
 * @returns
 */
async function deleteManyBlogComments(data) {
  try {
    const { blogId, authorId, amount } = data
  } catch (error) {
    console.log(error)
    return undefined
  }
}

export const BlogCommentsModel = {
  insertOneBlogComment,
  findManyBlogComment,
  deleteOneBlogComment,
  deleteManyBlogComments
}