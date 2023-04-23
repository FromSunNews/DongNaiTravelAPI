"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _constants = require("../utilities/constants");
var _user = require("../services/user.service");
var _environtment = require("../config/environtment");
var createNew = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _user.UserService.createNew(req.body);
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
  return function createNew(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var signIn = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return _user.UserService.signIn(req.body);
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
  return function signIn(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var signOut = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          try {
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
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function signOut(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var privateKeys = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          try {
            res.status(_constants.HttpStatusCode.OK).json({
              map_api_key: _environtment.env.MAP_API_KEY
            });
            console.log('privateKeys: ', _environtment.env.MAP_API_KEY);
          } catch (error) {
            res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
              errors: error.message
            });
          }
        case 1:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function privateKeys(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var refreshToken = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var _req$body, result;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return _user.UserService.refreshToken((_req$body = req.body) === null || _req$body === void 0 ? void 0 : _req$body.refreshToken);
        case 3:
          result = _context5.sent;
          res.status(_constants.HttpStatusCode.OK).json(result);
          _context5.next = 10;
          break;
        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          // console.log(error)
          res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: 'Please Sign In!'
          });
        case 10:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 7]]);
  }));
  return function refreshToken(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
var verifyOtp = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var _req$body2, _req$body3;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          console.log('Body req', req.body);
          _context6.next = 4;
          return _user.UserService.verifyOtp((_req$body2 = req.body) === null || _req$body2 === void 0 ? void 0 : _req$body2.otpCode, (_req$body3 = req.body) === null || _req$body3 === void 0 ? void 0 : _req$body3.email);
        case 4:
          res.status(_constants.HttpStatusCode.OK).json({
            isAuthenticated: true
          });
          _context6.next = 10;
          break;
        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          // console.log(error)
          res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: 'OTP incorrect or OTP expired'
          });
        case 10:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 7]]);
  }));
  return function verifyOtp(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
var sendOtp = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return _user.UserService.sendOtp(req.body);
        case 3:
          result = _context7.sent;
          res.status(_constants.HttpStatusCode.OK).json(result);
          _context7.next = 10;
          break;
        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: _context7.t0.message
          });
        case 10:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 7]]);
  }));
  return function sendOtp(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();
var resetPassword = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return _user.UserService.resetPassword(req.body);
        case 3:
          result = _context8.sent;
          res.status(_constants.HttpStatusCode.OK).json(result);
          _context8.next = 10;
          break;
        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](0);
          res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: _context8.t0.message
          });
        case 10:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 7]]);
  }));
  return function resetPassword(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();
var update = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return _user.UserService.update(req.body);
        case 3:
          result = _context9.sent;
          res.status(_constants.HttpStatusCode.OK).json(result);
          _context9.next = 10;
          break;
        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9["catch"](0);
          res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: _context9.t0.message
          });
        case 10:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 7]]);
  }));
  return function update(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();
var getMap = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return _user.UserService.getMap(req.body);
        case 3:
          result = _context10.sent;
          console.log('🚀 ~ file: user.controller.js:127 ~ getMap ~ result:', result);
          res.status(_constants.HttpStatusCode.OK).json(result);
          _context10.next = 11;
          break;
        case 8:
          _context10.prev = 8;
          _context10.t0 = _context10["catch"](0);
          res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: _context10.t0.message
          });
        case 11:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 8]]);
  }));
  return function getMap(_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();
var updateMap = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return _user.UserService.updateMap(req.body);
        case 3:
          result = _context11.sent;
          res.status(_constants.HttpStatusCode.OK).json(result);
          _context11.next = 10;
          break;
        case 7:
          _context11.prev = 7;
          _context11.t0 = _context11["catch"](0);
          res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: _context11.t0.message
          });
        case 10:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[0, 7]]);
  }));
  return function updateMap(_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}();
var getInfoUser = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return _user.UserService.getInfoUser(req.body);
        case 3:
          result = _context12.sent;
          res.status(_constants.HttpStatusCode.OK).json(result);
          _context12.next = 10;
          break;
        case 7:
          _context12.prev = 7;
          _context12.t0 = _context12["catch"](0);
          res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: _context12.t0.message
          });
        case 10:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[0, 7]]);
  }));
  return function getInfoUser(_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}();
var UserController = {
  createNew: createNew,
  signIn: signIn,
  signOut: signOut,
  refreshToken: refreshToken,
  update: update,
  sendOtp: sendOtp,
  verifyOtp: verifyOtp,
  resetPassword: resetPassword,
  privateKeys: privateKeys,
  getMap: getMap,
  updateMap: updateMap,
  getInfoUser: getInfoUser
};
exports.UserController = UserController;