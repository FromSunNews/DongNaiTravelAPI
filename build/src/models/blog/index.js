"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlogModel = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mongodb = require("mongodb");
var _mongodb2 = require("../../config/mongodb");
var _mongo = require("../../utilities/mongo");
var _expressions = require("./expressions");
var _blog = require("../../schemas/blog.schema");
var blogCollectionName = 'blog';
var INVALID_UPDATE_FIELDS = ['_id', 'createdAt', 'authorId'];
function BlogCollection() {
  return (0, _mongodb2.getDB)().collection(blogCollectionName);
}
var validateSchema = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _blog.blogCollectionSchema.validateAsync(data, {
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
function insertOneBlog(_x2) {
  return _insertOneBlog.apply(this, arguments);
}
function _insertOneBlog() {
  _insertOneBlog = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(data) {
    var checkedData;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return validateSchema(data);
        case 3:
          checkedData = _context2.sent;
          return _context2.abrupt("return", BlogCollection().insertOne(checkedData));
        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0.message);
          return _context2.abrupt("return", false);
        case 11:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 7]]);
  }));
  return _insertOneBlog.apply(this, arguments);
}
function findOneBlog() {
  return _findOneBlog.apply(this, arguments);
}
function _findOneBlog() {
  _findOneBlog = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _findOneBlog.apply(this, arguments);
}
function findManyBlog() {
  return _findManyBlog.apply(this, arguments);
}
function _findManyBlog() {
  _findManyBlog = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _findManyBlog.apply(this, arguments);
}
function updateOneBlog() {
  return _updateOneBlog.apply(this, arguments);
}
function _updateOneBlog() {
  _updateOneBlog = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _updateOneBlog.apply(this, arguments);
}
function deleteOneBlog() {
  return _deleteOneBlog.apply(this, arguments);
}
function _deleteOneBlog() {
  _deleteOneBlog = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _deleteOneBlog.apply(this, arguments);
}
var BlogModel = {
  insertOneBlog: insertOneBlog
};
exports.BlogModel = BlogModel;