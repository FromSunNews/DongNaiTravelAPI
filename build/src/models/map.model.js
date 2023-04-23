"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapModel = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _mongodb = require("mongodb");
var _mongodb2 = require("../config/mongodb");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
// Define Map collection
var mapCollectionName = 'maps';
var mapCollectionSchema = _joi["default"].object({
  place_id: _joi["default"].string().required(),
  // get _id in photos collection
  photos_id: _joi["default"].string()["default"](null),
  // get _id in reviews collection
  reviews_id: _joi["default"].string()["default"](null),
  // get _id in reviews collection
  content_id: _joi["default"].string()["default"](null),
  isRecommended: _joi["default"]["boolean"]()["default"](false),
  numberOfVisited: _joi["default"].number()["default"](0),
  reference: _joi["default"].string()["default"](null),
  plus_code: _joi["default"].object()["default"](null),
  business_status: _joi["default"].string()["default"](null),
  current_opening_hours: _joi["default"].object()["default"](null),
  opening_hours: _joi["default"].object()["default"](null),
  // address name
  formatted_address: _joi["default"].string()["default"](null),
  name: _joi["default"].string()["default"](null),
  address_components: _joi["default"].array()["default"](null),
  adr_address: _joi["default"].string()["default"](null),
  // number phone
  formatted_phone_number: _joi["default"].string()["default"](null),
  international_phone_number: _joi["default"].string()["default"](null),
  geometry: _joi["default"].object()["default"](null),
  // icons
  icon: _joi["default"].string()["default"](null),
  icon_background_color: _joi["default"].string()["default"](null),
  icon_mask_base_uri: _joi["default"].string()["default"](null),
  // photos:
  // photos: Joi.array().default(null),

  rating: _joi["default"].number()["default"](null),
  user_ratings_total: _joi["default"].number()["default"](null),
  // reviews: Joi.array().default(null),
  editorial_summary: _joi["default"].object()["default"](null),
  types: _joi["default"].array()["default"](null),
  url: _joi["default"].string()["default"](null),
  utc_offset: _joi["default"].number()["default"](null),
  vicinity: _joi["default"].string()["default"](null),
  website: _joi["default"].string()["default"](null),
  wheelchair_accessible_entrance: _joi["default"]["boolean"]()["default"](null),
  permanently_closed: _joi["default"]["boolean"]()["default"](null),
  curbside_pickup: _joi["default"]["boolean"]()["default"](null),
  delivery: _joi["default"]["boolean"]()["default"](null),
  dine_in: _joi["default"]["boolean"]()["default"](null),
  price_level: _joi["default"].number()["default"](null),
  reservable: _joi["default"]["boolean"]()["default"](null),
  scope: _joi["default"].string()["default"](null),
  secondary_opening_hours: _joi["default"].array()["default"](null),
  serves_beer: _joi["default"]["boolean"]()["default"](null),
  serves_breakfast: _joi["default"]["boolean"]()["default"](null),
  serves_brunch: _joi["default"]["boolean"]()["default"](null),
  serves_dinner: _joi["default"]["boolean"]()["default"](null),
  serves_lunch: _joi["default"]["boolean"]()["default"](null),
  serves_vegetarian_food: _joi["default"]["boolean"]()["default"](null),
  serves_wine: _joi["default"]["boolean"]()["default"](null),
  takeout: _joi["default"]["boolean"]()["default"](null),
  createdAt: _joi["default"].date().timestamp('javascript')["default"](Date.now),
  updatedAt: _joi["default"].date().timestamp()["default"](null)
});

// Phuong: Đây là những trường không được update (giá trị cố định không đổi)
var INVALID_UPDATE_FILEDS = ['_id', 'place_id', 'createdAt'];

// Phuong: Tạo Schema để mongodb biết tạo bảng ntn
var validateSchema = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return mapCollectionSchema.validateAsync(data, {
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

// Phương: tạo mới map
var createNew = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(data) {
    var validatedValue, result;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return validateSchema(data);
        case 3:
          validatedValue = _context6.sent;
          _context6.next = 6;
          return (0, _mongodb2.getDB)().collection(mapCollectionName).insertOne(validatedValue);
        case 6:
          result = _context6.sent;
          return _context6.abrupt("return", result);
        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          throw new Error(_context6.t0);
        case 13:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 10]]);
  }));
  return function createNew(_x8) {
    return _ref6.apply(this, arguments);
  };
}();

// Phuong: Cập nhật map thông qua place_id
var updateByPlaceId = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(place_id, data) {
    var updateData, result;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          updateData = _objectSpread({}, data); // Phuong: CHỗ này là xóa những trường mà mình không cho phép update
          Object.keys(updateData).forEach(function (fieldName) {
            if (INVALID_UPDATE_FILEDS.includes(fieldName)) {
              delete updateData[fieldName];
            }
          });
          _context7.next = 5;
          return (0, _mongodb2.getDB)().collection(mapCollectionName).findOneAndUpdate({
            place_id: place_id
          }, {
            $set: updateData
          }, {
            returnDocument: 'after'
          });
        case 5:
          result = _context7.sent;
          return _context7.abrupt("return", result.value);
        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](0);
          throw new Error(_context7.t0);
        case 12:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 9]]);
  }));
  return function updateByPlaceId(_x9, _x10) {
    return _ref7.apply(this, arguments);
  };
}();
var createManyPlaces = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(places) {
    var result;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return (0, _mongodb2.getDB)().collection(mapCollectionName).insertMany(places);
        case 3:
          result = _context8.sent;
          console.log('🚀 ~ Successfully ~ createManyPlaces ~ places');
          return _context8.abrupt("return", result);
        case 8:
          _context8.prev = 8;
          _context8.t0 = _context8["catch"](0);
          throw new Error(_context8.t0);
        case 11:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 8]]);
  }));
  return function createManyPlaces(_x11) {
    return _ref8.apply(this, arguments);
  };
}();
var MapModel = {
  mapCollectionName: mapCollectionName,
  createNew: createNew,
  updateByPlaceId: updateByPlaceId,
  findOneById: findOneById,
  findOneByPlaceIdStartEnd: findOneByPlaceIdStartEnd,
  findOneByPlaceId: findOneByPlaceId,
  findManyInLimit: findManyInLimit,
  createManyPlaces: createManyPlaces
};
exports.MapModel = MapModel;