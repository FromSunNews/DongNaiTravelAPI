"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LangChainProvider = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _environtment = require("../config/environtment");
//Import the OpenAPI Large Language Model (you can import other models here eg. Cohere)
// import { OpenAI } from 'langchain'
// import { Configuration, OpenAIApi } from 'openai'

var getMessage = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(textInput) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 6;
          break;
        case 3:
          _context.prev = 3;
          _context.t0 = _context["catch"](0);
          throw new Error("Error in getMessage: ".concat(_context.t0.message));
        case 6:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 3]]);
  }));
  return function getMessage(_x) {
    return _ref.apply(this, arguments);
  };
}();
var LangChainProvider = {
  getMessage: getMessage
};
exports.LangChainProvider = LangChainProvider;