"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _user = require("../../models/v2/user.model");
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _uuid = require("uuid");
var _SendInBlueProvider = require("../../providers/SendInBlueProvider");
var _RedisQueueProvider = require("../../providers/RedisQueueProvider");
var _constants = require("../../utilities/constants");
var _transform = require("../../utilities/transform");
var _JwtProvider = require("../../providers/JwtProvider");
var _CloudinaryProvider = require("../../providers/CloudinaryProvider");
var _environtment = require("../../config/environtment");
var _SendMessageToSlack = require("../../providers/SendMessageToSlack");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
// const createNew = async (data) => {
//   try {
//     // check email have already in system yet ?
//     const existUser = await UserModel.findOneByEmail(data.email)
//     if (existUser) {
//       throw new Error('Email already exist.')
//     }

//     // create database for the user inorder to save database
//     // nameFromEmail: nếu email là trungquandev@gmail.com thì sẽ lấy được "trungquandev"
//     const nameFromEmail = data.email.split('@')[0] || ''
//     const userData = {
//       email: data.email,
//       password: bcryptjs.hashSync(data.password, 8),
//       username: nameFromEmail,
//       displayName: nameFromEmail,
//       verifyToken: uuidv4()
//     }

//     const createdUser = await UserModel.createNew(userData)
//     const getUser = await UserModel.findOneById(createdUser.insertedId.toString())

//     // Send email to the user click verify

//     const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getUser.email}&token=${getUser.verifyToken}`

//     const subject = 'Trello Clone App: Please verify your email before using our services!'
//     const htmlContent = `
//       <h3>Here is your verification link:</h3>
//       <h3>${verificationLink}</h3>
//       <h3>Sincerely,<br/> - Trungquandev Official - </h3>
//     `
//     await SendInBlueProvider.sendEmail(getUser.email, subject, htmlContent)

//     return pickUser(getUser)

//   } catch (error) {
//     // console.log(error)
//     throw new Error(error)
//   }
// }

var sendEmail = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    var existUser, verifyToken, verifyTokenJson, rspwToken, verificationLink, subject, htmlContent;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _user.UserModel.findOneByEmail(data.email);
        case 3:
          existUser = _context.sent;
          if (existUser) {
            _context.next = 6;
            break;
          }
          throw new Error('Email do not exsist.');
        case 6:
          if (!(existUser.role !== 'admin')) {
            _context.next = 8;
            break;
          }
          throw new Error('Xin lỗi bạn không có quyền truy cập website này!');
        case 8:
          // Phuong tạo ra thằng verifyToken
          verifyToken = (0, _uuid.v4)();
          verifyTokenJson = {
            verifyToken: verifyToken
          };
          _context.next = 12;
          return _JwtProvider.JwtProvider.generateToken(_environtment.env.RSPW_TOKEN_SECRET_SIGNATURE, _environtment.env.RSPW_TOKEN_SECRET_LIFE, verifyTokenJson);
        case 12:
          rspwToken = _context.sent;
          // Phuong: Guwri email cho user
          verificationLink = "".concat(_constants.WEBSITE_DOMAIN, "/verify?email=").concat(existUser.email, "&verifyToken=").concat(verifyToken);
          console.log('🚀 ~ file: user.service.js:88 ~ sendEmail ~ verificationLink:', verificationLink);
          subject = 'DongNaiTravelAdmin: Please verify your email to reset your password!';
          htmlContent = "\n      <p>Hello, this is your link:</p>\n      <h3>".concat(verificationLink, "</h3>\n      <p>Don't share it with anyone. This link will be valid for 2 minutes</p>\n      <p>Sincerely, DongNaiTravelApp Team</p>\n    ");
          _context.next = 19;
          return _SendInBlueProvider.SendInBlueProvider.sendEmail(existUser.email, subject, htmlContent);
        case 19:
          _context.next = 21;
          return _user.UserModel.updateOneAndGet(existUser._id, {
            rspwToken: rspwToken
          });
        case 21:
          return _context.abrupt("return", {
            isSendEmail: true
          });
        case 24:
          _context.prev = 24;
          _context.t0 = _context["catch"](0);
          throw new Error(_context.t0);
        case 27:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 24]]);
  }));
  return function sendEmail(_x) {
    return _ref.apply(this, arguments);
  };
}();
var verifyAccount = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(data) {
    var existUser, rspwTokenDecoded;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          console.log('🚀 ~ file: user.service.js:111 ~ verifyAccount ~ data:', data);
          _context2.prev = 1;
          if (!data.email) {
            _context2.next = 6;
            break;
          }
          _context2.next = 5;
          return _user.UserModel.findOneByEmail(data.email);
        case 5:
          existUser = _context2.sent;
        case 6:
          if (existUser) {
            _context2.next = 8;
            break;
          }
          throw new Error('Email này không tồn tại');
        case 8:
          console.log('🚀 ~ file: user.service.js:162 ~ verifyOtp ~ existUser.otpToken', existUser.rspwToken);
          // Phuong: giải mã token
          _context2.next = 11;
          return _JwtProvider.JwtProvider.verifyToken(_environtment.env.RSPW_TOKEN_SECRET_SIGNATURE, existUser.rspwToken.toString());
        case 11:
          rspwTokenDecoded = _context2.sent;
          console.log('🚀 ~ file: user.service.js:151 ~ verifyOtp ~ rspwTokenDecoded', rspwTokenDecoded.verifyToken);
          // Phuong: lấy được thông tin là _id và email tạo được phần body
          if (!(data.verifyToken !== rspwTokenDecoded.verifyToken)) {
            _context2.next = 15;
            break;
          }
          throw new Error('Đường dẫn không đúng!');
        case 15:
          return _context2.abrupt("return", {
            isVerified: true
          });
        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](1);
          throw new Error('Mã xác thực hết hạn!');
        case 21:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 18]]);
  }));
  return function verifyAccount(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var signIn = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(data) {
    var existUser, userInfoToStoreInJwtToken, accessToken, _refreshToken;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          console.log('🚀 ~ file: user.service.js:88 ~ signIn ~ data:', data);
          _context3.prev = 1;
          _context3.next = 4;
          return _user.UserModel.findOneByEmail(data.email);
        case 4:
          existUser = _context3.sent;
          if (existUser) {
            _context3.next = 7;
            break;
          }
          throw new Error('Email này không tồn tại.');
        case 7:
          if (!(existUser.role !== 'admin')) {
            _context3.next = 9;
            break;
          }
          throw new Error('Xin lỗi bạn không có quyền truy cập website này!');
        case 9:
          if (_bcryptjs["default"].compareSync(data.password, existUser.password)) {
            _context3.next = 11;
            break;
          }
          throw new Error('Your password is incorrect');
        case 11:
          userInfoToStoreInJwtToken = {
            _id: existUser._id,
            email: existUser.email
          }; // handle tokens
          _context3.next = 14;
          return _JwtProvider.JwtProvider.generateToken(_environtment.env.ACCESS_TOKEN_SECRET_SIGNATURE, _environtment.env.ACCESS_TOKEN_SECRET_LIFE,
          // 5,
          //để dành test
          userInfoToStoreInJwtToken);
        case 14:
          accessToken = _context3.sent;
          _context3.next = 17;
          return _JwtProvider.JwtProvider.generateToken(_environtment.env.REFRESH_TOKEN_SECRET_SIGNATURE, _environtment.env.REFRESH_TOKEN_SECRET_LIFE,
          // 15,
          //để dành test
          userInfoToStoreInJwtToken);
        case 17:
          _refreshToken = _context3.sent;
          return _context3.abrupt("return", _objectSpread({
            accessToken: accessToken,
            refreshToken: _refreshToken
          }, (0, _transform.pickUser)(existUser)));
        case 21:
          _context3.prev = 21;
          _context3.t0 = _context3["catch"](1);
          throw new Error(_context3.t0);
        case 24:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[1, 21]]);
  }));
  return function signIn(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
var resetPassword = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(data) {
    var existUser, rspwTokenDecoded, encryptPassword, updatedUser, userInfoToStoreInJwtToken, accessToken, _refreshToken2;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          if (!data.verifyEmail) {
            _context4.next = 5;
            break;
          }
          _context4.next = 4;
          return _user.UserModel.findOneByEmail(data.verifyEmail);
        case 4:
          existUser = _context4.sent;
        case 5:
          if (existUser) {
            _context4.next = 7;
            break;
          }
          throw new Error('Email này không tồn tại.');
        case 7:
          console.log('🚀 ~ file: user.service.js:162 ~ verifyOtp ~ existUser.otpToken', existUser.rspwToken);
          // Phuong: giải mã token
          _context4.next = 10;
          return _JwtProvider.JwtProvider.verifyToken(_environtment.env.RSPW_TOKEN_SECRET_SIGNATURE, existUser.rspwToken.toString());
        case 10:
          rspwTokenDecoded = _context4.sent;
          console.log('🚀 ~ file: user.service.js:151 ~ verifyOtp ~ rspwTokenDecoded', rspwTokenDecoded.verifyToken);
          // Phuong: lấy được thông tin là _id và email tạo được phần body
          if (!(data.verifyToken !== rspwTokenDecoded.verifyToken)) {
            _context4.next = 14;
            break;
          }
          throw new Error('Đường dẫn không đúng!');
        case 14:
          encryptPassword = _bcryptjs["default"].hashSync(data.password, 8);
          if (!(encryptPassword === existUser.password)) {
            _context4.next = 17;
            break;
          }
          throw new Error('Mật khẩu này bạn đã sử dụng!');
        case 17:
          _context4.next = 19;
          return _user.UserModel.resetPassword(existUser._id, {
            password: encryptPassword,
            updateAt: Date.now()
          });
        case 19:
          updatedUser = _context4.sent;
          if (!(updatedUser.role !== 'admin')) {
            _context4.next = 22;
            break;
          }
          throw new Error('Xin lỗi bạn không có quyền truy cập website này!');
        case 22:
          userInfoToStoreInJwtToken = {
            _id: updatedUser._id,
            email: updatedUser.email
          }; // handle tokens
          _context4.next = 25;
          return _JwtProvider.JwtProvider.generateToken(_environtment.env.ACCESS_TOKEN_SECRET_SIGNATURE, _environtment.env.ACCESS_TOKEN_SECRET_LIFE,
          // 5,
          //để dành test
          userInfoToStoreInJwtToken);
        case 25:
          accessToken = _context4.sent;
          _context4.next = 28;
          return _JwtProvider.JwtProvider.generateToken(_environtment.env.REFRESH_TOKEN_SECRET_SIGNATURE, _environtment.env.REFRESH_TOKEN_SECRET_LIFE,
          // 15,
          //để dành test
          userInfoToStoreInJwtToken);
        case 28:
          _refreshToken2 = _context4.sent;
          return _context4.abrupt("return", _objectSpread({
            accessToken: accessToken,
            refreshToken: _refreshToken2
          }, (0, _transform.pickUser)(existUser)));
        case 32:
          _context4.prev = 32;
          _context4.t0 = _context4["catch"](0);
          throw new Error(_context4.t0);
        case 35:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 32]]);
  }));
  return function resetPassword(_x4) {
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
          // pull request 11/15/2022
          userInfoToStoreInJwtToken = {
            _id: refreshTokenDecoded._id,
            email: refreshTokenDecoded.email
          }; // handle tokens
          _context5.next = 7;
          return _JwtProvider.JwtProvider.generateToken(_environtment.env.ACCESS_TOKEN_SECRET_SIGNATURE, _environtment.env.ACCESS_TOKEN_SECRET_LIFE,
          // 5, //để dành test
          userInfoToStoreInJwtToken);
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
  return function refreshToken(_x5) {
    return _ref5.apply(this, arguments);
  };
}();

// const update = async ( userId, data, userAvatarFile ) => {
//   try {
//     let updatedUser = {}
//     let shouldUpdateCardComments = false

//     if (userAvatarFile) {
//       // Upload file len cloudinary
//       const uploadResult = await CloudinaryProvider.streamUpload(userAvatarFile.buffer, 'users')
//       // console.log(uploadResult)

//       updatedUser = await UserModel.updateOneAndGet(userId, {
//         avatar: uploadResult.secure_url
//       })

//       shouldUpdateCardComments = true

//     } else if (data.currentPassword && data.newPassword) {
//       // change password
//       const existUser = await UserModel.findOneById(userId)
//       if (!existUser) {
//         throw new Error('User not found.')
//       }
//       //Compare password
//       if (!bcryptjs.compareSync(data.currentPassword, existUser.password)) {
//         throw new Error('Your current password is incorrect!')
//       }

//       updatedUser = await UserModel.updateOneAndGet(userId, {
//         password: bcryptjs.hashSync(data.newPassword, 8)
//       })

//     } else {
//       // general info user
//       updatedUser = await UserModel.updateOneAndGet(userId, data)
//       if (data.displayName) {
//         shouldUpdateCardComments = true
//       }
//     }

//     // Chạy background job cho việc cập nhật rất nhiều bản ghi
//     // Background tasks: https://github.com/mkamrani/example-node-bull/blob/main/basic/index.js
//     if (shouldUpdateCardComments) {
//       // Bước 1: Khởi tạo một hàng đợi để cập nhật comment của nhiều card
//       let updatedCardCommentsQueue = RedisQueueProvider.generateQueue('updatedCardCommentsQueue')
//       // Bước 2: Định nghĩa ra những việc cần làm trong tiến trình hàng đợi
//       updatedCardCommentsQueue.process(async (job, done) => {
//         try {
//           // job.data ở đây chính là updatedUser được truyền vào từ bước 4
//           const cardCommentsUpdated = await CardModel.updateManyComments(job.data)
//           done(null, cardCommentsUpdated)
//         } catch (error) {
//           done(new Error('Error from updatedCardCommentsQueue.process'))
//         }
//       })
//       // B3: Check completed hoặc failed, tùy trường hợp yêu cầu mà cần cái event này, để bắn thông báo khi job chạy xong chẳng hạn
//       // Nhiều event khác: https://github.com/OptimalBits/bull/blob/HEAD/REFERENCE.md#events
//       updatedCardCommentsQueue.on('completed', (job, result) => {
//         // Bắn kết quả về Slack
//         SendMessageToSlack.sendToSlack(`Job với id là: ${job.id} và tên job: *${job.queue.name}* đã *xong* và kết quả là: ${result}`)
//       })

//       updatedCardCommentsQueue.on('failed', (job, error) => {
//         // Bắn lỗi về Slack hoặc Telegram ...
//         SendMessageToSlack.sendToSlack(`Notification: Job với id là ${job.id} và tên job là *${job.queue.name}* đã bị *lỗi* \n\n ${error}`)
//       })

//       // Bước 4: bước quan trọng cuối cùng: Thêm vào vào đợi Redis để xử lý
//       updatedCardCommentsQueue.add(updatedUser, {
//         attempts: 3, // số lần thử lại nếu lỗi
//         backoff: 5000 //khoảng thời gian delay giữa các lần thử lại job
//       })

//     }

//     return pickUser(updatedUser)

//   } catch (error) {
//     throw new Error(error)
//   }
// }

var UserService = {
  // createNew,
  verifyAccount: verifyAccount,
  // update
  signIn: signIn,
  refreshToken: refreshToken,
  sendEmail: sendEmail,
  resetPassword: resetPassword
};
exports.UserService = UserService;