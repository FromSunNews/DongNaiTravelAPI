"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserModel = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _mongodb = require("mongodb");
var _mongodb2 = require("../../config/mongodb");
var _mongo = require("../../utilities/mongo");
var _user = require("../../schemas/user.schema");
var _notif = require("../notif.model");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
// Define User collection
var userCollectionName = 'users';

// Phuong: Đây là những trường không được update (giá trị cố định không đổi)
var INVALID_UPDATE_FILEDS = ['_id', 'email', 'username', 'role', 'createdAt'];

// Phuong: Tạo Schema để mongodb biết tạo bảng ntn
var validateSchema = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _user.userCollectionSchema.validateAsync(data, {
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

// Phuong: Tìm dựa trên id của user.
var findOneById = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(id) {
    var result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return (0, _mongodb2.getDB)().collection(userCollectionName)
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

// Phuong: Tìm dựa trên email
var findOneByEmail = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(emailValue) {
    var result;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return (0, _mongodb2.getDB)().collection(userCollectionName).findOne({
            email: emailValue
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
  return function findOneByEmail(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

// Phuong: Cập nhật user thông qua _id
var updateOneAndGet = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(id, data) {
    var updateData, result;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          updateData = _objectSpread({}, data); // Phuong: CHỗ này là xóa những trường mà mình không cho phép update
          Object.keys(updateData).forEach(function (fieldName) {
            if (INVALID_UPDATE_FILEDS.includes(fieldName)) {
              delete updateData[fieldName];
            }
          });
          _context4.next = 5;
          return (0, _mongodb2.getDB)().collection(userCollectionName).findOneAndUpdate(
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
          console.log('🚀 ~ file: user.model.js:105 ~ update ~ error:', _context4.t0);
          throw new Error(_context4.t0);
        case 13:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 9]]);
  }));
  return function updateOneAndGet(_x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();
var findOneByUserName = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(username) {
    var result;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return (0, _mongodb2.getDB)().collection(userCollectionName).findOne({
            username: username
          });
        case 3:
          result = _context5.sent;
          return _context5.abrupt("return", result);
        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          throw new Error(_context5.t0);
        case 10:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 7]]);
  }));
  return function findOneByUserName(_x6) {
    return _ref5.apply(this, arguments);
  };
}();

// Phương: tạo mới user
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
          return (0, _mongodb2.getDB)().collection(userCollectionName).insertOne(validatedValue);
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
  return function createNew(_x7) {
    return _ref6.apply(this, arguments);
  };
}();

// Phuong: Cập nhật user thông qua _id
var resetPassword = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(id, data) {
    var updateData, result;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          updateData = _objectSpread({}, data);
          _context7.next = 4;
          return (0, _mongodb2.getDB)().collection(userCollectionName).findOneAndUpdate(
          // Phuong: Phải chuyển _id ở client thành ObjectId
          {
            _id: new _mongodb.ObjectId(id)
          }, {
            $set: updateData
          }, {
            returnDocument: 'after'
          });
        case 4:
          result = _context7.sent;
          return _context7.abrupt("return", result.value);
        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](0);
          throw new Error(_context7.t0);
        case 11:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 8]]);
  }));
  return function resetPassword(_x8, _x9) {
    return _ref7.apply(this, arguments);
  };
}();
var getFullInfoUser = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(userId) {
    var result;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return (0, _mongodb2.getDB)().collection(userCollectionName).aggregate([{
            $match: {
              _id: (0, _mongodb.ObjectId)(userId)
            }
          }, {
            $lookup: {
              from: _notif.NotifModel.notifCollectionName,
              localField: 'notifIds',
              foreignField: '_id',
              as: 'notifs'
            }
          }]).toArray();
        case 3:
          result = _context8.sent;
          return _context8.abrupt("return", result[0] || []);
        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](0);
          throw new Error(_context8.t0);
        case 10:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 7]]);
  }));
  return function getFullInfoUser(_x10) {
    return _ref8.apply(this, arguments);
  };
}();
var UserModel = {
  userCollectionName: userCollectionName,
  createNew: createNew,
  findOneById: findOneById,
  findOneByEmail: findOneByEmail,
  findOneByUserName: findOneByUserName,
  resetPassword: resetPassword,
  getFullInfoUser: getFullInfoUser,
  updateOneAndGet: updateOneAndGet
};
exports.UserModel = UserModel;