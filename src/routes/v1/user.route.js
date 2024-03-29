import express from 'express'
import { UserController } from 'controllers/user.controller'
import { UserValidation } from 'validations/user.validation'

import { AuthMiddleware } from 'middlewares/auth.middleware'
import { UploadMiddleware } from 'middlewares/upload.middleware'

// console.log(UploadMiddleware)
const router = express.Router()

router.route('/sign_up')
  .post(UserValidation.createNew, UserController.createNew)

router.route('/sign_in')
  .post(UserValidation.signIn, UserController.signIn)

router.route('/sign_out')
  .delete(UserController.signOut)

router.route('/refresh_token')
  .get(UserController.refreshToken)

router.route('/send_otp')
  .post(UserValidation.sendOtp, UserController.sendOtp)

router.route('/verify_otp')
  .post(UserController.verifyOtp)

// router.route('/update')
//   .put(AuthMiddleware.isAuthorized, UploadMiddleware.upload.single('avatar'), UserValidation.update, UserController.update)

router.route('/update')
  .post(UserValidation.update, UserController.update)

router.route('/update_by_case')
  .post(AuthMiddleware.isAuthorized, UserController.updateOneByCase)

router.route('/reset_password')
  .put(UserValidation.resetPassword, UserController.resetPassword)

router.route('/private_keys')
  .get(UserController.privateKeys)

router.route('/get_map_user')
  .post(UserController.getMap)

router.route('/update_map_user')
  .post(UserController.updateMap)

router.route('/get_info_user')
  .post(UserController.getInfoUser)

export const userRoutes = router
