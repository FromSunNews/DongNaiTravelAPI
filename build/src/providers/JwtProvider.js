"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JwtProvider = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var generateToken = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(secretSignature, tokenLife) {
    var user,
      _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          user = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
          _context.prev = 1;
          _context.next = 4;
          return _jsonwebtoken["default"].sign(user, secretSignature, {
            algorithm: 'HS256',
            expiresIn: tokenLife
          });
        case 4:
          return _context.abrupt("return", _context.sent);
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          throw new Error("Error generating token: ".concat(_context.t0.message));
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 7]]);
  }));
  return function generateToken(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
// check one token valid 
var verifyToken = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(secretSignature, token) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return _jsonwebtoken["default"].verify(token, secretSignature);
        case 3:
          return _context2.abrupt("return", _context2.sent);
        case 6:
          _context2.prev = 6;
          _context2.t0 = _context2["catch"](0);
          throw new Error("Error verifying token: ".concat(_context2.t0.message));
        case 9:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 6]]);
  }));
  return function verifyToken(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var JwtProvider = {
  generateToken: generateToken,
  verifyToken: verifyToken
};
exports.JwtProvider = JwtProvider;