import { UserModel } from '*/models/user.model'
import bcryptjs from 'bcryptjs'
import otpGenerator from 'otp-generator'
import { SendInBlueProvider } from '*/providers/SendInBlueProvider'
import { RedisQueueProvider } from '*/providers/RedisQueueProvider'

import { pickUser } from '../utilities/transform'
import { JwtProvider } from '../providers/JwtProvider'
import { CloudinaryProvider } from '../providers/CloudinaryProvider'
import { env } from '*/config/environtment'
import { SendMessageToSlack } from '../providers/SendMessageToSlack'

const createNew = async (data) => {
  try {
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
      displayName: data.fullName ? data.fullName : nameFromEmail
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
      throw new Error('Email does not exsist.')
    }
    //Compare password
    if (!bcryptjs.compareSync(data.password, existUser.password)) {
      throw new Error('Your password is incorrect')
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
    // Phuong: trả về cho client refreshToken vs accessToken để lưu vào Persist store
    return { accessToken, refreshToken, ...pickUser(existUser) }

  } catch (error) {
    throw new Error(error)
  }
}

const sendOtp = async (data) => {
  console.log("🚀 ~ file: user.service.js:97 ~ sendOtp ~ data", data)
  try {
    let existUser

    if (data.email)
      existUser = await UserModel.findOneByEmail(data.email)
      
    if (!existUser) {
      throw new Error('Email does not exsist.')
    }

    // Phuong: https://www.npmjs.com/package/otp-generator
    // Phuong: Only generate digits otp code
    const optCode =  otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })
    
    // Phuong: should be in json 
    const optCodeToStoreInJwtToken = {
      optCode: optCode.toString()
    }

    console.log("🚀 ~ file: user.service.js:112 ~ sendOtp ~ optCode", optCode)
    console.log("OTP_TOKEN_SECRET_SIGNATURE", env.OTP_TOKEN_SECRET_SIGNATURE)

    const otpToken = await JwtProvider.generateToken(
      env.OTP_TOKEN_SECRET_SIGNATURE,
      env.OTP_TOKEN_SECRET_LIFE,
      optCodeToStoreInJwtToken
    )

    // Send otp code to the user
    console.log("🚀 ~ Sending email...")
    const subject = 'DongNaiTravelApp: Please verify your email to reset password!'
    const htmlContent = `
      <p>Hello, this is your OTP :</p>
      <h3>${optCode}</h3>
      <p>Don't share it with anyone. This OTP will be valid for 2 minutes</p>
      <p>Sincerely, DongNaiTravelApp Team</p>
    `
    await SendInBlueProvider.sendEmail(data.email, subject, htmlContent)

    // Phuong: otpToken luu vao DB
    const updatedUser = await UserModel.update(existUser._id, {
      otpToken: otpToken
    })

    return pickUser(updatedUser)
    
  } catch (error) {
    throw new Error(error)
  }
}

const verifyOtp = async (otpCode, email) => {
  console.log("🚀 ~ file: user.service.js:149 ~ verifyOtp ~ email", email)
  console.log("🚀 ~ file: user.service.js:148 ~ verifyOtp ~ otpCode", otpCode)
  try {
    let existUser

    if (email)
      existUser = await UserModel.findOneByEmail(email)

    if (!existUser) {
      throw new Error('Email does not exsist.')
    }

    console.log("🚀 ~ file: user.service.js:162 ~ verifyOtp ~ existUser.otpToken", existUser.otpToken)
    // Phuong: giải mã token
    const otpTokenDecoded = await JwtProvider.verifyToken(env.OTP_TOKEN_SECRET_SIGNATURE, existUser.otpToken.toString())
    console.log("🚀 ~ file: user.service.js:151 ~ verifyOtp ~ otpTokenDecoded", otpTokenDecoded.optCode)
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

const update = async ( userId, data, userAvatarFile ) => {
  try {
    let updatedUser = {}
    let shouldUpdateCardComments = false

    if (userAvatarFile) {
      // Upload file len cloudinary
      const uploadResult = await CloudinaryProvider.streamUpload(userAvatarFile.buffer, 'users')
      // console.log(uploadResult)

      updatedUser = await UserModel.update(userId, {
        avatar: uploadResult.secure_url
      })

      shouldUpdateCardComments = true

    } else if (data.currentPassword && data.newPassword) {
      // change password
      const existUser = await UserModel.findOneById(userId)
      if (!existUser) {
        throw new Error('User not found.')
      }
      //Compare password
      if (!bcryptjs.compareSync(data.currentPassword, existUser.password)) {
        throw new Error('Your current password is incorrect!')
      }

      updatedUser = await UserModel.update(userId, {
        password: bcryptjs.hashSync(data.newPassword, 8)
      })

    } else {
      // general info user
      updatedUser = await UserModel.update(userId, data)
      if (data.displayName) {
        shouldUpdateCardComments = true
      }
    }

    // Chạy background job cho việc cập nhật rất nhiều bản ghi
    // Background tasks: https://github.com/mkamrani/example-node-bull/blob/main/basic/index.js
    if (shouldUpdateCardComments) {
      // Bước 1: Khởi tạo một hàng đợi để cập nhật comment của nhiều card
      let updatedCardCommentsQueue = RedisQueueProvider.generateQueue('updatedCardCommentsQueue')
      // Bước 2: Định nghĩa ra những việc cần làm trong tiến trình hàng đợi
      updatedCardCommentsQueue.process(async (job, done) => {
        try {
          // job.data ở đây chính là updatedUser được truyền vào từ bước 4
          // const cardCommentsUpdated = await CardModel.updateManyComments(job.data)
          done(null, cardCommentsUpdated)
        } catch (error) {
          done(new Error('Error from updatedCardCommentsQueue.process'))
        }
      })
      // B3: Check completed hoặc failed, tùy trường hợp yêu cầu mà cần cái event này, để bắn thông báo khi job chạy xong chẳng hạn
      // Nhiều event khác: https://github.com/OptimalBits/bull/blob/HEAD/REFERENCE.md#events
      updatedCardCommentsQueue.on('completed', (job, result) => {
        // Bắn kết quả về Slack
        SendMessageToSlack.sendToSlack(`Job với id là: ${job.id} và tên job: *${job.queue.name}* đã *xong* và kết quả là: ${result}`)
      })

      updatedCardCommentsQueue.on('failed', (job, error) => {
        // Bắn lỗi về Slack hoặc Telegram ...
        SendMessageToSlack.sendToSlack(`Notification: Job với id là ${job.id} và tên job là *${job.queue.name}* đã bị *lỗi* \n\n ${error}`)
      })

      // Bước 4: bước quan trọng cuối cùng: Thêm vào vào đợi Redis để xử lý
      updatedCardCommentsQueue.add(updatedUser, {
        attempts: 3, // số lần thử lại nếu lỗi
        backoff: 5000 //khoảng thời gian delay giữa các lần thử lại job
      })

    }

    return pickUser(updatedUser)

  } catch (error) {
    throw new Error(error)
  }
}

export const UserService = {
  createNew,
  signIn,
  refreshToken,
  update,
  sendOtp,
  verifyOtp,
  resetPassword
}
