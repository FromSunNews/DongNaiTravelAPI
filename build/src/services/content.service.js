"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContentService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _content = require("../models/content.model");
var _map = require("../models/map.model");
var _RedisQueueProvider = require("../providers/RedisQueueProvider");
var _environtment = require("../config/environtment");
var _TextToSpeechProvider = require("../providers/TextToSpeechProvider");
var _constants = require("../utilities/constants");
var _SendMessageToSlack = require("../providers/SendMessageToSlack");
var _axios = _interopRequireDefault(require("axios"));
var _lodash = require("lodash");
// const createNew = async (data) => {
//   console.log('🚀 ~ file: content.service.js:7 ~ createNew ~ data:', data)
//   // data sẽ có dạng :
//   // data = {
//   //   place_id: '123521543hfngdsh',
//   //   plainText: 'abc...',
//   //   plainTextMarkFormat: '### abc...'
//   // }
//   try {
//     // Data sẽ phải có thằng place_id để biết lưu vào
//     // Phải có plainTextMarkFormat vì đây là cái người dùng đóng góp
//     // Phải có plainText để khi người dùng gọi xuóng lấy giọng nói thì sẽ có plainText để call text_to_speech API

//     // Mới đầu ssẽ phải tìm xem thằng place_id (nó là thằng content_id trong model content) nó có chưa ?
//     const existContent = await ContentModel.findOneByContentId(data.place_id)
//     console.log('🚀 ~ file: content.service.js:28 ~ createNew ~ existContent:', existContent)
//     if (existContent) {
//       throw new Error('Content for this place was exsist.')
//     }

//     // Sau đó luuw và db content
//     const createdContent = await ContentModel.createNew({
//       content_id: data.place_id,
//       plainText: data.plainText,
//       plainTextMarkFormat: data.plainTextMarkFormat
//     })

//     let getContent
//     if (createdContent.insertedId) {
//       // khi lưu xong chúng ta phải cập nhật thằng map nữa
//       // chúng ta lấy objectId của thnăgf content lưu vào luôn và không cần chờ
//       await MapModel.updateByPlaceId(data.place_id, {
//         content_id: createdContent.insertedId.toString()
//       })
//       // Giờ lấy content để trả về
//       getContent = await ContentModel.findOneById(createdContent.insertedId.toString())
//     } else throw new Error('Could not create content')

//     // Giờ trả thằng content về
//     return getContent

//   } catch (error) {
//     throw new Error(error)
//   }
// }

// sử dụng createNew khi mà người dùng đóng góp bài viết dưới dạng markdown
var createNew = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(data) {
    var existContent, plainTextBase64, fullTextToSpeech, createdContent, getContent;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          console.log('🚀 ~ file: content.service.js:7 ~ createNew ~ data:', data);
          // data sẽ có dạng :
          // data = {
          //   place_id: '123521543hfngdsh',
          //   plainText: {
          //   vi: "",
          //   en: ""
          // },
          //   plainTextMarkFormat: {
          //   vi: "",
          //   en: ""
          // }
          _context2.prev = 1;
          _context2.next = 4;
          return _content.ContentModel.findOneByContentId(data.place_id);
        case 4:
          existContent = _context2.sent;
          if (!existContent) {
            _context2.next = 7;
            break;
          }
          throw new Error('Content for this place was exsist.');
        case 7:
          plainTextBase64 = {
            vi: {},
            en: {}
          };
          fullTextToSpeech = ['VN_FEMALE_1', 'VN_MALE_1', 'EN_FEMALE_1', 'EN_MALE_1'];
          _context2.next = 11;
          return _axios["default"].all(fullTextToSpeech.map(function (textToSpeechId, index) {
            return _axios["default"].post("https://texttospeech.googleapis.com/v1/text:synthesize?key=".concat(_environtment.env.MAP_API_KEY), {
              input: {
                text: index < 2 ? data.plainText.vi : data.plainText.en
              },
              voice: {
                languageCode: _constants.TextToSpeechConstants[textToSpeechId].languageCode,
                name: _constants.TextToSpeechConstants[textToSpeechId].name
              },
              audioConfig: {
                audioEncoding: 'mp3'
              }
            });
          })).then( /*#__PURE__*/function () {
            var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(responses) {
              return _regenerator["default"].wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    responses.map(function (res, index) {
                      if (index < 2) {
                        plainTextBase64['vi'][fullTextToSpeech[index]] = res.data.audioContent;
                      } else {
                        plainTextBase64['en'][fullTextToSpeech[index]] = res.data.audioContent;
                      }
                    });
                  case 1:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function (_x2) {
              return _ref2.apply(this, arguments);
            };
          }())["catch"](function (err) {
            return console.log(err);
          });
        case 11:
          _context2.next = 13;
          return _content.ContentModel.createNew({
            content_id: data.place_id,
            plainText: data.plainText,
            plainTextMarkFormat: data.plainTextMarkFormat,
            plainTextBase64: plainTextBase64
          });
        case 13:
          createdContent = _context2.sent;
          if (!createdContent.insertedId) {
            _context2.next = 22;
            break;
          }
          _context2.next = 17;
          return _map.MapModel.updateByPlaceId(data.place_id, {
            content_id: createdContent.insertedId.toString()
          });
        case 17:
          _context2.next = 19;
          return _content.ContentModel.findOneById(createdContent.insertedId.toString());
        case 19:
          getContent = _context2.sent;
          _context2.next = 23;
          break;
        case 22:
          throw new Error('Could not create content');
        case 23:
          return _context2.abrupt("return", getContent);
        case 26:
          _context2.prev = 26;
          _context2.t0 = _context2["catch"](1);
          throw new Error(_context2.t0);
        case 29:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 26]]);
  }));
  return function createNew(_x) {
    return _ref.apply(this, arguments);
  };
}();

// sử dụng getTextToSpeech khi mà người click vào btn giọng đọc
var getTextToSpeech = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(data) {
    var result, existContent, textToSpeech, updatedTextToSpeech;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          console.log('🚀 ~ file: content.service.js:7 ~ createNew ~ data:', data);
          // data sẽ có dạng :
          // data = {
          //   place_id: '123521543hfngdsh',
          //   textToSpeechId: 'VN_FEMALE_1' || 'VN_FEMALE_2' || 'VN_MALE_1' || 'VN_MALE_2' || 'EN_FEMALE_1' || 'EN_FEMALE_2' || 'EN_MALE_1' || 'EN_MALE_2'
          // }
          _context5.prev = 1;
          _context5.next = 4;
          return _content.ContentModel.findOneByContentId(data.place_id);
        case 4:
          existContent = _context5.sent;
          console.log('🚀 ~ file: content.service.js:72 ~ getTextToSpeech ~ existContent:', existContent);
          if (existContent !== null && existContent !== void 0 && existContent.plainTextBase64[data.textToSpeechId]) {
            _context5.next = 22;
            break;
          }
          console.log('Vao call api');
          // Nghĩa là trong đây chưa có giọng nói nào cả chúng ta sẽ lấy 1 giọng nói trước
          // sau đó là lấy 7 giọng nói sau ở trong background job
          _context5.next = 10;
          return _TextToSpeechProvider.TextToSpeechProvider.generateSpeech({
            text: existContent.plainText,
            languageCode: _constants.TextToSpeechConstants[data.textToSpeechId].languageCode,
            name: _constants.TextToSpeechConstants[data.textToSpeechId].name
          });
        case 10:
          textToSpeech = _context5.sent;
          console.log('🚀 ~ file: content.service.js:81 ~ getTextToSpeech ~ textToSpeech:', textToSpeech);
          result = textToSpeech;
          // Sau đó lưu vào db content (không cần chờ)
          existContent.plainTextBase64[data.textToSpeechId] = textToSpeech;
          // ContentModel.updateById(existContent._id.toString(), {
          //   plainTextBase64: existContent.plainTextBase64
          // })

          console.log('🚀 ~ file: content.service.js:85 ~ getTextToSpeech ~ existContent:', existContent);
          // Sau đó gọi 7 giọng nói còn lại
          // Chạy backgroundjobs
          // Bước 1: Khởi tạo một hàng đợi
          updatedTextToSpeech = _RedisQueueProvider.RedisQueueProvider.generateQueue('updatedTextToSpeech'); // Bước 2: Định nghĩa ra những việc cần làm trong tiến trình hàng đợi
          updatedTextToSpeech.process( /*#__PURE__*/function () {
            var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(job, done) {
              var existContentClone, fullTextToSpeech, textToSpeechToCallApi;
              return _regenerator["default"].wrap(function _callee4$(_context4) {
                while (1) switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.prev = 0;
                    // job.data ở đây chính là updatedUser được truyền vào từ bước 4
                    existContentClone = (0, _lodash.cloneDeep)(job.data);
                    fullTextToSpeech = ['VN_FEMALE_1', 'VN_FEMALE_2', 'VN_MALE_1', 'VN_MALE_2', 'EN_FEMALE_1', 'EN_FEMALE_2', 'EN_MALE_1', 'EN_MALE_2']; // Lọc ra những thằng chưa có giọng đọc
                    textToSpeechToCallApi = fullTextToSpeech.filter(function (textToSpeechId) {
                      return textToSpeechId !== data.textToSpeechId;
                    });
                    _context4.next = 6;
                    return _axios["default"].all(textToSpeechToCallApi.map(function (textToSpeechId) {
                      return _axios["default"].post("https://texttospeech.googleapis.com/v1/text:synthesize?key=".concat(_environtment.env.MAP_API_KEY), {
                        input: {
                          text: existContentClone.plainText
                        },
                        voice: {
                          languageCode: _constants.TextToSpeechConstants[textToSpeechId].languageCode,
                          name: _constants.TextToSpeechConstants[textToSpeechId].name
                        },
                        audioConfig: {
                          audioEncoding: 'mp3'
                        }
                      });
                    })).then( /*#__PURE__*/function () {
                      var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(responses) {
                        var resultUpdated;
                        return _regenerator["default"].wrap(function _callee3$(_context3) {
                          while (1) switch (_context3.prev = _context3.next) {
                            case 0:
                              responses.map(function (res, index) {
                                existContentClone.plainTextBase64[textToSpeechToCallApi[index]] = res.data.audioContent;
                              });
                              _context3.next = 3;
                              return _content.ContentModel.updateById(existContentClone._id.toString(), {
                                plainTextBase64: existContentClone.plainTextBase64
                              });
                            case 3:
                              resultUpdated = _context3.sent;
                              done(null, resultUpdated);
                            case 5:
                            case "end":
                              return _context3.stop();
                          }
                        }, _callee3);
                      }));
                      return function (_x6) {
                        return _ref5.apply(this, arguments);
                      };
                    }())["catch"](function (err) {
                      return console.log(err);
                    });
                  case 6:
                    _context4.next = 11;
                    break;
                  case 8:
                    _context4.prev = 8;
                    _context4.t0 = _context4["catch"](0);
                    done(new Error('Error from updatedTextToSpeech.process'));
                  case 11:
                  case "end":
                    return _context4.stop();
                }
              }, _callee4, null, [[0, 8]]);
            }));
            return function (_x4, _x5) {
              return _ref4.apply(this, arguments);
            };
          }());
          // B3: Check completed hoặc failed, tùy trường hợp yêu cầu mà cần cái event này, để bắn thông báo khi job chạy xong chẳng hạn
          // Nhiều event khác: https://github.com/OptimalBits/bull/blob/HEAD/REFERENCE.md#events
          updatedTextToSpeech.on('completed', function (job, result) {
            // Bắn kết quả về Slack
            _SendMessageToSlack.SendMessageToSlack.sendToSlack("Job v\u1EDBi id l\xE0: ".concat(job.id, " v\xE0 t\xEAn job: *").concat(job.queue.name, "* \u0111\xE3 *xong* v\xE0 k\u1EBFt qu\u1EA3 l\xE0: ").concat(result));
          });
          updatedTextToSpeech.on('failed', function (job, error) {
            // Bắn lỗi về Slack hoặc Telegram ...
            _SendMessageToSlack.SendMessageToSlack.sendToSlack("Notification: Job v\u1EDBi id l\xE0 ".concat(job.id, " v\xE0 t\xEAn job l\xE0 *").concat(job.queue.name, "* \u0111\xE3 b\u1ECB *l\u1ED7i* \n\n ").concat(error));
          });

          // Bước 4: bước quan trọng cuối cùng: Thêm vào vào đợi Redis để xử lý
          updatedTextToSpeech.add(existContent, {
            attempts: 2,
            // số lần thử lại nếu lỗi
            backoff: 5000 //khoảng thời gian delay giữa các lần thử lại job
          });
          _context5.next = 24;
          break;
        case 22:
          console.log('khong vao call api');
          // tùy theo yêu cầu trả về ở đây t chỉ trả về mỗi textToSpeech
          result = {
            textToSpeech: existContent.plainTextBase64[data.textToSpeechId]
          };
        case 24:
          return _context5.abrupt("return", result);
        case 27:
          _context5.prev = 27;
          _context5.t0 = _context5["catch"](1);
          throw new Error(_context5.t0);
        case 30:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[1, 27]]);
  }));
  return function getTextToSpeech(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
var ContentService = {
  createNew: createNew,
  getTextToSpeech: getTextToSpeech
};
exports.ContentService = ContentService;