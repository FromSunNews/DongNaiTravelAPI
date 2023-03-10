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
  editorial_summary: Joi.object().default(null),

  types: Joi.array().default(null),

  url: Joi.string().default(null),
  utc_offset: Joi.number().default(null),
  vicinity: Joi.string().default(null),
  website: Joi.string().default(null),
  wheelchair_accessible_entrance: Joi.boolean().default(null),
  permanently_closed : Joi.boolean().default(null),
  curbside_pickup: Joi.boolean().default(null),
  delivery: Joi.boolean().default(null),
  dine_in: Joi.boolean().default(null),
  price_level: Joi.number().default(null),
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

// Phuong: ????y l?? nh???ng tr?????ng kh??ng ???????c update (gi?? tr??? c??? ?????nh kh??ng ?????i)
const INVALID_UPDATE_FILEDS = ['_id', 'place_id', 'createdAt']

// Phuong: T???o Schema ????? mongodb bi???t t???o b???ng ntn
const validateSchema = async (data) => {
  return await mapCollectionSchema.validateAsync(data, { abortEarly: false })
}

// Phuong: T??m d???a tr??n id c???a map.
const findOneById = async (id) => {
  try {
    const result = await getDB().collection(mapCollectionName)
    // Phuong: B???i v?? key _id trong mongodb ??uc??? luu ??? d???ng ObjectId n??n ph???i
    // Phuong: chuy???n qua ObjectId t??? ph??a client ?????y l??n m???i t??m ???????c
      .findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phuong: T??m d???a tr??n place_id
const findOneByPlaceId = async (place_id) => {
  try {
    const result = await getDB().collection(mapCollectionName).findOne({ place_id: place_id })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Ph????ng: t???o m???i map
const createNew = async (data) => {
  try {
    const validatedValue = await validateSchema(data)

    const result = await getDB().collection(mapCollectionName).insertOne(validatedValue)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phuong: C???p nh???t map th??ng qua _id
const update = async (id, data) => {
  try {
    const updateData = { ...data }

    // Phuong: CH??? n??y l?? x??a nh???ng tr?????ng m?? m??nh kh??ng cho ph??p update
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FILEDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const result = await getDB().collection(mapCollectionName).findOneAndUpdate(
      // Phuong: Ph???i chuy???n _id ??? client th??nh ObjectId
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
  // console.log('???? ~ file: map.model.js:141 ~ createManyPlaces ~ places', places)
  try {
    // Phuong: https://www.mongodb.com/docs/v6.0/reference/method/db.collection.insertMany/#mongodb-method-db.collection.insertMany
    const result = await getDB().collection(mapCollectionName).insertMany(places)
    console.log('???? ~ Successfully ~ createManyPlaces ~ places')

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

