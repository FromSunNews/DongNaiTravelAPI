"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatBotController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _constants = require("../utilities/constants");
var _chatbot = require("../services/chatbot.service");
var _environtment = require("../config/environtment");
var getText = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _chatbot.ChatBotService.getText(req.body);
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
  return function getText(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var ChatBotController = {
  getText: getText
};
exports.ChatBotController = ChatBotController;