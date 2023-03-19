import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from '*/config/mongodb'

// Define Direction collection
const directionCollectionName = 'directions'
const directionCollectionSchema = Joi.object({
  transport: Joi.string().default(null),
  geocoded_waypoints: Joi.array().default(null),
  data: Joi.object().default(null),
  callFrom: Joi.string().default('GCP'),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp().default(null)
})

// Phuong: Đây là những trường không được update (giá trị cố định không đổi)
const INVALID_UPDATE_FILEDS = ['_id', 'createdAt']

// Phuong: Tạo Schema để mongodb biết tạo bảng ntn
const validateSchema = async (data) => {
  return await directionCollectionSchema.validateAsync(data, { abortEarly: false })
}

// Phuong: Tìm dựa trên id của direction.
const findOneById = async (id) => {
  try {
    const result = await getDB().collection(directionCollectionName)
    // Phuong: Bởi vì key _id trong mongodb đucợ luu ở dạng ObjectId nên phải
    // Phuong: chuyển qua ObjectId từ phía client đẩy lên mới tìm được
      .findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phuong: Trong đó, `$all` giúp xác định rằng cả hai giá trị 'oriPlaceId' và 'desPlaceId'
// đều phải có mặt trong mảng `geocoded_waypoints`.
const findOriDesPlaceId = async (oriPlaceId, desPlaceId) => {
  try {
    const result = await getDB().collection(directionCollectionName).find({
      geocoded_waypoints: [oriPlaceId, desPlaceId]
    }).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phương: tạo mới direction
const createNew = async (data) => {
  try {
    const validatedValue = await validateSchema(data)

    const result = await getDB().collection(directionCollectionName).insertOne(validatedValue)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phuong: Cập nhật direction thông qua _id
const update = async (id, data) => {
  try {
    const updateData = { ...data }

    // Phuong: CHỗ này là xóa những trường mà mình không cho phép update
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FILEDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const result = await getDB().collection(directionCollectionName).findOneAndUpdate(
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

export const DirectionModel = {
  directionCollectionName,
  createNew,
  update,
  findOneById,
  findOriDesPlaceId
}

