"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _user = require("../models/user.model");
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _otpGenerator = _interopRequireDefault(require("otp-generator"));
var _SendInBlueProvider = require("../providers/SendInBlueProvider");
var _RedisQueueProvider = require("../providers/RedisQueueProvider");
var _transform = require("../utilities/transform");
var _JwtProvider = require("../providers/JwtProvider");
var _CloudinaryProvider = require("../providers/CloudinaryProvider");
var _environtment = require("../config/environtment");
var _SendMessageToSlack = require("../providers/SendMessageToSlack");
var _notif = require("../models/notif.model");
var _axios = _interopRequireDefault(require("axios"));
var _lodash = require("lodash");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var createNew = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    var existUser, nameFromEmail, userData, createdUser, getUser, subject, htmlContent;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log('User data: ', data);
          delete data['confirmPassword'];
          // check email have already in system yet ?
          _context.next = 5;
          return _user.UserModel.findOneByEmail(data.email);
        case 5:
          existUser = _context.sent;
          if (!existUser) {
            _context.next = 8;
            break;
          }
          throw new Error('Email already exist.');
        case 8:
          // create database for the user inorder to save database
          // nameFromEmail: nếu email là trungquandev@gmail.com thì sẽ lấy được "trungquandev"
          nameFromEmail = data.email.split('@')[0] || '';
          userData = {
            email: data.email,
            password: _bcryptjs["default"].hashSync(data.password, 8),
            username: data.username ? data.username : nameFromEmail,
            displayName: data.fullName ? data.fullName : nameFromEmail,
            firstName: data.firstName,
            lastName: data.lastName
          };
          _context.next = 12;
          return _user.UserModel.createNew(userData);
        case 12:
          createdUser = _context.sent;
          _context.next = 15;
          return _user.UserModel.findOneById(createdUser.insertedId.toString());
        case 15:
          getUser = _context.sent;
          // Send email to the user click verify
          subject = 'DongNaiTravelApp';
          htmlContent = "\n      <h4>Welcome to DongNaiTravelApp</h4>\n      <p>Wish you have a lot of fun while accessing our application!</p>\n      <p>Sincerely,<br/> - DongNaiTravelApp Team - </p>\n    ";
          _context.next = 20;
          return _SendInBlueProvider.SendInBlueProvider.sendEmail(getUser.email, subject, htmlContent);
        case 20:
          return _context.abrupt("return", getUser);
        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](0);
          throw new Error(_context.t0);
        case 26:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 23]]);
  }));
  return function createNew(_x) {
    return _ref.apply(this, arguments);
  };
}();
var signIn = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(data) {
    var existUser, userInfoToStoreInJwtToken, accessToken, _refreshToken, fullInfoUser, notifs, result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          if (!data.email) {
            _context2.next = 7;
            break;
          }
          _context2.next = 4;
          return _user.UserModel.findOneByEmail(data.email);
        case 4:
          existUser = _context2.sent;
          _context2.next = 10;
          break;
        case 7:
          _context2.next = 9;
          return _user.UserModel.findOneByUserName(data.username);
        case 9:
          existUser = _context2.sent;
        case 10:
          if (existUser) {
            _context2.next = 12;
            break;
          }
          throw new Error('Email or Username does not exsist.');
        case 12:
          if (_bcryptjs["default"].compareSync(data.password, existUser.password)) {
            _context2.next = 14;
            break;
          }
          throw new Error('Your password is incorrect.');
        case 14:
          userInfoToStoreInJwtToken = {
            _id: existUser._id,
            email: existUser.email
          }; // handle tokens
          _context2.next = 17;
          return _JwtProvider.JwtProvider.generateToken(_environtment.env.ACCESS_TOKEN_SECRET_SIGNATURE, _environtment.env.ACCESS_TOKEN_SECRET_LIFE, userInfoToStoreInJwtToken);
        case 17:
          accessToken = _context2.sent;
          _context2.next = 20;
          return _JwtProvider.JwtProvider.generateToken(_environtment.env.REFRESH_TOKEN_SECRET_SIGNATURE, _environtment.env.REFRESH_TOKEN_SECRET_LIFE, userInfoToStoreInJwtToken);
        case 20:
          _refreshToken = _context2.sent;
          _context2.next = 23;
          return _user.UserModel.getFullInfoUser(existUser._id.toString());
        case 23:
          fullInfoUser = _context2.sent;
          notifs = (0, _lodash.cloneDeep)(fullInfoUser.notifs);
          delete fullInfoUser.notifs;
          // Phuong: trả về cho client refreshToken vs accessToken để lưu vào Persist store
          result = {
            fullInfoUser: _objectSpread({
              accessToken: accessToken,
              refreshToken: _refreshToken
            }, (0, _transform.pickUser)(fullInfoUser)),
            notifs: notifs
          };
          console.log('🚀 ~ file: user.service.js:105 ~ signIn ~ result:', result);
          return _context2.abrupt("return", result);
        case 31:
          _context2.prev = 31;
          _context2.t0 = _context2["catch"](0);
          throw new Error(_context2.t0);
        case 34:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 31]]);
  }));
  return function signIn(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var sendOtp = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(data) {
    var existUser, optCode, optCodeToStoreInJwtToken, otpToken, subject, htmlContent, updatedUser;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          console.log('🚀 ~ file: user.service.js:97 ~ sendOtp ~ data', data);
          _context3.prev = 1;
          if (!data.email) {
            _context3.next = 6;
            break;
          }
          _context3.next = 5;
          return _user.UserModel.findOneByEmail(data.email);
        case 5:
          existUser = _context3.sent;
        case 6:
          if (existUser) {
            _context3.next = 8;
            break;
          }
          throw new Error('Email does not exsist.');
        case 8:
          // Phuong: https://www.npmjs.com/package/otp-generator
          // Phuong: Only generate digits otp code
          optCode = _otpGenerator["default"].generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false
          }); // Phuong: should be in json
          optCodeToStoreInJwtToken = {
            optCode: optCode.toString()
          };
          console.log('🚀 ~ file: user.service.js:112 ~ sendOtp ~ optCode', optCode);
          console.log('OTP_TOKEN_SECRET_SIGNATURE', _environtment.env.OTP_TOKEN_SECRET_SIGNATURE);
          _context3.next = 14;
          return _JwtProvider.JwtProvider.generateToken(_environtment.env.OTP_TOKEN_SECRET_SIGNATURE, _environtment.env.OTP_TOKEN_SECRET_LIFE, optCodeToStoreInJwtToken);
        case 14:
          otpToken = _context3.sent;
          // Send otp code to the user
          console.log('🚀 ~ Sending email...');
          subject = 'DongNaiTravelApp: Please verify your email to reset password!';
          htmlContent = "\n      <p>Hello, this is your OTP :</p>\n      <h3>".concat(optCode, "</h3>\n      <p>Don't share it with anyone. This OTP will be valid for 2 minutes</p>\n      <p>Sincerely, DongNaiTravelApp Team</p>\n    ");
          _context3.next = 20;
          return _SendInBlueProvider.SendInBlueProvider.sendEmail(data.email, subject, htmlContent);
        case 20:
          _context3.next = 22;
          return _user.UserModel.updateOneAndGet(existUser._id, {
            otpToken: otpToken
          });
        case 22:
          updatedUser = _context3.sent;
          return _context3.abrupt("return", (0, _transform.pickUser)(updatedUser));
        case 26:
          _context3.prev = 26;
          _context3.t0 = _context3["catch"](1);
          throw new Error(_context3.t0);
        case 29:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[1, 26]]);
  }));
  return function sendOtp(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
var verifyOtp = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(otpCode, email) {
    var existUser, otpTokenDecoded;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          console.log('🚀 ~ file: user.service.js:149 ~ verifyOtp ~ email', email);
          console.log('🚀 ~ file: user.service.js:148 ~ verifyOtp ~ otpCode', otpCode);
          _context4.prev = 2;
          if (!email) {
            _context4.next = 7;
            break;
          }
          _context4.next = 6;
          return _user.UserModel.findOneByEmail(email);
        case 6:
          existUser = _context4.sent;
        case 7:
          if (existUser) {
            _context4.next = 9;
            break;
          }
          throw new Error('Email does not exsist.');
        case 9:
          console.log('🚀 ~ file: user.service.js:162 ~ verifyOtp ~ existUser.otpToken', existUser.otpToken);
          // Phuong: giải mã token
          _context4.next = 12;
          return _JwtProvider.JwtProvider.verifyToken(_environtment.env.OTP_TOKEN_SECRET_SIGNATURE, existUser.otpToken.toString());
        case 12:
          otpTokenDecoded = _context4.sent;
          console.log('🚀 ~ file: user.service.js:151 ~ verifyOtp ~ otpTokenDecoded', otpTokenDecoded.optCode);
          // Phuong: lấy được thông tin là _id và email tạo được phần body
          if (!(otpCode !== otpTokenDecoded.optCode)) {
            _context4.next = 16;
            break;
          }
          throw new Error('Otp code incorrect. Please input again!');
        case 16:
          return _context4.abrupt("return");
        case 19:
          _context4.prev = 19;
          _context4.t0 = _context4["catch"](2);
          throw new Error('Otp code expried!');
        case 22:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[2, 19]]);
  }));
  return function verifyOtp(_x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();
var refreshToken = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(clientRefreshToken) {
    var refreshTokenDecoded, userInfoToStoreInJwtToken, accessToken;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return _JwtProvider.JwtProvider.verifyToken(_environtment.env.REFRESH_TOKEN_SECRET_SIGNATURE, clientRefreshToken);
        case 3:
          refreshTokenDecoded = _context5.sent;
          // Phuong: lấy được thông tin là _id và email tạo được phần body
          userInfoToStoreInJwtToken = {
            _id: refreshTokenDecoded._id,
            email: refreshTokenDecoded.email
          }; // Phuong: tạo mới accessToken vì accessToken là token có thời hạn ngắn
          _context5.next = 7;
          return _JwtProvider.JwtProvider.generateToken(_environtment.env.ACCESS_TOKEN_SECRET_SIGNATURE, _environtment.env.ACCESS_TOKEN_SECRET_LIFE, userInfoToStoreInJwtToken);
        case 7:
          accessToken = _context5.sent;
          return _context5.abrupt("return", {
            accessToken: accessToken
          });
        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          throw new Error(_context5.t0);
        case 14:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 11]]);
  }));
  return function refreshToken(_x6) {
    return _ref5.apply(this, arguments);
  };
}();
var resetPassword = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(data) {
    var existUser, encryptPassword, updatedUser;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return _user.UserModel.findOneByEmail(data.email);
        case 3:
          existUser = _context6.sent;
          if (existUser) {
            _context6.next = 6;
            break;
          }
          throw new Error('Email dont exist.');
        case 6:
          encryptPassword = _bcryptjs["default"].hashSync(data.password, 8);
          if (!(encryptPassword === existUser.password)) {
            _context6.next = 9;
            break;
          }
          throw new Error('This password you used!');
        case 9:
          _context6.next = 11;
          return _user.UserModel.resetPassword(existUser._id, {
            password: encryptPassword,
            updateAt: Date.now()
          });
        case 11:
          updatedUser = _context6.sent;
          return _context6.abrupt("return", (0, _transform.pickUser)(updatedUser));
        case 15:
          _context6.prev = 15;
          _context6.t0 = _context6["catch"](0);
          throw new Error(_context6.t0);
        case 18:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 15]]);
  }));
  return function resetPassword(_x7) {
    return _ref6.apply(this, arguments);
  };
}();
var updateByCase = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(id, data) {
    var userId, updateCase, updateData, result;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          userId = id;
          updateCase = data.updateCase;
          updateData = data.updateData;
          _context7.next = 6;
          return _user.UserModel.updateOneAndGetByCase(userId, updateData, updateCase);
        case 6:
          result = _context7.sent;
          if (result) {
            _context7.next = 9;
            break;
          }
          throw new Error('Cannot update user');
        case 9:
          return _context7.abrupt("return", result);
        case 12:
          _context7.prev = 12;
          _context7.t0 = _context7["catch"](0);
          return _context7.abrupt("return", undefined);
        case 15:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 12]]);
  }));
  return function updateByCase(_x8, _x9) {
    return _ref7.apply(this, arguments);
  };
}();
var update = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(data) {
    var updatedUser, updatedUserFollowing, coverPhotoBuffer, uploadResult, avatarBuffer, _uploadResult;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          console.log('🚀 ~ file: user.service.js:226 ~ update ~ data:', data);
          _context8.prev = 1;
          if (!data.coverPhoto) {
            _context8.next = 13;
            break;
          }
          // Chuyển base64 về buffer
          coverPhotoBuffer = Buffer.from(data.coverPhoto, 'base64'); // Upload file len cloudinary
          _context8.next = 6;
          return _CloudinaryProvider.CloudinaryProvider.streamUpload(coverPhotoBuffer, 'users');
        case 6:
          uploadResult = _context8.sent;
          // console.log(uploadResult)
          console.log('🚀 ~ file: user.service.js:240 ~ update ~ uploadResult.url:', uploadResult.url);
          _context8.next = 10;
          return _user.UserModel.updateOneAndGet(data.currentUserId, {
            coverPhoto: uploadResult.url
          });
        case 10:
          updatedUser = _context8.sent;
          _context8.next = 45;
          break;
        case 13:
          if (!data.avatar) {
            _context8.next = 24;
            break;
          }
          // Chuyển base64 về buffer
          avatarBuffer = Buffer.from(data.avatar, 'base64'); // Upload file len cloudinary
          _context8.next = 17;
          return _CloudinaryProvider.CloudinaryProvider.streamUpload(avatarBuffer, 'users');
        case 17:
          _uploadResult = _context8.sent;
          // console.log(uploadResult)
          console.log('🚀 ~ file: user.service.js:240 ~ update ~ uploadResult.url:', _uploadResult.url);
          _context8.next = 21;
          return _user.UserModel.updateOneAndGet(data.currentUserId, {
            avatar: _uploadResult.url
          });
        case 21:
          updatedUser = _context8.sent;
          _context8.next = 45;
          break;
        case 24:
          if (!(data.userReceivedId && data.userSentId && data.notifId)) {
            _context8.next = 35;
            break;
          }
          _context8.next = 27;
          return _user.UserModel.pushFollowingIds(data.userSentId, data.userReceivedId);
        case 27:
          updatedUser = _context8.sent;
          _context8.next = 30;
          return _user.UserModel.pushFollowerIds(data.userReceivedId, data.userSentId);
        case 30:
          _context8.next = 32;
          return _user.UserModel.pushNotifIds(data.userReceivedId, data.notifId);
        case 32:
          updatedUserFollowing = _context8.sent;
          _context8.next = 45;
          break;
        case 35:
          if (!(data.currentUserId && data.userUnFollowId)) {
            _context8.next = 42;
            break;
          }
          _context8.next = 38;
          return _user.UserModel.deteleFollowingId(data.currentUserId, data.userUnFollowId);
        case 38:
          _context8.next = 40;
          return _user.UserModel.deteleFollowerId(data.userUnFollowId, data.currentUserId);
        case 40:
          _context8.next = 45;
          break;
        case 42:
          _context8.next = 44;
          return _user.UserModel.updateOneAndGet(data.currentUserId, data);
        case 44:
          updatedUser = _context8.sent;
        case 45:
          return _context8.abrupt("return", {
            updatedUser: (0, _transform.pickUser)(updatedUser),
            updateUserFollowing: (0, _transform.pickUser)(updatedUserFollowing)
          });
        case 48:
          _context8.prev = 48;
          _context8.t0 = _context8["catch"](1);
          throw new Error(_context8.t0);
        case 51:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[1, 48]]);
  }));
  return function update(_x10) {
    return _ref8.apply(this, arguments);
  };
}();
var updateMap = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(data) {
    var existUser, updatedUser;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          console.log('🚀 ~ file: user.service.js:308 ~ updateMap ~ data:', data);
          _context9.prev = 1;
          if (!data.currentUserId) {
            _context9.next = 6;
            break;
          }
          _context9.next = 5;
          return _user.UserModel.findOneById(data.currentUserId);
        case 5:
          existUser = _context9.sent;
        case 6:
          if (existUser) {
            _context9.next = 8;
            break;
          }
          throw new Error('User does not exsist.');
        case 8:
          delete data.currentUserId;
          console.log('🚀 ~ file: user.service.js:328 ~ updateMap ~ data:', data);
          _context9.next = 12;
          return _user.UserModel.updateOneAndGet(existUser._id.toString(), data);
        case 12:
          updatedUser = _context9.sent;
          console.log('🚀 ~ file: user.service.js:323 ~ updateMap ~ updatedUser:', updatedUser);
          return _context9.abrupt("return", updatedUser);
        case 17:
          _context9.prev = 17;
          _context9.t0 = _context9["catch"](1);
          console.log('🚀 ~ file: user.service.js:328 ~ updateMap ~ error:', _context9.t0);
          throw new Error(_context9.t0);
        case 21:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[1, 17]]);
  }));
  return function updateMap(_x11) {
    return _ref9.apply(this, arguments);
  };
}();
var getMap = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(data) {
    var existUser;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          console.log('🚀 ~ file: user.service.js:334 ~ getMap ~ getMap:', getMap);
          _context10.prev = 1;
          if (!data.currentUserId) {
            _context10.next = 6;
            break;
          }
          _context10.next = 5;
          return _user.UserModel.findOneById(data.currentUserId);
        case 5:
          existUser = _context10.sent;
        case 6:
          console.log('🚀 ~ file: user.service.js:339 ~ getMap ~ existUser:', existUser);
          if (existUser) {
            _context10.next = 9;
            break;
          }
          throw new Error('User does not exsist.');
        case 9:
          return _context10.abrupt("return", {
            places: existUser.savedPlaces,
            suggestions: existUser.savedSuggestions
          });
        case 12:
          _context10.prev = 12;
          _context10.t0 = _context10["catch"](1);
          throw new Error(_context10.t0);
        case 15:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[1, 12]]);
  }));
  return function getMap(_x12) {
    return _ref10.apply(this, arguments);
  };
}();
var getListUrlAvatar = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(data) {
    var listUserFollow, listUrlAvatar, followerIdsRecord, moreUrlAvatar, followerIds;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          console.log('🚀 ~ file: user.service.js:342 ~ getListUrlAvatar ~ data:', data);
          _context12.prev = 1;
          listUserFollow = [], listUrlAvatar = []; // listUserFollow.push(data.userReceivedId)
          // Lấy tất cả các follower của thằng nhận ra nhưng chỉ giới hạn 4 thằng mới nhất cộng với thằng mới follow nauwx là 5
          // Mình sẽ lấy url 5 thằng đó lưu vô mảng
          _context12.next = 5;
          return _user.UserModel.findOneById(data.userReceivedId);
        case 5:
          followerIdsRecord = _context12.sent;
          console.log('🚀 ~ file: user.service.js:351 ~ getListUrlAvatar ~ followerIdsRecord:', followerIdsRecord);
          moreUrlAvatar = followerIdsRecord.followerIds.length <= 4 ? 0 : followerIdsRecord.followerIds.length - 4;
          followerIds = followerIdsRecord.followerIds.length <= 4 ? followerIdsRecord.followerIds : followerIdsRecord.followerIds.slice(-4).reverse();
          listUserFollow = [data.userSentId].concat((0, _toConsumableArray2["default"])(followerIds));
          console.log('🚀 ~ file: user.service.js:354 ~ getListUrlAvatar ~ listUserFollow:', listUserFollow);
          // Vậy là có tất cả các follower r bây giờ tạo promises all
          _context12.next = 13;
          return _axios["default"].all(listUserFollow.map(function (id) {
            return _user.UserModel.findOneById(id);
          })).then( /*#__PURE__*/function () {
            var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(datasReturn) {
              return _regenerator["default"].wrap(function _callee11$(_context11) {
                while (1) switch (_context11.prev = _context11.next) {
                  case 0:
                    datasReturn.map(function (dataReturn) {
                      listUrlAvatar.push(dataReturn.avatar);
                    });
                  case 1:
                  case "end":
                    return _context11.stop();
                }
              }, _callee11);
            }));
            return function (_x14) {
              return _ref12.apply(this, arguments);
            };
          }())["catch"](function (err) {
            return console.log(err);
          });
        case 13:
          return _context12.abrupt("return", {
            listUrlAvatar: listUrlAvatar,
            moreUrlAvatar: moreUrlAvatar
          });
        case 16:
          _context12.prev = 16;
          _context12.t0 = _context12["catch"](1);
          throw new Error(_context12.t0);
        case 19:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[1, 16]]);
  }));
  return function getListUrlAvatar(_x13) {
    return _ref11.apply(this, arguments);
  };
}();
var getInfoUser = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(data) {
    var userReturn;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          console.log('🚀 ~ file: user.service.js:342 ~ getListUrlAvatar ~ data:', data);
          _context13.prev = 1;
          _context13.next = 4;
          return _user.UserModel.findOneById(data.userId);
        case 4:
          userReturn = _context13.sent;
          if (userReturn) {
            _context13.next = 7;
            break;
          }
          throw new Error('User not found!');
        case 7:
          return _context13.abrupt("return", (0, _transform.pickUser)(userReturn));
        case 10:
          _context13.prev = 10;
          _context13.t0 = _context13["catch"](1);
          throw new Error(_context13.t0);
        case 13:
        case "end":
          return _context13.stop();
      }
    }, _callee13, null, [[1, 10]]);
  }));
  return function getInfoUser(_x15) {
    return _ref13.apply(this, arguments);
  };
}();
var UserService = {
  createNew: createNew,
  signIn: signIn,
  refreshToken: refreshToken,
  updateByCase: updateByCase,
  update: update,
  sendOtp: sendOtp,
  verifyOtp: verifyOtp,
  resetPassword: resetPassword,
  getMap: getMap,
  updateMap: updateMap,
  getListUrlAvatar: getListUrlAvatar,
  getInfoUser: getInfoUser
};
exports.UserService = UserService;