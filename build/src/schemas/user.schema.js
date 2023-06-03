"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userSignupSchema = exports.userCollectionSchema = void 0;
var _joi = _interopRequireDefault(require("joi"));
var _validators = require("../utilities/validators");
var userSignupSchema = _joi["default"].object({
  email: _joi["default"].string().required().pattern(_validators.EMAIL_RULE).message('Email is invalid!'),
  username: _joi["default"].string().required().min(2).max(30).trim(),
  password: _joi["default"].string().required().pattern(_validators.PASSWORD_RULE).message('Password is invalid!'),
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
  confirmPassword: _joi["default"].string().required().valid(_joi["default"].ref('password')).messages({
    'any.only': 'Password Confirmation is not match',
    'any.required': 'Password Confirmation is required'
  }),
  birthday: _joi["default"].date().timestamp(),
  firstName: _joi["default"].string().min(2).max(30).trim(),
  lastName: _joi["default"].string().min(2).max(30).trim()
});
exports.userSignupSchema = userSignupSchema;
var userCollectionSchema = _joi["default"].object({
  email: _joi["default"].string().required(),
  // unique
  password: _joi["default"].string().required(),
  username: _joi["default"].string().required().min(2).max(30).trim(),
  // username sẽ không unique bởi vì sẽ có những đuôi email từ các nhà cũng cấp khác nhau
  lastName: _joi["default"].string()["default"](null),
  firstName: _joi["default"].string()["default"](null),
  displayName: _joi["default"].string().required().min(2).max(30).trim(),
  avatar: _joi["default"].string()["default"](null),
  coverPhoto: _joi["default"].string()["default"](null),
  role: _joi["default"].string()["default"]('client'),
  location: {
    longitude: _joi["default"].string()["default"](null),
    latitude: _joi["default"].string()["default"](null)
  },
  savedSuggestions: _joi["default"].array().items(_joi["default"].string())["default"]([]),
  savedPlaces: _joi["default"].array().items(_joi["default"].string())["default"]([]),
  followerIds: _joi["default"].array().items(_joi["default"].string())["default"]([]),
  followingIds: _joi["default"].array().items(_joi["default"].string())["default"]([]),
  notifIds: _joi["default"].array().items(_joi["default"].string())["default"]([]),
  // lovedBlogIds: Joi.array().items(Joi.string()).default([]),
  // savedBlogIds: Joi.array().items(Joi.string()).default([]),

  receivePoints: _joi["default"].number().integer()["default"](0),
  lostPoints: _joi["default"].number().integer()["default"](0),
  otpToken: _joi["default"].string()["default"](null),
  rspwToken: _joi["default"].string()["default"](null),
  birthday: _joi["default"].date().timestamp()["default"](null),
  createdAt: _joi["default"].date().timestamp('javascript')["default"](Date.now),
  updatedAt: _joi["default"].date().timestamp()["default"](null)
});
exports.userCollectionSchema = userCollectionSchema;