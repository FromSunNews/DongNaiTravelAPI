import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from 'config/mongodb'

// Define notif collection
const notifCollectionName = 'notifs'
const notifCollectionSchema = Joi.object({
  userReceivedId: Joi.string().required(),
  userSentId: Joi.string().required(),

  userSent: Joi.object().default({}),


  typeNofif: Joi.string().required(),

  desc: Joi.object().default({}),
  content: Joi.object().default({}),
  _destroy: Joi.boolean().default(false),
  _isVisited: Joi.boolean().default(false),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp().default(null)
})

const INVALID_UPDATE_FIELDS = ['_id', 'userSentId', 'userReceivedId', 'createdAt', 'typeNofif', 'desc', 'content']

const validateSchema = async (data) => {
  return await notifCollectionSchema.validateAsync(data, { abortEarly: false })
}

const findOneById = async (id) => {
  try {
    const result = await getDB().collection(notifCollectionName).findOne({ _id: ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const createNewNotif = async (data) => {
  try {
    const validatedValue = await validateSchema(data)

    const result = await getDB().collection(notifCollectionName).insertOne(validatedValue)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateNotif = async (id, data) => {
  try {
    const updateData = { ...data }

    // Phuong: CHỗ này là xóa những trường mà mình không cho phép update
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const result = await getDB().collection(notifCollectionName).findOneAndUpdate(
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

const updateManyNotifs = async (arrayNotifs) => {
  try {
    //  Chuyển arrayNotifs về dạng ObjectID
    let newArray = []

    arrayNotifs.forEach( element => {
      element = new ObjectId(element)
      newArray.push(element)
    })


    const result = await getDB().collection(notifCollectionName).updateMany(
      { _id: { $in: newArray } },
      { $set: { _isVisited: true } }
    )
    console.log('🚀 ~ file: notif.model.js:90 ~ updateManyNotifs ~ result:', result)

    return result.value
  } catch (error) {
    throw new Error(error)
  }
}


export const NotifModel = {
  notifCollectionName,
  createNewNotif,
  findOneById,
  updateNotif,
  updateManyNotifs
}


