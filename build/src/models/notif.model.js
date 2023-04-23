"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NotifModel = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _mongodb = require("mongodb");
var _mongodb2 = require("../config/mongodb");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
// Define notif collection
var notifCollectionName = 'notifs';
var notifCollectionSchema = _joi["default"].object({
  userReceivedId: _joi["default"].string().required(),
  userSentId: _joi["default"].string().required(),
  userSent: _joi["default"].object()["default"]({}),
  typeNofif: _joi["default"].string().required(),
  desc: _joi["default"].object()["default"]({}),
  content: _joi["default"].object()["default"]({}),
  _destroy: _joi["default"]["boolean"]()["default"](false),
  _isVisited: _joi["default"]["boolean"]()["default"](false),
  createdAt: _joi["default"].date().timestamp('javascript')["default"](Date.now),
  updatedAt: _joi["default"].date().timestamp()["default"](null)
});
var INVALID_UPDATE_FIELDS = ['_id', 'userSentId', 'userReceivedId', 'createdAt', 'typeNofif', 'desc', 'content'];
var validateSchema = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return notifCollectionSchema.validateAsync(data, {
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
var findOneById = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(id) {
    var result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return (0, _mongodb2.getDB)().collection(notifCollectionName).findOne({
            _id: (0, _mongodb.ObjectId)(id)
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
var createNewNotif = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(data) {
    var validatedValue, result;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return validateSchema(data);
        case 3:
          validatedValue = _context3.sent;
          _context3.next = 6;
          return (0, _mongodb2.getDB)().collection(notifCollectionName).insertOne(validatedValue);
        case 6:
          result = _context3.sent;
          return _context3.abrupt("return", result);
        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          throw new Error(_context3.t0);
        case 13:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 10]]);
  }));
  return function createNewNotif(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
var updateNotif = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(id, data) {
    var updateData, result;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          updateData = _objectSpread({}, data); // Phuong: CHỗ này là xóa những trường mà mình không cho phép update
          Object.keys(updateData).forEach(function (fieldName) {
            if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
              delete updateData[fieldName];
            }
          });
          _context4.next = 5;
          return (0, _mongodb2.getDB)().collection(notifCollectionName).findOneAndUpdate(
          // Phuong: Phải chuyển _id ở client thành ObjectId
          {
            _id: new _mongodb.ObjectId(id)
          }, {
            $set: updateData
          }, {
            returnDocument: 'after'
          });
        case 5:
          result = _context4.sent;
          return _context4.abrupt("return", result.value);
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
  return function updateNotif(_x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();
var updateManyNotifs = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(arrayNotifs) {
    var newArray, result;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          //  Chuyển arrayNotifs về dạng ObjectID
          newArray = [];
          arrayNotifs.forEach(function (element) {
            element = new _mongodb.ObjectId(element);
            newArray.push(element);
          });
          _context5.next = 5;
          return (0, _mongodb2.getDB)().collection(notifCollectionName).updateMany({
            _id: {
              $in: newArray
            }
          }, {
            $set: {
              _isVisited: true
            }
          });
        case 5:
          result = _context5.sent;
          console.log('🚀 ~ file: notif.model.js:90 ~ updateManyNotifs ~ result:', result);
          return _context5.abrupt("return", result.value);
        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](0);
          throw new Error(_context5.t0);
        case 13:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 10]]);
  }));
  return function updateManyNotifs(_x6) {
    return _ref5.apply(this, arguments);
  };
}();
var NotifModel = {
  notifCollectionName: notifCollectionName,
  createNewNotif: createNewNotif,
  findOneById: findOneById,
  updateNotif: updateNotif,
  updateManyNotifs: updateManyNotifs
};
exports.NotifModel = NotifModel;