import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from '*/config/mongodb'

// Define User collection
const userCollectionName = 'users'
const userCollectionSchema = Joi.object({
  email: Joi.string().required(), // unique
  password: Joi.string().required(),
  username: Joi.string().required().trim(), // username sẽ không unique bởi vì sẽ có những đuôi email từ các nhà cũng cấp khác nhau

  displayName: Joi.string().required().trim(),
  avatar: Joi.string().default(null),

  role: Joi.string().default('client'),

  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp().default(null)
})

const INVALID_UPDATE_FILEDS = ['_id', 'email', 'username', 'createdAt']

const validateSchema = async (data) => {
  return await userCollectionSchema.validateAsync(data, { abortEarly: false })
}

const findOneById = async (id) => {
  try {
    const result = await getDB().collection(userCollectionName).findOne({ _id: ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByEmail = async (emailValue) => {
  try {
    const result = await getDB().collection(userCollectionName).findOne({ email: emailValue })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const createNew = async (data) => {
  try {
    const validatedValue = await validateSchema(data)

    const result = await getDB().collection(userCollectionName).insertOne(validatedValue)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (id, data) => {
  try {
    const updateData = { ...data }

    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FILEDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const result = await getDB().collection(userCollectionName).findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

export const UserModel = {
  userCollectionName,
  createNew,
  update,
  findOneById,
  findOneByEmail
}

