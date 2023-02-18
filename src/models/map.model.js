import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from '*/config/mongodb'

// Define Map collection
const mapCollectionName = 'maps'
const mapCollectionSchema = Joi.object({
  place_id: Joi.string().required(),
  reference: Joi.string().default(null),

  plus_code: Joi.object().default(null),

  business_status : Joi.string().default(null),

  current_opening_hours: Joi.object().default(null),
  opening_hours: Joi.object().default(null),
  // address name
  formatted_address : Joi.string().default(null),
  name : Joi.string().default(null),
  address_components: Joi.array().default(null),
  adr_address: Joi.string().default(null),

  // number phone
  formatted_phone_number : Joi.string().default(null),
  international_phone_number: Joi.string().default(null),

  geometry : Joi.object().default(null),


  // icons
  icon : Joi.string().default(null),
  icon_background_color : Joi.string().default(null),
  icon_mask_base_uri : Joi.string().default(null),

  // photos:
  photos: Joi.array().default(null),

  rating: Joi.number().default(null),
  user_ratings_total: Joi.number().default(null),

  reviews: Joi.array().default(null),

  types: Joi.array().default(null),

  url: Joi.string().default(null),
  utc_offset: Joi.number().default(null),
  vicinity: Joi.string().default(null),
  website: Joi.string().default(null),
  wheelchair_accessible_entrance: Joi.boolean().default(null),

  curbside_pickup: Joi.boolean().default(null),
  delivery: Joi.boolean().default(null),
  dine_in: Joi.boolean().default(null),
  price_level: Joi.number().default(null),
  permanently_closed: Joi.boolean().default(null),
  reservable: Joi.boolean().default(null),
  scope: Joi.string().default(null),
  secondary_opening_hours: Joi.array().default(null),
  serves_beer: Joi.boolean().default(null),
  serves_breakfast: Joi.boolean().default(null),
  serves_brunch: Joi.boolean().default(null),
  serves_dinner: Joi.boolean().default(null),
  serves_lunch: Joi.boolean().default(null),
  serves_vegetarian_food: Joi.boolean().default(null),
  serves_wine: Joi.boolean().default(null),
  takeout: Joi.boolean().default(null),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp().default(null)
})

// Phuong: Đây là những trường không được update (giá trị cố định không đổi)
const INVALID_UPDATE_FILEDS = ['_id', 'place_id', 'createdAt']

// Phuong: Tạo Schema để mongodb biết tạo bảng ntn
const validateSchema = async (data) => {
  return await mapCollectionSchema.validateAsync(data, { abortEarly: false })
}

// Phuong: Tìm dựa trên id của map.
const findOneById = async (id) => {
  try {
    const result = await getDB().collection(mapCollectionName)
    // Phuong: Bởi vì key _id trong mongodb đucợ luu ở dạng ObjectId nên phải
    // Phuong: chuyển qua ObjectId từ phía client đẩy lên mới tìm được
      .findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phuong: Tìm dựa trên place_id
const findOneByPlaceId = async (place_id) => {
  try {
    const result = await getDB().collection(mapCollectionName).findOne({ place_id: place_id })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phương: tạo mới map
const createNew = async (data) => {
  try {
    const validatedValue = await validateSchema(data)

    const result = await getDB().collection(mapCollectionName).insertOne(validatedValue)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phuong: Cập nhật map thông qua _id
const update = async (id, data) => {
  try {
    const updateData = { ...data }

    // Phuong: CHỗ này là xóa những trường mà mình không cho phép update
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FILEDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const result = await getDB().collection(mapCollectionName).findOneAndUpdate(
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

const createManyPlaces = async (places) => {
  try {
    // Phuong: https://www.mongodb.com/docs/v6.0/reference/method/db.collection.insertMany/#mongodb-method-db.collection.insertMany
    const result = await getDB().collection(mapCollectionName).insertMany(places)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const MapModel = {
  mapCollectionName,
  createNew,
  update,
  findOneById,
  findOneByPlaceId,
  createManyPlaces
}

