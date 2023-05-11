import { UserModel } from 'models/user.model'
import bcryptjs from 'bcryptjs'
import otpGenerator from 'otp-generator'
import { SendInBlueProvider } from 'providers/SendInBlueProvider'
import { RedisQueueProvider } from 'providers/RedisQueueProvider'

import { pickUser } from 'utilities/transform'
import { JwtProvider } from 'providers/JwtProvider'
import { CloudinaryProvider } from 'providers/CloudinaryProvider'
import { env } from 'config/environtment'
import { SendMessageToSlack } from 'providers/SendMessageToSlack'
import { NotifModel } from 'models/notif.model'
import axios from 'axios'
import { cloneDeep } from 'lodash'

const createNew = async (data) => {
  try {
    console.log('User data: ', data)
    delete data['confirmPassword']
    // check email have already in system yet ?
    const existUser = await UserModel.findOneByEmail(data.email)
    if (existUser) {
      throw new Error('Email already exist.')
    }

    // create database for the user inorder to save database
    // nameFromEmail: nếu email là trungquandev@gmail.com thì sẽ lấy được "trungquandev"
    const nameFromEmail = data.email.split('@')[0] || ''
    const userData = {
      email: data.email,
      password: bcryptjs.hashSync(data.password, 8),
      username: data.username ? data.username : nameFromEmail,
      displayName: data.fullName ? data.fullName : nameFromEmail,
      firstName: data.firstName,
      lastName: data.lastName
    }

    const createdUser = await UserModel.createNew(userData)
    const getUser = await UserModel.findOneById(createdUser.insertedId.toString())

    // Send email to the user click verify

    const subject = 'DongNaiTravelApp'
    const htmlContent = `
      <h4>Welcome to DongNaiTravelApp</h4>
      <p>Wish you have a lot of fun while accessing our application!</p>
      <p>Sincerely,<br/> - DongNaiTravelApp Team - </p>
    `
    await SendInBlueProvider.sendEmail(getUser.email, subject, htmlContent)

    return getUser

  } catch (error) {
    // console.log(error)
    throw new Error(error)
  }
}

const signIn = async (data) => {
  try {
    let existUser

    if (data.email)
      existUser = await UserModel.findOneByEmail(data.email)
    else
      existUser = await UserModel.findOneByUserName(data.username)

    if (!existUser) {
      throw new Error('Email or Username does not exsist.')
    }
    //Compare password
    if (!bcryptjs.compareSync(data.password, existUser.password)) {
      throw new Error('Your password is incorrect.')
    }

    let userInfoToStoreInJwtToken = {
      _id: existUser._id,
      email: existUser.email
    }


    // handle tokens
    const accessToken = await JwtProvider.generateToken(
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_SECRET_LIFE,
      userInfoToStoreInJwtToken
    )

    const refreshToken = await JwtProvider.generateToken(
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_SECRET_LIFE,
      userInfoToStoreInJwtToken
    )
    //
    const fullInfoUser = await UserModel.getFullInfoUser(existUser._id.toString())
    const notifs = cloneDeep(fullInfoUser.notifs)
    delete fullInfoUser.notifs
    // Phuong: trả về cho client refreshToken vs accessToken để lưu vào Persist store

    const result = {
      fullInfoUser: {
        accessToken,
        refreshToken,
        ...pickUser(fullInfoUser)
      },
      notifs: notifs
    }
    console.log('🚀 ~ file: user.service.js:105 ~ signIn ~ result:', result)
    return result

  } catch (error) {
    throw new Error(error)
  }
}

const sendOtp = async (data) => {
  console.log('🚀 ~ file: user.service.js:97 ~ sendOtp ~ data', data)
  try {
    let existUser

    if (data.email)
      existUser = await UserModel.findOneByEmail(data.email)

    if (!existUser) {
      throw new Error('Email does not exsist.')
    }

    // Phuong: https://www.npmjs.com/package/otp-generator
    // Phuong: Only generate digits otp code
    const optCode = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })

    // Phuong: should be in json
    const optCodeToStoreInJwtToken = {
      optCode: optCode.toString()
    }

    console.log('🚀 ~ file: user.service.js:112 ~ sendOtp ~ optCode', optCode)
    console.log('OTP_TOKEN_SECRET_SIGNATURE', env.OTP_TOKEN_SECRET_SIGNATURE)

    const otpToken = await JwtProvider.generateToken(
      env.OTP_TOKEN_SECRET_SIGNATURE,
      env.OTP_TOKEN_SECRET_LIFE,
      optCodeToStoreInJwtToken
    )

    // Send otp code to the user
    console.log('🚀 ~ Sending email...')
    const subject = 'DongNaiTravelApp: Please verify your email to reset password!'
    const htmlContent = `
      <p>Hello, this is your OTP :</p>
      <h3>${optCode}</h3>
      <p>Don't share it with anyone. This OTP will be valid for 2 minutes</p>
      <p>Sincerely, DongNaiTravelApp Team</p>
    `
    await SendInBlueProvider.sendEmail(data.email, subject, htmlContent)

    // Phuong: otpToken luu vao DB
    const updatedUser = await UserModel.updateOneAndGet(existUser._id, {
      otpToken: otpToken
    })

    return pickUser(updatedUser)

  } catch (error) {
    throw new Error(error)
  }
}

const verifyOtp = async (otpCode, email) => {
  console.log('🚀 ~ file: user.service.js:149 ~ verifyOtp ~ email', email)
  console.log('🚀 ~ file: user.service.js:148 ~ verifyOtp ~ otpCode', otpCode)
  try {
    let existUser

    if (email)
      existUser = await UserModel.findOneByEmail(email)

    if (!existUser) {
      throw new Error('Email does not exsist.')
    }

    console.log('🚀 ~ file: user.service.js:162 ~ verifyOtp ~ existUser.otpToken', existUser.otpToken)
    // Phuong: giải mã token
    const otpTokenDecoded = await JwtProvider.verifyToken(env.OTP_TOKEN_SECRET_SIGNATURE, existUser.otpToken.toString())
    console.log('🚀 ~ file: user.service.js:151 ~ verifyOtp ~ otpTokenDecoded', otpTokenDecoded.optCode)
    // Phuong: lấy được thông tin là _id và email tạo được phần body
    if (otpCode !== otpTokenDecoded.optCode)
      throw new Error('Otp code incorrect. Please input again!')
    return
  } catch (error) {
    throw new Error('Otp code expried!')
  }
}

const refreshToken = async (clientRefreshToken) => {
  try {
    // Phuong: giải mã token
    const refreshTokenDecoded = await JwtProvider.verifyToken(env.REFRESH_TOKEN_SECRET_SIGNATURE, clientRefreshToken)
    // Phuong: lấy được thông tin là _id và email tạo được phần body
    const userInfoToStoreInJwtToken = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }

    // Phuong: tạo mới accessToken vì accessToken là token có thời hạn ngắn
    const accessToken = await JwtProvider.generateToken(
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_SECRET_LIFE,
      userInfoToStoreInJwtToken
    )

    return { accessToken }
  } catch (error) {
    throw new Error(error)
  }
}

const resetPassword = async (data) => {
  try {
    // check email have already in system yet ?
    const existUser = await UserModel.findOneByEmail(data.email)

    if (!existUser) {
      throw new Error('Email dont exist.')
    }

    const encryptPassword = bcryptjs.hashSync(data.password, 8)

    if (encryptPassword === existUser.password)
      throw new Error('This password you used!')

    const updatedUser = await UserModel.resetPassword(existUser._id, {
      password: encryptPassword,
      updateAt: Date.now()
    })

    return pickUser(updatedUser)

  } catch (error) {
    // console.log(error)
    throw new Error(error)
  }
}

const updateByCase = async(id, data) => {
  try {
    let userId = id
    let updateCase = data.updateCase
    let updateData = data.updateData

    let result = await UserModel.updateOneAndGetByCase(userId, updateData, updateCase)

    if (!result) throw new Error('Cannot update user')

    return result
  } catch (error) {
    return undefined
  }
}

const update = async (data) => {
  console.log('🚀 ~ file: user.service.js:226 ~ update ~ data:', data)
  try {
    let updatedUser, updatedUserFollowing

    if (data.coverPhoto) {
      // Chuyển base64 về buffer
      const coverPhotoBuffer = Buffer.from(data.coverPhoto, 'base64')
      // Upload file len cloudinary
      const uploadResult = await CloudinaryProvider.streamUpload(coverPhotoBuffer, 'users')
      // console.log(uploadResult)
      console.log('🚀 ~ file: user.service.js:240 ~ update ~ uploadResult.url:', uploadResult.url)

      updatedUser = await UserModel.updateOneAndGet(data.currentUserId, {
        coverPhoto: uploadResult.url
      })
    } else if (data.avatar) {
      // Chuyển base64 về buffer
      const avatarBuffer = Buffer.from(data.avatar, 'base64')
      // Upload file len cloudinary
      const uploadResult = await CloudinaryProvider.streamUpload(avatarBuffer, 'users')
      // console.log(uploadResult)
      console.log('🚀 ~ file: user.service.js:240 ~ update ~ uploadResult.url:', uploadResult.url)

      updatedUser = await UserModel.updateOneAndGet(data.currentUserId, {
        avatar: uploadResult.url
      })
    } else if (data.userReceivedId && data.userSentId && data.notifId) {
      // 1. Updated cái thằng followingIds của thằng userSentId
      updatedUser = await UserModel.pushFollowingIds(data.userSentId, data.userReceivedId)
      // 2. Updated cái thằng followedIds của thằng userReceivedId
      await UserModel.pushFollowerIds(data.userReceivedId, data.userSentId)
      // 3. Updated cái thằng notifIds của thằng userReceivedId (nghĩa là thằng nhận có một thông báo mới)
      updatedUserFollowing = await UserModel.pushNotifIds(data.userReceivedId, data.notifId)
    } else if (data.currentUserId && data.userUnFollowId) {
      // đối với thằng user hủy follow thì xóa cái trường following
      await UserModel.deteleFollowingId(data.currentUserId, data.userUnFollowId)
      // đối với thằng user bị hủy thì xóa trường follower
      await UserModel.deteleFollowerId(data.userUnFollowId, data.currentUserId)
    }
    // else if (data.currentPassword && data.newPassword) {
    //   // change password
    //   const existUser = await UserModel.findOneById(userId)
    //   if (!existUser) {
    //     throw new Error('User not found.')
    //   }
    //   //Compare password
    //   if (!bcryptjs.compareSync(data.currentPassword, existUser.password)) {
    //     throw new Error('Your current password is incorrect!')
    //   }

    //   updatedUser = await UserModel.updateOneAndGet(userId, {
    //     password: bcryptjs.hashSync(data.newPassword, 8)
    //   })

    // }
    else {
      // general info user
      updatedUser = await UserModel.updateOneAndGet(data.currentUserId, data)
    }

    return {
      updatedUser: pickUser(updatedUser),
      updateUserFollowing: pickUser(updatedUserFollowing)
    }

  } catch (error) {
    throw new Error(error)
  }
}

const updateMap = async (data) => {
  console.log('🚀 ~ file: user.service.js:308 ~ updateMap ~ data:', data)
  try {
    let existUser

    if (data.currentUserId)
      existUser = await UserModel.findOneById(data.currentUserId)

    if (!existUser) {
      throw new Error('User does not exsist.')
    }

    delete data.currentUserId

    console.log('🚀 ~ file: user.service.js:328 ~ updateMap ~ data:', data)
    const updatedUser = await UserModel.updateOneAndGet(existUser._id.toString(), data)
    console.log('🚀 ~ file: user.service.js:323 ~ updateMap ~ updatedUser:', updatedUser)

    return updatedUser

  } catch (error) {
    console.log('🚀 ~ file: user.service.js:328 ~ updateMap ~ error:', error)
    throw new Error(error)
  }
}

const getMap = async (data) => {
  console.log('🚀 ~ file: user.service.js:334 ~ getMap ~ getMap:', getMap)
  try {
    let existUser

    if (data.currentUserId)
      existUser = await UserModel.findOneById(data.currentUserId)
    console.log('🚀 ~ file: user.service.js:339 ~ getMap ~ existUser:', existUser)

    if (!existUser) {
      throw new Error('User does not exsist.')
    }

    return {
      places: existUser.savedPlaces,
      suggestions: existUser.savedSuggestions
    }

  } catch (error) {
    throw new Error(error)
  }
}

const getListUrlAvatar = async (data) => {
  console.log('🚀 ~ file: user.service.js:342 ~ getListUrlAvatar ~ data:', data)
  try {
    let listUserFollow = [], listUrlAvatar = []
    // listUserFollow.push(data.userReceivedId)
    // Lấy tất cả các follower của thằng nhận ra nhưng chỉ giới hạn 4 thằng mới nhất cộng với thằng mới follow nauwx là 5
    // Mình sẽ lấy url 5 thằng đó lưu vô mảng
    const followerIdsRecord = await UserModel.findOneById(data.userReceivedId)
    console.log('🚀 ~ file: user.service.js:351 ~ getListUrlAvatar ~ followerIdsRecord:', followerIdsRecord)
    const moreUrlAvatar = followerIdsRecord.followerIds.length <= 4 ? 0 : followerIdsRecord.followerIds.length - 4
    const followerIds = followerIdsRecord.followerIds.length <= 4 ? followerIdsRecord.followerIds : followerIdsRecord.followerIds.slice(-4).reverse()
    listUserFollow = [
      data.userSentId,
      ...followerIds
    ]
    console.log('🚀 ~ file: user.service.js:354 ~ getListUrlAvatar ~ listUserFollow:', listUserFollow)
    // Vậy là có tất cả các follower r bây giờ tạo promises all

    await axios.all(
      listUserFollow.map(id => UserModel.findOneById(id))
    ).then(
      async (datasReturn) => {
        datasReturn.map(dataReturn => {
          listUrlAvatar.push(dataReturn.avatar)
        })
      }
    ).catch(err => console.log(err))

    return {
      listUrlAvatar: listUrlAvatar,
      moreUrlAvatar: moreUrlAvatar
    }
  } catch (error) {
    throw new Error(error)
  }
}

const getInfoUser = async (data) => {
  console.log('🚀 ~ file: user.service.js:342 ~ getListUrlAvatar ~ data:', data)
  try {
    const userReturn = await UserModel.findOneById(data.userId)
    if (!userReturn)
      throw new Error('User not found!')
    return pickUser(userReturn)
  } catch (error) {
    throw new Error(error)
  }
}

export const UserService = {
  createNew,
  signIn,
  refreshToken,
  updateByCase,
  update,
  sendOtp,
  verifyOtp,
  resetPassword,
  getMap,
  updateMap,
  getListUrlAvatar,
  getInfoUser
}
