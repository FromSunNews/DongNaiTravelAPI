"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextToSpeechProvider = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _axios = _interopRequireDefault(require("axios"));
var _environtment = require("../config/environtment");
var generateSpeech = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    var response;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          console.log('🚀 ~ file: TextToSpeechProvider.js:5 ~ generateSpeech ~ data:', data);
          // data có dạng:
          // data: {
          //   languageCode: 'en-US',
          //   name: 'en-US-Wavenet-F',
          //   text: 'van ban'
          // }
          _context.next = 3;
          return _axios["default"].post("https://texttospeech.googleapis.com/v1/text:synthesize?key=".concat(_environtment.env.MAP_API_KEY), {
            input: {
              text: data.text
            },
            voice: {
              languageCode: data.languageCode,
              name: data.name
            },
            audioConfig: {
              audioEncoding: 'mp3'
            }
          });
        case 3:
          response = _context.sent;
          return _context.abrupt("return", response.data.audioContent);
        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function generateSpeech(_x) {
    return _ref.apply(this, arguments);
  };
}();
var TextToSpeechProvider = {
  generateSpeech: generateSpeech
};
exports.TextToSpeechProvider = TextToSpeechProvider;