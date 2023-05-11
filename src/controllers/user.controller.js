import { HttpStatusCode } from 'utilities/constants'
import { UserService } from 'services/user.service'
import { env } from 'config/environtment'

const createNew = async (req, res) => {
  try {
    const result = await UserService.createNew(req.body)
    console.log('New user: ', result)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const signIn = async (req, res) => {
  try {
    const result = await UserService.signIn(req.body)

    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const signOut = async (req, res) => {
  try {

    res.status(HttpStatusCode.OK).json({
      signedOut:true
    })

  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const privateKeys = async (req, res) => {
  try {

    res.status(HttpStatusCode.OK).json({
      map_api_key: env.MAP_API_KEY
    })
    console.log('privateKeys: ', env.MAP_API_KEY)

  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const refreshToken = async (req, res) => {
  try {
    const result = await UserService.refreshToken(req.body?.refreshToken)

    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    // console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: 'Please Sign In!'
    })
  }
}

const verifyOtp = async (req, res) => {
  try {
    console.log('Body req', req.body)
    await UserService.verifyOtp(req.body?.otpCode, req.body?.email)

    res.status(HttpStatusCode.OK).json({
      isAuthenticated: true
    })
  } catch (error) {
    // console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: 'OTP incorrect or OTP expired'
    })
  }
}

const sendOtp = async (req, res) => {
  try {
    const result = await UserService.sendOtp(req.body)

    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const resetPassword = async (req, res) => {
  try {
    const result = await UserService.resetPassword(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const updateByCase = async(req, res) => {
  try {
    let userId = req.jwtDecoded._id
    const result = await UserService.updateByCase(userId, req.body)

    return res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const update = async (req, res) => {
  try {
    // const userId = req.jwtDecoded._id

    const result = await UserService.update(req.body)

    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const getMap = async (req, res) => {
  try {
    const result = await UserService.getMap(req.body)
    console.log('🚀 ~ file: user.controller.js:127 ~ getMap ~ result:', result)

    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const updateMap = async (req, res) => {
  try {
    const result = await UserService.updateMap(req.body)

    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const getInfoUser = async (req, res) => {
  try {
    const result = await UserService.getInfoUser(req.body)

    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

export const UserController = {
  createNew,
  signIn,
  signOut,
  refreshToken,
  update,
  sendOtp,
  verifyOtp,
  resetPassword,
  privateKeys,
  getMap,
  updateMap,
  getInfoUser,
  updateByCase
}
