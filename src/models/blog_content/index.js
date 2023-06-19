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
async function findOneBlogContent() {}
async function deleteOneBlogContent() {}
async function updateOneBlogContentByCases() {}

export const BlogContentModel = {
  insertOneBlogContent,
  findOneBlogContent,
  deleteOneBlogContent,
  updateOneBlogContentByCases
}