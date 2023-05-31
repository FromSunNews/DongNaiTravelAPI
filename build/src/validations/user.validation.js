"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserValidation = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _constants = require("../utilities/constants");
var _validators = require("../utilities/validators");
var _user = require("../schemas/user.schema");
var createNew = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var condition;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          condition = _user.userSignupSchema;
          _context.prev = 1;
          console.log('Start validate');
          _context.next = 5;
          return condition.validateAsync(req.body, {
            abortEarly: false
          });
        case 5:
          console.log('Pass validate');
          next();
          _context.next = 12;
          break;
        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](1);
          res.status(_constants.HttpStatusCode.BAD_REQUEST).json({
            errors: new Error(_context.t0).message
          });
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 9]]);
  }));
  return function createNew(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var signIn = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var condition;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          condition = _joi["default"].object({
            username: _joi["default"].string().min(2).max(30).trim(),
            email: _joi["default"].string().pattern(_validators.EMAIL_RULE).message('Email is invalid'),
            password: _joi["default"].string().required().pattern(_validators.PASSWORD_RULE).message('Password is invalid')
          });
          _context2.prev = 1;
          _context2.next = 4;
          return condition.validateAsync(req.body, {
            abortEarly: false
          });
        case 4:
          next();
          _context2.next = 10;
          break;
        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](1);
          res.status(_constants.HttpStatusCode.BAD_REQUEST).json({
            errors: new Error(_context2.t0).message
          });
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 7]]);
  }));
  return function signIn(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var sendOtp = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var condition;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          condition = _joi["default"].object({
            email: _joi["default"].string().pattern(_validators.EMAIL_RULE).message('Email is invalid')
          });
          _context3.prev = 1;
          _context3.next = 4;
          return condition.validateAsync(req.body, {
            abortEarly: false
          });
        case 4:
          next();
          _context3.next = 10;
          break;
        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](1);
          res.status(_constants.HttpStatusCode.BAD_REQUEST).json({
            errors: new Error(_context3.t0).message
          });
        case 10:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[1, 7]]);
  }));
  return function sendOtp(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
var update = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var condition;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          condition = _joi["default"].object({
            displayName: _joi["default"].string().trim(),
            currentPassword: _joi["default"].string().pattern(_validators.PASSWORD_RULE).message('Current Password is invalid'),
            newPassword: _joi["default"].string().pattern(_validators.PASSWORD_RULE).message('New Password is invalid'),
            savedSuggestions: _joi["default"].string().trim(),
            savedPlaces: _joi["default"].string().trim()
          });
          _context4.prev = 1;
          _context4.next = 4;
          return condition.validateAsync(req.body, {
            abortEarly: false,
            allowUnknown: true
          });
        case 4:
          next();
          _context4.next = 10;
          break;
        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](1);
          res.status(_constants.HttpStatusCode.BAD_REQUEST).json({
            errors: new Error(_context4.t0).message
          });
        case 10:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[1, 7]]);
  }));
  return function update(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();
var resetPassword = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var condition;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          condition = _joi["default"].object({
            email: _joi["default"].string().required().pattern(_validators.EMAIL_RULE).message('Email is invalid!'),
            password: _joi["default"].string().required().pattern(_validators.PASSWORD_RULE).message('Password is invalid!'),
            confirmPassword: _joi["default"].string().required().valid(_joi["default"].ref('password')).messages({
              'any.only': 'Password Confirmation is not match',
              'any.required': 'Password Confirmation is required'
            })
          });
          _context5.prev = 1;
          _context5.next = 4;
          return condition.validateAsync(req.body, {
            abortEarly: false,
            allowUnknown: true
          });
        case 4:
          next();
          _context5.next = 10;
          break;
        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](1);
          res.status(_constants.HttpStatusCode.BAD_REQUEST).json({
            errors: new Error(_context5.t0).message
          });
        case 10:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[1, 7]]);
  }));
  return function resetPassword(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();
var UserValidation = {
  createNew: createNew,
  signIn: signIn,
  update: update,
  sendOtp: sendOtp,
  resetPassword: resetPassword
};
exports.UserValidation = UserValidation;