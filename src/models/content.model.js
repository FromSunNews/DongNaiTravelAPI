import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from '*/config/mongodb'

// Define Content collection
const contentCollectionName = 'content'
const contentCollectionSchema = Joi.object({
  content_id: Joi.string().default(null),
  // whole is content
  plainText: Joi.object().default({}),
  // text-to-speech
  plainTextBase64: Joi.object().default({}),
  // For markdown
  plainTextMarkFormat: Joi.object().default({}),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp().default(null)
})

// Phuong: Đây là những trường không được update (giá trị cố định không đổi)
const INVALID_UPDATE_FILEDS = ['_id', 'content_id', 'createdAt']

// Phuong: Tạo Schema để mongodb biết tạo bảng ntn
const validateSchema = async (data) => {
  return await contentCollectionSchema.validateAsync(data, { abortEarly: false })
}

// Phuong: Tìm dựa trên id của content.
const findOneById = async (id) => {
  try {
    const result = await getDB().collection(contentCollectionName)
    // Phuong: Bởi vì key _id trong mongodb đucợ luu ở dạng ObjectId nên phải
    // Phuong: chuyển qua ObjectId từ phía client đẩy lên mới tìm được
      .findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phuong: Tìm dựa trên id của content.
const findOneByContentId = async (id) => {
  try {
    const result = await getDB().collection(contentCollectionName)
    // Phuong: Bởi vì key _id trong mongodb đucợ luu ở dạng ObjectId nên phải
      .findOne({ content_id: id })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phương: tạo mới content
const createNew = async (data) => {
  try {
    const validatedValue = await validateSchema(data)

    const result = await getDB().collection(contentCollectionName).insertOne(validatedValue)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phuong: Cập nhật content thông qua _id
const updateById = async (id, data) => {
  try {
    const updateData = { ...data }

    // Phuong: CHỗ này là xóa những trường mà mình không cho phép update
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FILEDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const result = await getDB().collection(contentCollectionName).findOneAndUpdate(
      // Phuong: Phải chuyển _id ở client thành ObjectId
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

// Phuong: Cập nhật content thông qua content_id
const updateByContentId = async (content_id, data) => {
  try {
    const updateData = { ...data }

    // Phuong: CHỗ này là xóa những trường mà mình không cho phép update
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FILEDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const result = await getDB().collection(contentCollectionName).findOneAndUpdate(
      { content_id: content_id },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

export const ContentModel = {
  contentCollectionName,
  createNew,
  updateById,
  updateByContentId,
  findOneByContentId,
  findOneById
}

