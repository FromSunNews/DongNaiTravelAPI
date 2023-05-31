"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserModel = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _mongodb = require("mongodb");
var _mongodb2 = require("../config/mongodb");
var _notif = require("./notif.model");
var _mongo = require("../utilities/mongo");
var _user = require("../schemas/user.schema");
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
var findOneByUserName = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(username) {
    var result;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return (0, _mongodb2.getDB)().collection(userCollectionName).findOne({
            username: username
          });
        case 3:
          result = _context4.sent;
          return _context4.abrupt("return", result);
        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          throw new Error(_context4.t0);
        case 10:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 7]]);
  }));
  return function findOneByUserName(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

// Phương: tạo mới user
var createNew = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(data) {
    var validatedValue, result;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return validateSchema(data);
        case 3:
          validatedValue = _context5.sent;
          _context5.next = 6;
          return (0, _mongodb2.getDB)().collection(userCollectionName).insertOne(validatedValue);
        case 6:
          result = _context5.sent;
          return _context5.abrupt("return", result);
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
  return function createNew(_x5) {
    return _ref5.apply(this, arguments);
  };
}();

// Tuan: Cập nhật user bằng các trường hợp
var updateOneAndGetByCase = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(id, data) {
    var updateCase,
      updateData,
      updateExpression,
      result,
      _args6 = arguments;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          updateCase = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : 'default';
          _context6.prev = 1;
          updateData = typeof data === 'string' | 'number' ? data : Array.isArray(data) ? (0, _toConsumableArray2["default"])(data) : _objectSpread({}, data);
          Object.keys(updateData).forEach(function (fieldName) {
            if (INVALID_UPDATE_FILEDS.includes(fieldName)) {
              delete updateData[fieldName];
            }
          });
          updateExpression = _mongo.UserUpdateCases[updateCase](updateData);
          console.log('Update Expr: ', updateExpression);
          _context6.next = 8;
          return (0, _mongodb2.getDB)().collection(userCollectionName).findOneAndUpdate(
          // Phuong: Phải chuyển _id ở client thành ObjectId
          {
            _id: new _mongodb.ObjectId(id)
          }, updateExpression, {
            returnDocument: 'after'
          });
        case 8:
          result = _context6.sent;
          return _context6.abrupt("return", result.value);
        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](1);
          return _context6.abrupt("return", undefined);
        case 15:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[1, 12]]);
  }));
  return function updateOneAndGetByCase(_x6, _x7) {
    return _ref6.apply(this, arguments);
  };
}();

// Phuong: Cập nhật user thông qua _id
var updateOneAndGet = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(id, data) {
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
          result = _context7.sent;
          return _context7.abrupt("return", result.value);
        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](0);
          console.log('🚀 ~ file: user.model.js:105 ~ update ~ error:', _context7.t0);
          throw new Error(_context7.t0);
        case 13:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 9]]);
  }));
  return function updateOneAndGet(_x8, _x9) {
    return _ref7.apply(this, arguments);
  };
}();
var pushFollowerIds = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(userId, followingUserId) {
    var result;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return (0, _mongodb2.getDB)().collection(userCollectionName).findOneAndUpdate({
            _id: (0, _mongodb.ObjectId)(userId)
          }, {
            $push: {
              followerIds: (0, _mongodb.ObjectId)(followingUserId)
            }
          }, {
            returnDocument: 'after'
          });
        case 3:
          result = _context8.sent;
          return _context8.abrupt("return", result.value);
        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](0);
          console.log('🚀 ~ file: user.model.js:105 ~ update ~ error:', _context8.t0);
          throw new Error(_context8.t0);
        case 11:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 7]]);
  }));
  return function pushFollowerIds(_x10, _x11) {
    return _ref8.apply(this, arguments);
  };
}();

// Phuong: Cập nhật user bằng push vào cuối mảng
var pushFollowingIds = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(userId, followerUserId) {
    var result;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          console.log('🚀 ~ file: user.model.js:130 ~ pushFollowingIds ~ followerUserId:', followerUserId);
          _context9.prev = 1;
          _context9.next = 4;
          return (0, _mongodb2.getDB)().collection(userCollectionName).findOneAndUpdate({
            _id: new _mongodb.ObjectId(userId)
          },
          // Điều kiện để tìm document cần update
          {
            $push: {
              followingIds: (0, _mongodb.ObjectId)(followerUserId)
            }
          }, {
            returnDocument: 'after'
          });
        case 4:
          result = _context9.sent;
          return _context9.abrupt("return", result.value);
        case 8:
          _context9.prev = 8;
          _context9.t0 = _context9["catch"](1);
          console.log('🚀 ~ file: user.model.js:105 ~ update ~ error:', _context9.t0);
          throw new Error(_context9.t0);
        case 12:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[1, 8]]);
  }));
  return function pushFollowingIds(_x12, _x13) {
    return _ref9.apply(this, arguments);
  };
}();

// Phuong: Cập nhật user bằng push vào cuối mảng
var pushNotifIds = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(userId, notifId) {
    var result;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          console.log('🚀 ~ file: user.model.js:130 ~ pushFollowingIds ~ followerUserId:', notifId);
          _context10.prev = 1;
          _context10.next = 4;
          return (0, _mongodb2.getDB)().collection(userCollectionName).findOneAndUpdate({
            _id: new _mongodb.ObjectId(userId)
          },
          // Điều kiện để tìm document cần update
          {
            $push: {
              notifIds: (0, _mongodb.ObjectId)(notifId)
            }
          }, {
            returnDocument: 'after'
          });
        case 4:
          result = _context10.sent;
          return _context10.abrupt("return", result.value);
        case 8:
          _context10.prev = 8;
          _context10.t0 = _context10["catch"](1);
          console.log('🚀 ~ file: user.model.js:105 ~ update ~ error:', _context10.t0);
          throw new Error(_context10.t0);
        case 12:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[1, 8]]);
  }));
  return function pushNotifIds(_x14, _x15) {
    return _ref10.apply(this, arguments);
  };
}();

// Phuong: Cập nhật user thông qua _id
var resetPassword = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(id, data) {
    var updateData, result;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          updateData = _objectSpread({}, data);
          _context11.next = 4;
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
          result = _context11.sent;
          return _context11.abrupt("return", result.value);
        case 8:
          _context11.prev = 8;
          _context11.t0 = _context11["catch"](0);
          throw new Error(_context11.t0);
        case 11:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[0, 8]]);
  }));
  return function resetPassword(_x16, _x17) {
    return _ref11.apply(this, arguments);
  };
}();
var findFollowerIdsInLimit = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(userId) {
    var result;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          result = (0, _mongodb2.getDB)().collection(userCollectionName).find({
            _id: (0, _mongodb.ObjectId)(userId)
          },
          // Điều kiện để tìm document cần lấy dữ liệu
          {
            followerIds: {
              $slice: -4
            }
          } // Sử dụng $slice để lấy 4 phần tử cuối cùng từ mảng "following"
          ).toArray();
          return _context12.abrupt("return", result);
        case 5:
          _context12.prev = 5;
          _context12.t0 = _context12["catch"](0);
          throw new Error(_context12.t0);
        case 8:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[0, 5]]);
  }));
  return function findFollowerIdsInLimit(_x18) {
    return _ref12.apply(this, arguments);
  };
}();
var getFullInfoUser = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(userId) {
    var result;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _context13.next = 3;
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
          result = _context13.sent;
          return _context13.abrupt("return", result[0] || []);
        case 7:
          _context13.prev = 7;
          _context13.t0 = _context13["catch"](0);
          throw new Error(_context13.t0);
        case 10:
        case "end":
          return _context13.stop();
      }
    }, _callee13, null, [[0, 7]]);
  }));
  return function getFullInfoUser(_x19) {
    return _ref13.apply(this, arguments);
  };
}();
var deteleFollowingId = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(userId, followingId) {
    var result;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _context14.next = 3;
          return (0, _mongodb2.getDB)().collection(userCollectionName).updateOne({
            _id: (0, _mongodb.ObjectId)(userId)
          },
          // Điều kiện truy vấn để tìm bản ghi cần cập nhật
          {
            $pull: {
              followingIds: (0, _mongodb.ObjectId)(followingId)
            }
          } // Phương thức $pull để xóa phần tử có giá trị là abc khỏi mảng follower
          );
        case 3:
          result = _context14.sent;
          console.log('🚀 ~ file: user.model.js:222 ~ deteleFollowingId ~ result:', result);
          return _context14.abrupt("return", result);
        case 8:
          _context14.prev = 8;
          _context14.t0 = _context14["catch"](0);
          throw new Error(_context14.t0);
        case 11:
        case "end":
          return _context14.stop();
      }
    }, _callee14, null, [[0, 8]]);
  }));
  return function deteleFollowingId(_x20, _x21) {
    return _ref14.apply(this, arguments);
  };
}();
var deteleFollowerId = /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(userId, followerId) {
    var result;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          _context15.next = 3;
          return (0, _mongodb2.getDB)().collection(userCollectionName).updateOne({
            _id: (0, _mongodb.ObjectId)(userId)
          },
          // Điều kiện truy vấn để tìm bản ghi cần cập nhật
          {
            $pull: {
              followerIds: (0, _mongodb.ObjectId)(followerId)
            }
          } // Phương thức $pull để xóa phần tử có giá trị là abc khỏi mảng follower
          );
        case 3:
          result = _context15.sent;
          console.log('🚀 ~ file: user.model.js:235 ~ deteleFollowerId ~ result:', result);
          return _context15.abrupt("return", result);
        case 8:
          _context15.prev = 8;
          _context15.t0 = _context15["catch"](0);
          throw new Error(_context15.t0);
        case 11:
        case "end":
          return _context15.stop();
      }
    }, _callee15, null, [[0, 8]]);
  }));
  return function deteleFollowerId(_x22, _x23) {
    return _ref15.apply(this, arguments);
  };
}();
var UserModel = {
  userCollectionName: userCollectionName,
  createNew: createNew,
  updateOneAndGetByCase: updateOneAndGetByCase,
  updateOneAndGet: updateOneAndGet,
  findOneById: findOneById,
  findOneByEmail: findOneByEmail,
  findOneByUserName: findOneByUserName,
  resetPassword: resetPassword,
  pushFollowingIds: pushFollowingIds,
  pushFollowerIds: pushFollowerIds,
  pushNotifIds: pushNotifIds,
  findFollowerIdsInLimit: findFollowerIdsInLimit,
  getFullInfoUser: getFullInfoUser,
  deteleFollowingId: deteleFollowingId,
  deteleFollowerId: deteleFollowerId
};
exports.UserModel = UserModel;