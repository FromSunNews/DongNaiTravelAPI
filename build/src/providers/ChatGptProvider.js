"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatGptProvider = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _axios = _interopRequireDefault(require("axios"));
var _environtment = require("../config/environtment");
var _openai = require("openai");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var handleItineraryRequest = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(content, io, socketIdMap, currentUserId) {
    var configuration, openai, completion, messageReturn;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          console.log('🚀 ~ file: ChatGptProvider.js:8 ~ handleItineraryRequest ~ currentUserId:', currentUserId);
          console.log('🚀 ~ file: ChatGptProvider.js:8 ~ handleItineraryRequest ~ socketIdMap:', socketIdMap);
          console.log('🚀 ~ file: ChatGptProvider.js:8 ~ handleItineraryRequest ~ io:', io);
          console.log('🚀 ~ file: ChatGptProvider.js:8 ~ handleItineraryRequest ~ content:', content);
          _context.prev = 4;
          configuration = new _openai.Configuration({
            apiKey: _environtment.env.CHATGPT_API_KEY
          });
          openai = new _openai.OpenAIApi(configuration);
          _context.next = 9;
          return openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            // Chọn model phù hợp
            messages: [{
              role: 'user',
              content: content
            }],
            // cấu hình role và content mình muốn hỏi
            temperature: 0,
            // Đầu ra tập trung vào vào câu hỏi nhiều hơn
            stream: true // Nó sẽ trả dữ liệu về theo từng đọt
          }, {
            responseType: 'stream'
          });
        case 9:
          completion = _context.sent;
          messageReturn = '';
          completion.data.on('data', function (data) {
            var _data$toString;
            var lines = data === null || data === void 0 ? void 0 : (_data$toString = data.toString()) === null || _data$toString === void 0 ? void 0 : _data$toString.split('\n').filter(function (line) {
              return line.trim() !== '';
            });
            var _iterator = _createForOfIteratorHelper(lines),
              _step;
            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var line = _step.value;
                var message = line.replace(/^data: /, '');
                if (message === '[DONE]') {
                  io.to(socketIdMap[currentUserId]).emit('s_create_travel_itinerary', {
                    messageReturn: 'DONE'
                  });
                  break; // Stream finished
                }

                try {
                  var parsed = JSON.parse(message);
                  if (parsed.choices[0].delta.content) {
                    messageReturn += parsed.choices[0].delta.content;
                    console.log(messageReturn);
                    io.to(socketIdMap[currentUserId]).emit('s_create_travel_itinerary', {
                      messageReturn: parsed.choices[0].delta.content
                    });
                  }
                } catch (error) {
                  console.error('Could not JSON parse stream message', message, error);
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          });
          _context.next = 17;
          break;
        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](4);
          console.log(_context.t0);
        case 17:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[4, 14]]);
  }));
  return function handleItineraryRequest(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();
var ChatGptProvider = {
  handleItineraryRequest: handleItineraryRequest
};
exports.ChatGptProvider = ChatGptProvider;