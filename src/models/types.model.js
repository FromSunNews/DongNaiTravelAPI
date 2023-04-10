import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from 'config/mongodb'

// Define Types collection
const typesCollectionName = 'types'
const typesCollectionSchema = Joi.object({
  type_id: Joi.string().default(null),
  text_vi: Joi.string().default(null),
  text_en: Joi.string().default(null),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp().default(null)
})

// Phuong: Đây là những trường không được update (giá trị cố định không đổi)
const INVALID_UPDATE_FILEDS = ['_id', 'createdAt']

// Phuong: Tạo Schema để mongodb biết tạo bảng ntn
const validateSchema = async (data) => {
  return await typesCollectionSchema.validateAsync(data, { abortEarly: false })
}

// Phuong: Tìm dựa trên id của types.
const findOneById = async (id) => {
  try {
    const result = await getDB().collection(typesCollectionName)
    // Phuong: Bởi vì key _id trong mongodb đucợ luu ở dạng ObjectId nên phải
    // Phuong: chuyển qua ObjectId từ phía client đẩy lên mới tìm được
      .findOne({ type_id: id })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phuong: Trong đó, `$all` giúp xác định rằng cả hai giá trị 'oriPlaceId' và 'desPlaceId'
// đều phải có mặt trong mảng `geocoded_waypoints`.
const findOriDesPlaceId = async (oriPlaceId, desPlaceId) => {
  try {
    const result = await getDB().collection(typesCollectionName).find({
      geocoded_waypoints: [oriPlaceId, desPlaceId]
    }).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phương: tạo mới types
const createNew = async (data) => {
  try {
    const validatedValue = await validateSchema(data)

    const result = await getDB().collection(typesCollectionName).insertOne(validatedValue)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phuong: Cập nhật types thông qua _id
const update = async (id, data) => {
  try {
    const updateData = { ...data }

    // Phuong: CHỗ này là xóa những trường mà mình không cho phép update
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FILEDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const result = await getDB().collection(typesCollectionName).findOneAndUpdate(
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

export const TypesModel = {
  typesCollectionName,
  createNew,
  update,
  findOneById,
  findOriDesPlaceId
}

