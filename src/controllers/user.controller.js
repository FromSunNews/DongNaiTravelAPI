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
  signIn,
  signOut,
  refreshToken,
  update
}
