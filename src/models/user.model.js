import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from 'config/mongodb'
import { NotifModel } from './notif.model'

// Define User collection
const userCollectionName = 'users'
const userCollectionSchema = Joi.object({
  email: Joi.string().required(), // unique
  password: Joi.string().required(),
  username: Joi.string().required().min(2).max(30).trim(), // username sẽ không unique bởi vì sẽ có những đuôi email từ các nhà cũng cấp khác nhau

  displayName: Joi.string().required().min(2).max(30).trim(),
  avatar: Joi.string().default(null),
  coverPhoto: Joi.string().default(null),

  role: Joi.string().default('client'),
  location: {
    longitude: Joi.string().default(null),
    latitude: Joi.string().default(null)
  },
  savedSuggestions: Joi.array().items(Joi.string()).default([]),
  savedPlaces: Joi.array().items(Joi.string()).default([]),
  followerIds: Joi.array().items(Joi.string()).default([]),
  followingIds: Joi.array().items(Joi.string()).default([]),
  notifIds: Joi.array().items(Joi.string()).default([]),
  // lovedBlogIds: Joi.array().items(Joi.string()).default([]),
  // savedBlogIds: Joi.array().items(Joi.string()).default([]),

  receivePoints: Joi.number().integer().default(0),
  lostPoints: Joi.number().integer().default(0),
  otpToken: Joi.string().default(null),
  birthday: Joi.date().timestamp().default(null),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp().default(null)
})

// Phuong: Đây là những trường không được update (giá trị cố định không đổi)
const INVALID_UPDATE_FILEDS = ['_id', 'email', 'username', 'role', 'createdAt']

// Phuong: Tạo Schema để mongodb biết tạo bảng ntn
const validateSchema = async (data) => {
  return await userCollectionSchema.validateAsync(data, { abortEarly: false })
}

// Phuong: Tìm dựa trên id của user.
const findOneById = async (id) => {
  try {
    const result = await getDB().collection(userCollectionName)
    // Phuong: Bởi vì key _id trong mongodb đucợ luu ở dạng ObjectId nên phải
    // Phuong: chuyển qua ObjectId từ phía client đẩy lên mới tìm được
      .findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phuong: Tìm dựa trên email
const findOneByEmail = async (emailValue) => {
  try {
    const result = await getDB().collection(userCollectionName).findOne({ email: emailValue })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByUserName = async (username) => {
  try {
    const result = await getDB().collection(userCollectionName).findOne({ username: username })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phương: tạo mới user
const createNew = async (data) => {
  try {
    const validatedValue = await validateSchema(data)

    const result = await getDB().collection(userCollectionName).insertOne(validatedValue)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phuong: Cập nhật user thông qua _id
const update = async (id, data) => {
  try {
    const updateData = { ...data }
    // Phuong: CHỗ này là xóa những trường mà mình không cho phép update
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FILEDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const result = await getDB().collection(userCollectionName).findOneAndUpdate(
      // Phuong: Phải chuyển _id ở client thành ObjectId
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    return result.value
  } catch (error) {
    console.log('🚀 ~ file: user.model.js:105 ~ update ~ error:', error)
    throw new Error(error)
  }
}

const pushFollowerIds = async (userId, followingUserId) => {
  try {
    const result = await getDB().collection(userCollectionName).findOneAndUpdate(
      { _id: ObjectId(userId) },
      { $push: { followerIds: ObjectId(followingUserId) } },
      { returnDocument: 'after' }
    )

    return result.value
  } catch (error) {
    console.log('🚀 ~ file: user.model.js:105 ~ update ~ error:', error)
    throw new Error(error)
  }
}

// Phuong: Cập nhật user bằng push vào cuối mảng
const pushFollowingIds = async (userId, followerUserId) => {
  console.log('🚀 ~ file: user.model.js:130 ~ pushFollowingIds ~ followerUserId:', followerUserId)
  try {
    const result = await getDB().collection(userCollectionName).findOneAndUpdate(
      { _id: new ObjectId(userId) }, // Điều kiện để tìm document cần update
      { $push: { followingIds: ObjectId(followerUserId) } },
      { returnDocument: 'after' }
    )

    return result.value
  } catch (error) {
    console.log('🚀 ~ file: user.model.js:105 ~ update ~ error:', error)
    throw new Error(error)
  }
}

// Phuong: Cập nhật user bằng push vào cuối mảng
const pushNotifIds = async (userId, notifId) => {
  console.log('🚀 ~ file: user.model.js:130 ~ pushFollowingIds ~ followerUserId:', notifId)
  try {
    const result = await getDB().collection(userCollectionName).findOneAndUpdate(
      { _id: new ObjectId(userId) }, // Điều kiện để tìm document cần update
      { $push: { notifIds: ObjectId(notifId) } },
      { returnDocument: 'after' }
    )

    return result.value
  } catch (error) {
    console.log('🚀 ~ file: user.model.js:105 ~ update ~ error:', error)
    throw new Error(error)
  }
}


// Phuong: Cập nhật user thông qua _id
const resetPassword = async (id, data) => {
  try {
    const updateData = { ...data }


    const result = await getDB().collection(userCollectionName).findOneAndUpdate(
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

const findFollowerIdsInLimit = async (userId) => {
  try {
    const result = getDB().collection(userCollectionName).find(
      { _id: ObjectId(userId) }, // Điều kiện để tìm document cần lấy dữ liệu
      { followerIds: { $slice: -4 } } // Sử dụng $slice để lấy 4 phần tử cuối cùng từ mảng "following"
    ).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getFullInfoUser = async (userId) => {
  try {
    const result = await getDB().collection(userCollectionName).aggregate([
      { $match: {
        _id: ObjectId(userId)
      } },
      { $lookup: {
        from: NotifModel.notifCollectionName,
        localField: 'notifIds',
        foreignField: '_id',
        as: 'notifs'
      } }
    ]).toArray()

    return result[0] || []
  } catch (error) {
    throw new Error(error)
  }
}

const deteleFollowingId = async (userId, followingId) => {
  try {
    const result = await getDB().collection(userCollectionName).updateOne(
      { _id: ObjectId(userId) }, // Điều kiện truy vấn để tìm bản ghi cần cập nhật
      { $pull: { followingIds: followingId } } // Phương thức $pull để xóa phần tử có giá trị là abc khỏi mảng follower
    )
    console.log('🚀 ~ file: user.model.js:222 ~ deteleFollowingId ~ result:', result)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deteleFollowerId = async (userId, followerId) => {
  try {
    const result = await getDB().collection(userCollectionName).updateOne(
      { _id: ObjectId(userId) }, // Điều kiện truy vấn để tìm bản ghi cần cập nhật
      { $pull: { followerIds: followerId } } // Phương thức $pull để xóa phần tử có giá trị là abc khỏi mảng follower
    )
    console.log('🚀 ~ file: user.model.js:235 ~ deteleFollowerId ~ result:', result)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const UserModel = {
  userCollectionName,
  createNew,
  update,
  findOneById,
  findOneByEmail,
  findOneByUserName,
  resetPassword,
  pushFollowingIds,
  pushFollowerIds,
  pushNotifIds,
  findFollowerIdsInLimit,
  getFullInfoUser,
  deteleFollowingId,
  deteleFollowerId
}

