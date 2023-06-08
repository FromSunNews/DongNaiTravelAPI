import { ObjectId } from 'mongodb'
import { getDB } from 'config/mongodb'

import {
  createProjectionStage,
  getExpectedFieldsProjection,
  getPipelineStagesWithSpecialtyFields,
  getFindStageWithFilters
} from 'utilities/mongo'
import {
  removePropsFromObj
} from 'utilities/function'

import {
  BlogFindStages,
  getSpecialtyBlogFields,
  BlogUpdateCases
} from './expressions'

import {
  blogCollectionSchema
} from 'schemas/blog.schema'

import {
  BlogDataProps
} from 'types'

const blogCollectionName = 'blogs'

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt', 'authorId']

function BlogCollection() {
  return getDB().collection(blogCollectionName)
}

const validateSchema = async (data) => {
  return await blogCollectionSchema.validateAsync(data, { abortEarly: false })
}

/**
 * Hàm này dùng để thêm thông tin của một blog.
 * @param {BlogDataProps} data Dữ liệu của blog.
 * @returns
 */
async function insertOneBlog(data) {
  try {
    let checkedData = await validateSchema(data)
    console.log('Checked data: ', checkedData)
    return await BlogCollection().insertOne(checkedData)
  } catch (error) {
    console.error(error.message)
    return undefined
  }
}
/*
  Để tìm một blog thì mình có 2 tiêu chí, một là theo id hai là theo tên của blog. Như vậy là được.
*/
/**
 * Hàm này dùng để tìm một blog theo `_id` và `name`
 * @param {{fields: string, name?: string, _id?: string}} data Một object chứa `_id` hoặc `name` từ `req.query`
 */
async function findOneBlog(data) {
  try {
    let { author, blogId, fields, user } = data
    console.log('Blog id: ', blogId)
    let pipeline = [
      {
        '$match': {
          ...blogId ? { '_id': new ObjectId(blogId) } : {},
          ...author ? { authorId: { $eq: author } } : {}
        }
      }
    ]
    let blogProjectionStage
    let specialtyBlogFields = getSpecialtyBlogFields()
    let [specialtyFieldsPipeline, newFields] = getPipelineStagesWithSpecialtyFields(specialtyBlogFields, fields, user)

    blogProjectionStage = createProjectionStage(getExpectedFieldsProjection(newFields))

    pipeline.push(...specialtyFieldsPipeline, ...blogProjectionStage)
    console.log('Pipeline: ', pipeline)
    console.log('New fields: ', newFields)
    let cursor = BlogCollection().aggregate(pipeline)
    /**
     * @type {BlogDataProps}
     */
    let result = await cursor.toArray()
    return result[0]
  } catch (error) {
    console.error(error.message)
    return undefined
  }
}

async function findManyBlog(data) {
  try {
    let { quality, fields, limit = 10, skip = 0, user, author } = data
    let qualitys = quality?.split(',')
    let pipeline = []
    let projectStage = []
    let findStage = {
      match: {
        $match: {
          ...author ? { authorId: { $eq: author } } : {}
        }
      },
      others: []
    }
    let specialtyBlogFields = getSpecialtyBlogFields()
    let [specialtyFieldsPipeline, newFields] = getPipelineStagesWithSpecialtyFields(specialtyBlogFields, fields, user)

    if (qualitys)
      findStage = Object.assign({}, findStage, getFindStageWithFilters(BlogFindStages, qualitys))

    projectStage = createProjectionStage(getExpectedFieldsProjection(newFields))

    pipeline.push(findStage.match, ...findStage.others, ...specialtyFieldsPipeline)

    if (projectStage[0]?.$project && Object.keys(projectStage[0]?.$project).length >= 1) pipeline.push(...projectStage)

    pipeline.push({ '$skip': skip }, { '$limit': limit })
    console.log('Pipeline: ', pipeline)
    const cursor = getDB().collection(blogCollectionName).aggregate(pipeline)
    const result = await cursor.toArray()
    return result
  } catch (error) {
    console.error(error.message)
    return undefined
  }
}

async function updateOneBlogByCase(id, updateData, updateCase = 'default') {
  try {
    let newUpdateData
    if (updateData) typeof updateData === 'string' | 'number' ? updateData : removePropsFromObj(updateData, INVALID_UPDATE_FIELDS)
    let [expression, extendedUpdateFilter] = BlogUpdateCases[updateCase](newUpdateData)
    let updateFilter = {
      _id: new ObjectId(id),
      ...extendedUpdateFilter
    }

    let result = await getDB().collection(blogCollectionName).updateOne(
      updateFilter,
      expression
    )

    return result
  } catch (error) {
    console.error(error.message)
    return undefined
  }
}

async function deleteOneBlog() {

}

export const BlogModel = {
  insertOneBlog,
  findOneBlog,
  findManyBlog,
  updateOneBlogByCase,
  deleteOneBlog
}