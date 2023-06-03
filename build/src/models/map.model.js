"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapModel = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _mongodb = require("mongodb");
var _mongodb2 = require("../config/mongodb");
var _constants = require("../utilities/constants");
var _mongo = require("../utilities/mongo");
var _place = require("../schemas/place.schema");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
// Define Map collection
var mapCollectionName = 'maps';

// Phuong: Đây là những trường không được update (giá trị cố định không đổi)
var INVALID_UPDATE_FILEDS = ['_id', 'place_id', 'createdAt'];

// Phuong: Tạo Schema để mongodb biết tạo bảng ntn
var validateSchema = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _place.mapCollectionSchema.validateAsync(data, {
            abortEarly: false
          });
        case 2:
          return _context.abrupt("return", _context.sent);
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function validateSchema(_x) {
    return _ref.apply(this, arguments);
  };
}();

// Phuong: Tìm dựa trên id của map.
var findOneById = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(id) {
    var result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return (0, _mongodb2.getDB)().collection(mapCollectionName)
          // Phuong: Bởi vì key _id trong mongodb đucợ luu ở dạng ObjectId nên phải
          // Phuong: chuyển qua ObjectId từ phía client đẩy lên mới tìm được
          .findOne({
            _id: new _mongodb.ObjectId(id)
          });
        case 3:
          result = _context2.sent;
          return _context2.abrupt("return", result);
        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          throw new Error(_context2.t0);
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 7]]);
  }));
  return function findOneById(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

// Phuong: Tìm dựa trên place_id
var findOneByPlaceId = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(place_id) {
    var result;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return (0, _mongodb2.getDB)().collection(mapCollectionName).findOne({
            place_id: place_id
          });
        case 3:
          result = _context3.sent;
          return _context3.abrupt("return", result);
        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          throw new Error(_context3.t0);
        case 10:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 7]]);
  }));
  return function findOneByPlaceId(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

// Phuong: Tìm dựa trên place_id nhưng bắt đầu bằng kí tự 1 và kết thúc bằng kí tự 2
var findOneByPlaceIdStartEnd = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(firstString, lastString) {
    var regexPattern, result;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          regexPattern = new RegExp("^".concat(firstString, ".*").concat(lastString, "$"));
          _context4.next = 4;
          return (0, _mongodb2.getDB)().collection(mapCollectionName).find({
            place_id: {
              $regex: regexPattern
            }
          }).toArray();
        case 4:
          result = _context4.sent;
          console.log('🚀 ~ file: map.model.js:118 ~ findOneByPlaceIdStartEnd ~ result:', result);
          return _context4.abrupt("return", result);
        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          throw new Error(_context4.t0);
        case 12:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 9]]);
  }));
  return function findOneByPlaceIdStartEnd(_x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();

// Tuan: Lấy tất cả các dữ liệu của places, có giới hạn.
/**
 * Method này dùng để trả về một mảng dữ liệu của places. Có filter, limit và skip. Ngoài ra
 * thì có thể yêu cầu các trường dữ liệu cần trả về.
 * @param {{[key: string]: string}} filter Object chứa các filter theo tiêu chuẩn của mongo, nhưng đồng thời cũng phải thỏa scheme của Place.
 * @param {{[key: string]: string}} fields Object chứa các field-true để lấy các trường dữ liệu mong muốn.
 * @param {number} limit Số records giới hạn được trả về.
 * @param {number} skip Số records muốn mongo bỏ qua.
 * @returns
 */
var findManyInLimit = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(filter, fields) {
    var limit,
      skip,
      cursor,
      result,
      _args5 = arguments;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          limit = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : 10;
          skip = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : 0;
          _context5.prev = 2;
          console.log(fields);
          cursor = (0, _mongodb2.getDB)().collection(mapCollectionName).find(filter, {
            projection: fields
          }).limit(limit).skip(skip);
          _context5.next = 7;
          return cursor.toArray();
        case 7:
          result = _context5.sent;
          return _context5.abrupt("return", result);
        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](2);
          throw new Error(_context5.t0);
        case 14:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[2, 11]]);
  }));
  return function findManyInLimit(_x6, _x7) {
    return _ref5.apply(this, arguments);
  };
}();

// Tuan: Lấy tất cả các dữ liệu của places, có giới hạn.
/**
 * Method này dùng để trả về một mảng dữ liệu của places. Có filter, limit và skip. Ngoài ra
 * thì có thể yêu cầu các trường dữ liệu cần trả về.
 * @param {string} filter Object chứa các filter theo tiêu chuẩn của mongo, nhưng đồng thời cũng phải thỏa scheme của Place.
 * @param {string} fields Object chứa các field-true để lấy các trường dữ liệu mong muốn.
 * @param {number} limit Số records giới hạn được trả về.
 * @param {number} skip Số records muốn mongo bỏ qua.
 * @returns
 */
var findManyInLimitWithPipeline = function () {
  return /*#__PURE__*/function () {
    var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(data) {
      var filter, fields, _data$limit, limit, _data$skip, skip, user, _fields, filters, pipeline, addFieldsStage, projectStage, findStage, fieldsInArr, _iterator, _step, _filter, _filter$split, _filter$split2, key, value, hasQuality, expression, _loop, _key, _ret, cursor, result;
      return _regenerator["default"].wrap(function _callee6$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            filter = data.filter, fields = data.fields, _data$limit = data.limit, limit = _data$limit === void 0 ? 10 : _data$limit, _data$skip = data.skip, skip = _data$skip === void 0 ? 0 : _data$skip, user = data.user;
            _context7.prev = 1;
            // Đầu tiên thì split cái filter ra bằng khoảng trắng;
            filters = filter === null || filter === void 0 ? void 0 : filter.split(',');
            pipeline = [];
            addFieldsStage = [];
            projectStage = {
              '$project': {}
            }; // T gọi cái này là find stage là bời vì nó sẽ tìm record theo $match
            findStage = {
              match: {
                $match: {}
              },
              others: []
            };
            fieldsInArr = (_fields = fields) === null || _fields === void 0 ? void 0 : _fields.split(';');
            if (!filters) {
              _context7.next = 35;
              break;
            }
            _iterator = _createForOfIteratorHelper(filters);
            _context7.prev = 10;
            _iterator.s();
          case 12:
            if ((_step = _iterator.n()).done) {
              _context7.next = 27;
              break;
            }
            _filter = _step.value;
            _filter = decodeURIComponent(_filter);
            _filter$split = _filter.split(':'), _filter$split2 = (0, _slicedToArray2["default"])(_filter$split, 2), key = _filter$split2[0], value = _filter$split2[1];
            hasQuality = key.includes('quality');
            expression = _mongo.PlaceFindStages.quality.expressions[value] || _mongo.PlaceFindStages[key].expressions[key];
            if (!expression()['$match']) findStage.others.push(expression());
            if (!hasQuality) {
              _context7.next = 22;
              break;
            }
            findStage.match['$match'] = _objectSpread(_objectSpread({}, findStage.match['$match']), expression()['$match']);
            return _context7.abrupt("continue", 25);
          case 22:
            if (hasQuality) {
              _context7.next = 25;
              break;
            }
            findStage.match['$match'] = _objectSpread(_objectSpread({}, findStage.match['$match']), expression(value)['$match']);
            return _context7.abrupt("continue", 25);
          case 25:
            _context7.next = 12;
            break;
          case 27:
            _context7.next = 32;
            break;
          case 29:
            _context7.prev = 29;
            _context7.t0 = _context7["catch"](10);
            _iterator.e(_context7.t0);
          case 32:
            _context7.prev = 32;
            _iterator.f();
            return _context7.finish(32);
          case 35:
            // console.log('FIND STAGE: ', findStage)

            if (!addFieldsStage[0]) addFieldsStage[0] = {
              '$addFields': {}
            };
            _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop(_key) {
              var arrVal, stageKey, stage;
              return _regenerator["default"].wrap(function _loop$(_context6) {
                while (1) switch (_context6.prev = _context6.next) {
                  case 0:
                    if (!(_key === _mongo.SpecialtyPlaceFields.isLiked.field || _key === _mongo.SpecialtyPlaceFields.isVisited.field)) {
                      _context6.next = 4;
                      break;
                    }
                    if (Boolean(fields) && !fieldsInArr.find(function (field) {
                      return field === _key;
                    })) fields += ";".concat(_key);
                    if (user) {
                      arrVal = _key === _mongo.SpecialtyPlaceFields.isLiked.field ? user.savedPlaces : user.visitedPlaces;
                      if (!addFieldsStage[0]) addFieldsStage[0] = {
                        '$addFields': {}
                      };
                      addFieldsStage[0]['$addFields'][_key] = {
                        $in: ['$place_id', arrVal]
                      };
                    }
                    return _context6.abrupt("return", "continue");
                  case 4:
                    _context6.t0 = _regenerator["default"].keys(_mongo.SpecialtyPlaceFieldStageNames);
                  case 5:
                    if ((_context6.t1 = _context6.t0()).done) {
                      _context6.next = 15;
                      break;
                    }
                    stageKey = _context6.t1.value;
                    if (!(Boolean(fields) && !fieldsInArr.find(function (field) {
                      return field === _key;
                    }))) {
                      _context6.next = 9;
                      break;
                    }
                    return _context6.abrupt("continue", 5);
                  case 9:
                    stage = _mongo.SpecialtyPlaceFields[_key].stages[stageKey];
                    if (!addFieldsStage[0]) addFieldsStage[0] = {
                      '$addFields': {}
                    };
                    if (stageKey === _mongo.SpecialtyPlaceFieldStageNames.addFields && stage) {
                      addFieldsStage[0]['$addFields'][_key] = stage['$addFields'];
                    }
                    if (stageKey === _mongo.SpecialtyPlaceFieldStageNames.lookup && stage) {
                      pipeline.push(stage);
                    }
                    _context6.next = 5;
                    break;
                  case 15:
                  case "end":
                    return _context6.stop();
                }
              }, _loop);
            });
            _context7.t1 = _regenerator["default"].keys(_mongo.SpecialtyPlaceFields);
          case 38:
            if ((_context7.t2 = _context7.t1()).done) {
              _context7.next = 46;
              break;
            }
            _key = _context7.t2.value;
            return _context7.delegateYield(_loop(_key), "t3", 41);
          case 41:
            _ret = _context7.t3;
            if (!(_ret === "continue")) {
              _context7.next = 44;
              break;
            }
            return _context7.abrupt("continue", 38);
          case 44:
            _context7.next = 38;
            break;
          case 46:
            projectStage.$project = _objectSpread({}, (0, _mongo.getExpectedFieldsProjection)(fields));
            pipeline.push.apply(pipeline, [findStage.match].concat((0, _toConsumableArray2["default"])(findStage.others)));
            if (Object.keys(projectStage.$project).length >= 1) pipeline.push(projectStage);
            pipeline.push.apply(pipeline, addFieldsStage.concat([{
              '$skip': skip
            }, {
              '$limit': limit
            }]));
            console.log('Pipeline: ', pipeline);
            cursor = (0, _mongodb2.getDB)().collection(mapCollectionName).aggregate(pipeline);
            _context7.next = 54;
            return cursor.toArray();
          case 54:
            result = _context7.sent;
            return _context7.abrupt("return", result);
          case 58:
            _context7.prev = 58;
            _context7.t4 = _context7["catch"](1);
            console.error(_context7.t4.message);
            return _context7.abrupt("return", undefined);
          case 62:
          case "end":
            return _context7.stop();
        }
      }, _callee6, null, [[1, 58], [10, 29, 32, 35]]);
    }));
    return function (_x8) {
      return _ref6.apply(this, arguments);
    };
  }();
}();

/**
 * Hàm này dùng để tìm thông tin chi tiết của một địa điểm nào đó.
 * @param {*} data
 * @returns
 */
var findOneWithPipeline = function () {
  /*
    Khai bảo các fields đặc biệt (Chính là các fields được lookup)
    Lấy dữ liệu này hoạt động theo kiểu:
    - Nếu như fields là rỗng, thì nó sẽ lấy tất cả fields trong place.
    - Nếu như fields chứa một hay nhiều fields đặc biệt fn này sẽ lấy dữ liệu tất cả các fields trong
    place cùng với một hay nhiều fields đặc biệt.
    - Nếu như fields chứa một hay nhiều fields đặc và có một hay nhiều fields trong place, thì
    fn này sẽ lấy dữ liệu của một hay nhiều fields đặc biệt cùng với một hay nhiều fields trong place.
    Và như đã nói thì khi lookup các fields đặc biệt, mình phải thêm các stage khác hỗ trợ. Cho nên trong
    biến này mình sẽ khai báo thêm các data cho các stage đó.
  */
  // let specialtyFields = {
  //   reviews: {
  //     field: 'reviews',
  //     addFieldsStage:  { '$arrayElemAt': ['$reviews.reviews', 0] },
  //     lookupStage: {
  //       from: 'reviews',
  //       localField: 'place_id',
  //       foreignField: 'place_reviews_id',
  //       as: 'reviews'
  //     }
  //   },
  //   content: {
  //     field: 'content',
  //     addFieldsStage:  { '$arrayElemAt': ['$content', 0] },
  //     lookupStage: {
  //       from: 'content',
  //       localField: undefined,
  //       foreignField: undefined,
  //       as: 'content',
  //       options: {
  //         extras: {
  //           let: { pid: '$content_id' }
  //         },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $eq: ['$_id', { $toObjectId: '$$pid' }]
  //               }
  //             }
  //           },
  //           {
  //             $project: {
  //               plainTextMarkFormat: true,
  //               plainTextBase64: true,
  //               speech: true
  //             }
  //           }
  //         ]
  //       }
  //     }
  //   },
  //   isLiked: {
  //     field: 'isLiked'
  //   }
  // }

  return /*#__PURE__*/function () {
    var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(data, user) {
      var _fields2, placeId, fields, lang, pipeline, placeDetailsProjectionStage, addFieldsStage, fieldsInArr, _loop2, key, _ret2, cursor, result;
      return _regenerator["default"].wrap(function _callee7$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            // url chỉ nhận 2 query là placeId và fields (có thể update thêm)
            // userId có thể undefined bởi vì không phải lúc nào cũng có thể
            placeId = data.placeId, fields = data.fields, lang = data.lang;
            console.log('REQUESTED FIELDS: ', fields);
            // Khai báo pipeline. Stage đầu tiên là mình kiếm ra các document này trước.
            // Nếu như tìm được 1 document thì nó sẽ chỉ trả về một document trong một mảng.
            // Và vì mỗi place chỉ có một placeId cho nên là chỉ luôn tìm được một id.
            pipeline = [{
              '$match': {
                'place_id': placeId
              }
            }]; // Stage này dùng để chọn các fields data mong muốn trong `fields`.
            // Stage này hỗ trợ cho stage ở trên, dùng để thêm các field bên ngoài trong quá trình lookup
            // Trong đó có reviews và content.
            addFieldsStage = [];
            if (lang) {
              _mongo.SpecialtyPlaceFields.content.stages['lookup']['$lookup'].pipeline[1].$project.speech = (0, _defineProperty2["default"])({}, lang, true);
              _mongo.SpecialtyPlaceFields.content.stages['lookup']['$lookup'].pipeline[1].$project.plainTextBase64 = (0, _defineProperty2["default"])({}, lang, true);
              _mongo.SpecialtyPlaceFields.content.stages['lookup']['$lookup'].pipeline[1].$project.plainTextMarkFormat = (0, _defineProperty2["default"])({}, lang, true);
            }
            fieldsInArr = (_fields2 = fields) === null || _fields2 === void 0 ? void 0 : _fields2.split(';');
            _loop2 = /*#__PURE__*/_regenerator["default"].mark(function _loop2(key) {
              var arrVal, stageKey, stage;
              return _regenerator["default"].wrap(function _loop2$(_context8) {
                while (1) switch (_context8.prev = _context8.next) {
                  case 0:
                    if (!(key === _mongo.SpecialtyPlaceFields.isLiked.field || key === _mongo.SpecialtyPlaceFields.isVisited.field)) {
                      _context8.next = 4;
                      break;
                    }
                    if (Boolean(fields) && !fieldsInArr.find(function (field) {
                      return field === key;
                    })) fields += ";".concat(key);
                    if (user) {
                      arrVal = key === _mongo.SpecialtyPlaceFields.isLiked.field ? user.savedPlaces : user.visitedPlaces;
                      if (!addFieldsStage[0]) addFieldsStage[0] = {
                        '$addFields': {}
                      };
                      addFieldsStage[0]['$addFields'][key] = {
                        $in: ['$place_id', arrVal]
                      };
                    }
                    return _context8.abrupt("return", "continue");
                  case 4:
                    _context8.t0 = _regenerator["default"].keys(_mongo.SpecialtyPlaceFieldStageNames);
                  case 5:
                    if ((_context8.t1 = _context8.t0()).done) {
                      _context8.next = 15;
                      break;
                    }
                    stageKey = _context8.t1.value;
                    if (!(Boolean(fields) && !fieldsInArr.find(function (field) {
                      return field === key;
                    }))) {
                      _context8.next = 9;
                      break;
                    }
                    return _context8.abrupt("continue", 5);
                  case 9:
                    stage = _mongo.SpecialtyPlaceFields[key].stages[stageKey];
                    if (!addFieldsStage[0]) addFieldsStage[0] = {
                      '$addFields': {}
                    };
                    if (stageKey === _mongo.SpecialtyPlaceFieldStageNames.addFields && stage) {
                      addFieldsStage[0]['$addFields'][key] = stage['$addFields'];
                    }
                    if (stageKey === _mongo.SpecialtyPlaceFieldStageNames.lookup && stage) {
                      pipeline.push(stage);
                    }
                    _context8.next = 5;
                    break;
                  case 15:
                  case "end":
                    return _context8.stop();
                }
              }, _loop2);
            });
            _context9.t0 = _regenerator["default"].keys(_mongo.SpecialtyPlaceFields);
          case 9:
            if ((_context9.t1 = _context9.t0()).done) {
              _context9.next = 17;
              break;
            }
            key = _context9.t1.value;
            return _context9.delegateYield(_loop2(key), "t2", 12);
          case 12:
            _ret2 = _context9.t2;
            if (!(_ret2 === "continue")) {
              _context9.next = 15;
              break;
            }
            return _context9.abrupt("continue", 9);
          case 15:
            _context9.next = 9;
            break;
          case 17:
            // Tạo project stage cho các fields của place. Nếu như fields chỉ chứa các fields đặc biệt hoặc
            // là không có fields nào thì nó sẽ trả về rỗng.
            placeDetailsProjectionStage = (0, _mongo.createProjectionStage)((0, _mongo.getExpectedFieldsProjection)(fields));
            pipeline.push.apply(pipeline, addFieldsStage.concat((0, _toConsumableArray2["default"])(placeDetailsProjectionStage)));
            // console.log('MAP MODEL findOneWithPipeline (addFieldsStage): ', addFieldsStage[0]['$addFields']['content'])
            // console.log('MAP MODEL findOneWithPipeline (addFieldsStage): ', addFieldsStage[0]['$addFields']['reviews'])
            console.log('MAP MODEL findOneWithPipeline (pipeline): ', pipeline);
            cursor = (0, _mongodb2.getDB)().collection(mapCollectionName).aggregate(pipeline);
            _context9.next = 23;
            return cursor.toArray();
          case 23:
            result = _context9.sent;
            return _context9.abrupt("return", result[0]);
          case 27:
            _context9.prev = 27;
            _context9.t3 = _context9["catch"](0);
            console.error(_context9.t3.message);
            return _context9.abrupt("return", undefined);
          case 31:
          case "end":
            return _context9.stop();
        }
      }, _callee7, null, [[0, 27]]);
    }));
    return function (_x9, _x10) {
      return _ref7.apply(this, arguments);
    };
  }();
}();

// Phương: tạo mới map
var createNew = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(data) {
    var validatedValue, result;
    return _regenerator["default"].wrap(function _callee8$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return validateSchema(data);
        case 3:
          validatedValue = _context10.sent;
          _context10.next = 6;
          return (0, _mongodb2.getDB)().collection(mapCollectionName).insertOne(validatedValue);
        case 6:
          result = _context10.sent;
          return _context10.abrupt("return", result);
        case 10:
          _context10.prev = 10;
          _context10.t0 = _context10["catch"](0);
          throw new Error(_context10.t0);
        case 13:
        case "end":
          return _context10.stop();
      }
    }, _callee8, null, [[0, 10]]);
  }));
  return function createNew(_x11) {
    return _ref8.apply(this, arguments);
  };
}();

// Phuong: Cập nhật map thông qua place_id
var updateByPlaceId = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(place_id, data) {
    var updateData, result;
    return _regenerator["default"].wrap(function _callee9$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          updateData = _objectSpread({}, data); // Phuong: CHỗ này là xóa những trường mà mình không cho phép update
          Object.keys(updateData).forEach(function (fieldName) {
            if (INVALID_UPDATE_FILEDS.includes(fieldName)) {
              delete updateData[fieldName];
            }
          });
          _context11.next = 5;
          return (0, _mongodb2.getDB)().collection(mapCollectionName).findOneAndUpdate({
            place_id: place_id
          }, {
            $set: updateData
          }, {
            returnDocument: 'after'
          });
        case 5:
          result = _context11.sent;
          return _context11.abrupt("return", result.value);
        case 9:
          _context11.prev = 9;
          _context11.t0 = _context11["catch"](0);
          throw new Error(_context11.t0);
        case 12:
        case "end":
          return _context11.stop();
      }
    }, _callee9, null, [[0, 9]]);
  }));
  return function updateByPlaceId(_x12, _x13) {
    return _ref9.apply(this, arguments);
  };
}();
var createManyPlaces = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(places) {
    var result;
    return _regenerator["default"].wrap(function _callee10$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return (0, _mongodb2.getDB)().collection(mapCollectionName).insertMany(places);
        case 3:
          result = _context12.sent;
          console.log('🚀 ~ Successfully ~ createManyPlaces ~ places');
          return _context12.abrupt("return", result);
        case 8:
          _context12.prev = 8;
          _context12.t0 = _context12["catch"](0);
          throw new Error(_context12.t0);
        case 11:
        case "end":
          return _context12.stop();
      }
    }, _callee10, null, [[0, 8]]);
  }));
  return function createManyPlaces(_x14) {
    return _ref10.apply(this, arguments);
  };
}();
var MapModel = {
  mapCollectionName: mapCollectionName,
  createNew: createNew,
  updateByPlaceId: updateByPlaceId,
  findOneById: findOneById,
  findOneWithPipeline: findOneWithPipeline,
  findOneByPlaceId: findOneByPlaceId,
  findManyInLimit: findManyInLimit,
  findManyInLimitWithPipeline: findManyInLimitWithPipeline,
  createManyPlaces: createManyPlaces
};
exports.MapModel = MapModel;