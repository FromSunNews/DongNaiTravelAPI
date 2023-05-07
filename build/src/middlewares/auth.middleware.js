"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthMiddleware = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _environtment = require("../config/environtment");
var _JwtProvider = require("../providers/JwtProvider");
var _constants = require("../utilities/constants");
var isAuthorized = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var _req$body;
    var clientAccessToken, decoded, _error$message;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          clientAccessToken = (_req$body = req.body) === null || _req$body === void 0 ? void 0 : _req$body.accessToken;
          if (clientAccessToken) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return", res.status(_constants.HttpStatusCode.UNAUTHORIZED).json({
            errors: 'Unauthorized'
          }));
        case 3:
          _context.prev = 3;
          _context.next = 6;
          return _JwtProvider.JwtProvider.verifyToken(_environtment.env.ACCESS_TOKEN_SECRET_SIGNATURE, clientAccessToken);
        case 6:
          decoded = _context.sent;
          //Quan trọng: nếu như cái token hợp lệ, thì sẽ cần hpải lưu thông tin giải mã được vào req, để sử dụng cho các phần xử lý phía sau
          req.jwtDecoded = decoded;

          //Cho phép request đi tiếp
          next();
          _context.next = 16;
          break;
        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](3);
          if (!(_context.t0 !== null && _context.t0 !== void 0 && (_error$message = _context.t0.message) !== null && _error$message !== void 0 && _error$message.includes('jwt expired'))) {
            _context.next = 15;
            break;
          }
          return _context.abrupt("return", res.status(_constants.HttpStatusCode.EXPIRED).json({
            errors: 'Need to refresh token'
          }));
        case 15:
          return _context.abrupt("return", res.status(_constants.HttpStatusCode.UNAUTHORIZED).json({
            errors: 'Unauthorized'
          }));
        case 16:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[3, 11]]);
  }));
  return function isAuthorized(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var AuthMiddleware = {
  isAuthorized: isAuthorized
};
exports.AuthMiddleware = AuthMiddleware;