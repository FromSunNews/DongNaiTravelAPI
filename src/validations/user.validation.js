import Joi from 'joi'
import { HttpStatusCode } from 'utilities/constants'
import {
  EMAIL_RULE,
  PASSWORD_RULE
} from 'utilities/validators'

const createNew = async (req, res, next) => {
  const condition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message('Email is invalid!'),
    username: Joi.string().required().min(2).max(30).trim(),
    password: Joi.string().required().pattern(PASSWORD_RULE).message('Password is invalid!'),
    /**
    * Phuong:
    * Custom messsage với thằng Joi.ref khá khó tìm trong docs, cách tìm là bắt keyword để tìm những người từng hỏi chung 1 vấn đề,
    * Ví dụ như link bên dưới, tìm ra cách custom bằng any.only trong hàm messages(json object)
    * https://github.com/sideway/joi/issues/2147#issuecomment-537372635
    * Lưu ý ở đầy có thể dùng confirmPassword: Joi.ref('password') luôn nhưng chưa tìm ra cách custom message, toàn lỗi :))
    *
    * Ngoài ra đây là để học cách custom message nhé, còn thực tế ở FE chúng ta đã validate đẹp rồi, thì thông thường BE cứ để default message trả về
    * trường hợp nào thật sự cần làm đẹp message thì mới làm nhé
    */
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
      'any.only': 'Password Confirmation is not match',
      'any.required': 'Password Confirmation is required'
    }),
    birthday: Joi.date().timestamp(),
    firstName: Joi.string().min(2).max(30).trim(),
    lastName: Joi.string().min(2).max(30).trim()

  })
  try {
    await condition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      errors: new Error(error).message
    })
  }
}

const signIn = async (req, res, next) => {
  const condition = Joi.object({
    username: Joi.string().min(2).max(30).trim(),
    email: Joi.string().pattern(EMAIL_RULE).message('Email is invalid'),
    password: Joi.string().required().pattern(PASSWORD_RULE).message('Password is invalid')
  })
  try {
    await condition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      errors: new Error(error).message
    })
  }
}

const sendOtp = async (req, res, next) => {
  const condition = Joi.object({
    email: Joi.string().pattern(EMAIL_RULE).message('Email is invalid')
  })
  try {
    await condition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      errors: new Error(error).message
    })
  }
}

const update = async (req, res, next) => {
  const condition = Joi.object({
    displayName: Joi.string().trim(),
    currentPassword: Joi.string().pattern(PASSWORD_RULE).message('Current Password is invalid'),
    newPassword: Joi.string().pattern(PASSWORD_RULE).message('New Password is invalid'),
    savedSuggestions: Joi.string().trim(),
    savedPlaces: Joi.string().trim()
  })
  try {
    await condition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })
    next()
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      errors: new Error(error).message
    })
  }
}

const resetPassword = async (req, res, next) => {
  const condition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message('Email is invalid!'),
    password: Joi.string().required().pattern(PASSWORD_RULE).message('Password is invalid!'),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
      'any.only': 'Password Confirmation is not match',
      'any.required': 'Password Confirmation is required'
    })
  })
  try {
    await condition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })
    next()
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      errors: new Error(error).message
    })
  }
}

export const UserValidation = {
  createNew,
  signIn,
  update,
  sendOtp,
  resetPassword
}
