"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _constants = require("../../utilities/constants");
var _user = require("../../services/v2/user.service");
var _ms = _interopRequireDefault(require("ms"));
// const createNew = async (req, res) => {
//   try {
//     const result = await UserService.createNew(req.body)
//     res.status(HttpStatusCode.OK).json(result)
//   } catch (error) {
//     res.status(HttpStatusCode.INTERNAL_SERVER).json({
//       errors: error.message
//     })
//   }
// }

var verifyAccount = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _user.UserService.verifyAccount(req.body);
        case 3:
          result = _context.sent;
          res.status(_constants.HttpStatusCode.OK).json(result);
          _context.next = 10;
          break;
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: _context.t0.message
          });
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 7]]);
  }));
  return function verifyAccount(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var sendEmail = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return _user.UserService.sendEmail(req.body);
        case 3:
          result = _context2.sent;
          res.status(_constants.HttpStatusCode.OK).json(result);
          _context2.next = 10;
          break;
        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: _context2.t0.message
          });
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 7]]);
  }));
  return function sendEmail(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var resetPassword = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return _user.UserService.resetPassword(req.body);
        case 3:
          result = _context3.sent;
          // xử lý cookie ở đây
          //https://expressjs.com/en/api.html

          //https://www.npmjs.com/packa ge/ms
          //chinh format cho maxAge
          res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: (0, _ms["default"])('14 days')
          });
          res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: (0, _ms["default"])('14 days')
          });
          res.status(_constants.HttpStatusCode.OK).json(result);
          _context3.next = 12;
          break;
        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: _context3.t0.message
          });
        case 12:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 9]]);
  }));
  return function resetPassword(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var signIn = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return _user.UserService.signIn(req.body);
        case 3:
          result = _context4.sent;
          // xử lý cookie ở đây
          //https://expressjs.com/en/api.html

          //https://www.npmjs.com/packa ge/ms
          //chinh format cho maxAge
          res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: (0, _ms["default"])('14 days')
          });
          res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: (0, _ms["default"])('14 days')
          });
          res.status(_constants.HttpStatusCode.OK).json(result);
          _context4.next = 12;
          break;
        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: _context4.t0.message
          });
        case 12:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 9]]);
  }));
  return function signIn(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var signOut = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          try {
            // delete cookie
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.status(_constants.HttpStatusCode.OK).json({
              signedOut: true
            });
          } catch (error) {
            res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
              errors: error.message
            });
          }
        case 1:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function signOut(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
var refreshToken = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var _req$cookies, result;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return _user.UserService.refreshToken((_req$cookies = req.cookies) === null || _req$cookies === void 0 ? void 0 : _req$cookies.refreshToken);
        case 3:
          result = _context6.sent;
          // xử lý cookie ở đây
          //https://expressjs.com/en/api.html

          //https://www.npmjs.com/package/ms
          //chinh format cho maxAge
          res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: (0, _ms["default"])('14 days')
          });
          res.status(_constants.HttpStatusCode.OK).json(result);
          _context6.next = 11;
          break;
        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](0);
          // console.log(error)
          res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: 'Please sign in again!'
          });
        case 11:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 8]]);
  }));
  return function refreshToken(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

// const update = async (req, res) => {
//   try {
//     const userId = req.jwtDecoded._id
//     const userAvatarFile = req.file
//     const result = await UserService.update(userId, req.body, userAvatarFile)

//     res.status(HttpStatusCode.OK).json(result)
//   } catch (error) {
//     res.status(HttpStatusCode.INTERNAL_SERVER).json({
//       errors: error.message
//     })
//   }
// }

var UserController = {
  // createNew,
  verifyAccount: verifyAccount,
  // update,
  signIn: signIn,
  signOut: signOut,
  refreshToken: refreshToken,
  sendEmail: sendEmail,
  resetPassword: resetPassword
};
exports.UserController = UserController;