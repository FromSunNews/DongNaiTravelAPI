import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from 'config/mongodb'

// Define Photos collection
const photosCollectionName = 'photos'
const photosCollectionSchema = Joi.object({
  place_photos_id: Joi.string().default(null),
  photos: Joi.array().default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp().default(null)
})

// Phuong: Đây là những trường không được update (giá trị cố định không đổi)
const INVALID_UPDATE_FILEDS = ['_id', 'place_photos_id', 'createdAt']

// Phuong: Tạo Schema để mongodb biết tạo bảng ntn
const validateSchema = async (data) => {
  return await photosCollectionSchema.validateAsync(data, { abortEarly: false })
}

// Phuong: Tìm dựa trên id của photos.
const findOneByPlaceId = async (id) => {
  try {
    const result = await getDB().collection(photosCollectionName)
    // Phuong: Bởi vì key _id trong mongodb đucợ luu ở dạng ObjectId nên phải
    // Phuong: chuyển qua ObjectId từ phía client đẩy lên mới tìm được
      .findOne({ place_photos_id: id })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phương: tạo mới photos
const createNew = async (data) => {
  try {
    const validatedValue = await validateSchema(data)

    const result = await getDB().collection(photosCollectionName).insertOne(validatedValue)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phuong: Cập nhật photos thông qua _id
const update = async (id, data) => {
  try {
    const updateData = { ...data }

    // Phuong: CHỗ này là xóa những trường mà mình không cho phép update
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FILEDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const result = await getDB().collection(photosCollectionName).findOneAndUpdate(
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

export const PhotosModel = {
  photosCollectionName,
  createNew,
  update,
  findOneByPlaceId
}

