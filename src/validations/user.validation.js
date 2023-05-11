import Joi from 'joi'
import { HttpStatusCode } from 'utilities/constants'
import {
  EMAIL_RULE,
  PASSWORD_RULE
} from 'utilities/validators'

import { userSignupSchema } from 'schemas/user.schema'

const createNew = async (req, res, next) => {
  const condition = userSignupSchema
  try {
    console.log('Start validate')
    await condition.validateAsync(req.body, { abortEarly: false })
    console.log('Pass validate')
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
