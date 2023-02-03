import { UserModel } from '*/models/user.model'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { SendInBlueProvider } from '*/providers/SendInBlueProvider'
import { RedisQueueProvider } from '*/providers/RedisQueueProvider'


import { WEBSITE_DOMAIN } from '*/utilities/constants'
import { pickUser } from '../utilities/transform'
import { JwtProvider } from '../providers/JwtProvider'
import { CloudinaryProvider } from '../providers/CloudinaryProvider'
import { env } from '*/config/environtment'
import { SendMessageToSlack } from '../providers/SendMessageToSlack'

const createNew = async (data) => {
  try {
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
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    }

    const createdUser = await UserModel.createNew(userData)
    const getUser = await UserModel.findOneById(createdUser.insertedId.toString())

    // Send email to the user click verify

    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getUser.email}&token=${getUser.verifyToken}`

    const subject = 'Trello Clone App: Please verify your email before using our services!'
    const htmlContent = `
      <h3>Here is your verification link:</h3>
      <h3>${verificationLink}</h3>
      <h3>Sincerely,<br/> - Trungquandev Official - </h3>
    `
    await SendInBlueProvider.sendEmail(getUser.email, subject, htmlContent)

    return pickUser(getUser)

  } catch (error) {
    // console.log(error)
    throw new Error(error)
  }
}

const verifyAccount = async (data) => {
  try {
    const existUser = await UserModel.findOneByEmail(data.email)
    if (!existUser) {
      throw new Error('Email do not exsist.')
    }
    if (existUser.isActive) {
      throw new Error('Your account is already active.')
    }
    if (data.token !== existUser.verifyToken) {
      throw new Error('Token is invalid!')
    }

    const updateData = {
      verifyToken: null,
      isActive: true
    }

    const updatedUser = await UserModel.update(existUser._id.toString(), updateData)

    // console.log(updatedUser)

    return pickUser(updatedUser)

  } catch (error) {
    throw new Error(error)
  }
}

const signIn = async (data) => {
  try {
    const existUser = await UserModel.findOneByEmail(data.email)
    if (!existUser) {
      throw new Error('Email does not exsist.')
    }
    if (!existUser.isActive) {
      throw new Error('Your account is not active.')
    }

    //Compare password
    if (!bcryptjs.compareSync(data.password, existUser.password)) {
      throw new Error('Your password is incorrect')
    }

    const userInfoToStoreInJwtToken = {
      _id: existUser._id,
      email: existUser.email
    }

    // handle tokens
    const accessToken = await JwtProvider.generateToken(
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_SECRET_LIFE,
      // 5,  //để dành test
      userInfoToStoreInJwtToken
    )

    const refreshToken = await JwtProvider.generateToken(
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_SECRET_LIFE,
      // 15, //để dành test
      userInfoToStoreInJwtToken
    )

    return { accessToken, refreshToken, ...pickUser(existUser) }

  } catch (error) {
    throw new Error(error)
  }
}

const refreshToken = async (clientRefreshToken) => {
  try {
    // verify // giải mã token
    const refreshTokenDecoded = await JwtProvider.verifyToken(env.REFRESH_TOKEN_SECRET_SIGNATURE, clientRefreshToken)
    // pull request 11/15/2022
    const userInfoToStoreInJwtToken = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }

    // handle tokens
    const accessToken = await JwtProvider.generateToken(
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_SECRET_LIFE,
      // 5, //để dành test
      userInfoToStoreInJwtToken
    )

    return { accessToken }
  } catch (error) {
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
  verifyAccount,
  signIn,
  refreshToken,
  update
}
