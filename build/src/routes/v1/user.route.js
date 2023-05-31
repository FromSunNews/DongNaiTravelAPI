"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userRoutes = void 0;
var _express = _interopRequireDefault(require("express"));
var _user = require("../../controllers/user.controller");
var _user2 = require("../../validations/user.validation");
var _auth = require("../../middlewares/auth.middleware");
var _upload = require("../../middlewares/upload.middleware");
// console.log(UploadMiddleware)
var router = _express["default"].Router();
router.route('/sign_up').post(_user2.UserValidation.createNew, _user.UserController.createNew);
router.route('/sign_in').post(_user2.UserValidation.signIn, _user.UserController.signIn);
router.route('/sign_out')["delete"](_user.UserController.signOut);
router.route('/refresh_token').get(_user.UserController.refreshToken);
router.route('/send_otp').post(_user2.UserValidation.sendOtp, _user.UserController.sendOtp);
router.route('/verify_otp').post(_user.UserController.verifyOtp);

// router.route('/update')
//   .put(AuthMiddleware.isAuthorized, UploadMiddleware.upload.single('avatar'), UserValidation.update, UserController.update)

router.route('/update').post(_user2.UserValidation.update, _user.UserController.update);
router.route('/update_by_case').post(_auth.AuthMiddleware.isAuthorized, _user.UserController.updateByCase);
router.route('/reset_password').put(_user2.UserValidation.resetPassword, _user.UserController.resetPassword);
router.route('/private_keys').get(_user.UserController.privateKeys);
router.route('/get_map_user').post(_user.UserController.getMap);
router.route('/update_map_user').post(_user.UserController.updateMap);
router.route('/get_info_user').post(_user.UserController.getInfoUser);
var userRoutes = router;
exports.userRoutes = userRoutes;