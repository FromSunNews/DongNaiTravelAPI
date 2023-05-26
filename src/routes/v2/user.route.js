import express from 'express'
import { UserController } from 'controllers/v2/user.controller'
import { UserValidation } from 'validations/v2/user.validation'

import { AuthMiddleware } from 'middlewares/v2/auth.middleware'
import { UploadMiddleware } from 'middlewares/v2/upload.middleware'

// console.log(UploadMiddleware)
const router = express.Router()

// router.route('/sign_up')
//   .post(UserValidation.createNew, UserController.createNew)

router.route('/verify')
  .put(UserValidation.verifyAccount, UserController.verifyAccount)

router.route('/reset_password')
  .put(UserValidation.resetPassword, UserController.resetPassword)

router.route('/sign_in')
  .post(UserValidation.signIn, UserController.signIn)

router.route('/send_email')
  .post(UserValidation.sendEmail, UserController.sendEmail)

router.route('/sign_out')
  .delete(UserController.signOut)

router.route('/refresh_token')
  .get(UserController.refreshToken)

// router.route('/update')
//   .put(AuthMiddleware.isAuthorized, UploadMiddleware.upload.single('avatar'), UserValidation.update, UserController.update)


export const userRoutes = router
