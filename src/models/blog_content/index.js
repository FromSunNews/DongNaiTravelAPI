import { ObjectId } from 'mongodb'
import { getDB } from 'config/mongodb'

import {
  blogContentFields,
  blogContentCollectionSchema
} from 'schemas/blog_content.schema'

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const blogContentCollectionName = 'blog_content'

function BlogContentCollection() {
  return getDB().collection(blogContentCollectionName)
}

const validateSchema = async (data) => {
  return await blogContentCollectionSchema.validateAsync(data, { abortEarly: false })
}

/**
 * Hàm này dùng để lưu blog's content vào trong db.
 * @param {*} data dữ liệu của blog's content.
 * @returns
 */
async function insertOneBlogContent(data) {
  try {
    const validatedData = await validateSchema(data)
    const result = await BlogContentCollection().insertOne(validatedData)
    return result
  } catch (error) {
    console.error(error.message)
    return undefined
  }
}

/**
 * Hàm này dùng để tìm blog's content. Chỉ có thể tìm thông qua `_id`
 * @param {string} blogContentId `_id` của blog's content
 */
async function findOneBlogContent(blogContentId) {
  try {
    let result = await BlogContentCollection().findOne({ _id: new ObjectId(blogContentId) })
    return result
  } catch (error) {
    console.error(error.message)
    return undefined
  }
}

/**
 * Hàm này dùng để tìm nhiều blog's content. Tuy nhiên thì chỉ có thể tìm thông qua các `_id`
 * @param {Array<string>} blogContentIds nhiều `_id` của blog's content
 */
async function findManyBlogContent(blogContentIds) {
  try {
    let pipeline = [
      {
        $addFields: {
          '_idString': {
            '$toString': '$_id'
          }
        }
      },
      {
        $match: {
          '_idString': {
            $in: blogContentIds
          }
        }
      }
    ]
    let cursor = BlogContentCollection().aggregate(pipeline)
    return await cursor.toArray()
  } catch (error) {
    console.error(error.message)
    return undefined
  }
}

/**
 * Hàm này dùng để xoá blog's content. Chỉ có thể xoá thông qua `_id`
 * @param {string} blogContentId `_id` của blog's content
 */
async function deleteOneBlogContent(blogContentId) {
  try {
    let result = await BlogContentCollection().deleteOne({ _id: new ObjectId(blogContentId) })
    return result
  } catch (error) {
    console.error(error.message)
    return undefined
  }
}
async function updateOneBlogContentByCases() {}

export const BlogContentModel = {
  insertOneBlogContent,
  findOneBlogContent,
  findManyBlogContent,
  deleteOneBlogContent,
  updateOneBlogContentByCases
}