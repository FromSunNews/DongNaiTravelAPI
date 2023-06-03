"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userRoutes = void 0;
var _express = _interopRequireDefault(require("express"));
var _user = require("../../controllers/v2/user.controller");
var _user2 = require("../../validations/v2/user.validation");
var _auth = require("../../middlewares/v2/auth.middleware");
var _upload = require("../../middlewares/v2/upload.middleware");
// console.log(UploadMiddleware)
var router = _express["default"].Router();

// router.route('/sign_up')
//   .post(UserValidation.createNew, UserController.createNew)

router.route('/verify').put(_user2.UserValidation.verifyAccount, _user.UserController.verifyAccount);
router.route('/reset_password').put(_user2.UserValidation.resetPassword, _user.UserController.resetPassword);
router.route('/sign_in').post(_user2.UserValidation.signIn, _user.UserController.signIn);
router.route('/send_email').post(_user2.UserValidation.sendEmail, _user.UserController.sendEmail);
router.route('/sign_out')["delete"](_user.UserController.signOut);
router.route('/refresh_token').get(_user.UserController.refreshToken);

// router.route('/update')
//   .put(AuthMiddleware.isAuthorized, UploadMiddleware.upload.single('avatar'), UserValidation.update, UserController.update)

var userRoutes = router;
exports.userRoutes = userRoutes;