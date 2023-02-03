import { HttpStatusCode } from '*/utilities/constants'
import { UserService } from '*/services/user.service'

import ms from 'ms'

const createNew = async (req, res) => {
  try {
    const result = await UserService.createNew(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const verifyAccount = async (req, res) => {
  try {
    const result = await UserService.verifyAccount(req.body)
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

    // xử lý cookie ở đây
    //https://expressjs.com/en/api.html

    //https://www.npmjs.com/package/ms
    //chinh format cho maxAge
    res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: ms('14 days') })
    res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: ms('14 days') })

    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const signOut = async (req, res) => {
  try {
    // delete cookie
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(HttpStatusCode.OK).json({
      signedOut:true
    })

  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}


const refreshToken = async (req, res) => {
  try {
    const result = await UserService.refreshToken(req.cookies?.refreshToken)

    // xử lý cookie ở đây
    //https://expressjs.com/en/api.html

    //https://www.npmjs.com/package/ms
    //chinh format cho maxAge
    res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: ms('14 days') })

    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    // console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: 'Please Sign In!'
    })
  }
}

const update = async (req, res) => {
  try {
    const userId = req.jwtDecoded._id
    const userAvatarFile = req.file
    const result = await UserService.update(userId, req.body, userAvatarFile)

    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

export const UserController = {
  createNew,
  verifyAccount,
  signIn,
  signOut,
  refreshToken,
  update
}
