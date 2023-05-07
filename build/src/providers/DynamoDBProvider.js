"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DynamoDBProvider = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _axios = _interopRequireDefault(require("axios"));
var _environtment = require("../config/environtment");
var getPlaceReviewsById = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    var request;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _axios["default"].get("".concat(_environtment.env.PLACE_REVIEWS_API), data);
        case 2:
          request = _context.sent;
          return _context.abrupt("return", request.Result.Items[0]);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function getPlaceReviewsById(_x) {
    return _ref.apply(this, arguments);
  };
}();
var createPlaceReviews = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(data) {
    var request;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _axios["default"].post("".concat(_environtment.env.PLACE_REVIEWS_API), data);
        case 2:
          request = _context2.sent;
          return _context2.abrupt("return", request.Message);
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function createPlaceReviews(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var updatePlaceReviewsById = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(data) {
    var request;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return _axios["default"].put("".concat(_environtment.env.PLACE_REVIEWS_API), data);
        case 2:
          request = _context3.sent;
          return _context3.abrupt("return", request.Message);
        case 4:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function updatePlaceReviewsById(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
var deletePlaceReviewsById = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(data) {
    var request;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return _axios["default"]["delete"]("".concat(_environtment.env.PLACE_REVIEWS_API), data);
        case 2:
          request = _context4.sent;
          return _context4.abrupt("return", request.Message);
        case 4:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function deletePlaceReviewsById(_x4) {
    return _ref4.apply(this, arguments);
  };
}();
var getPlacePhotosById = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(data) {
    var request;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return _axios["default"].get("".concat(_environtment.env.PLACE_PHOTOS_API), data);
        case 2:
          request = _context5.sent;
          return _context5.abrupt("return", request.Result.Items[0]);
        case 4:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function getPlacePhotosById(_x5) {
    return _ref5.apply(this, arguments);
  };
}();
var createPlacePhotos = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(data) {
    var request;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return _axios["default"].post("".concat(_environtment.env.PLACE_PHOTOS_API), data);
        case 2:
          request = _context6.sent;
          return _context6.abrupt("return", request.Message);
        case 4:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function createPlacePhotos(_x6) {
    return _ref6.apply(this, arguments);
  };
}();
var updatePlacePhotosById = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(data) {
    var request;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return _axios["default"].put("".concat(_environtment.env.PLACE_PHOTOS_API), data);
        case 2:
          request = _context7.sent;
          return _context7.abrupt("return", request.Message);
        case 4:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function updatePlacePhotosById(_x7) {
    return _ref7.apply(this, arguments);
  };
}();
var deletePlacePhotosById = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(data) {
    var request;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return _axios["default"]["delete"]("".concat(_environtment.env.PLACE_PHOTOS_API), data);
        case 2:
          request = _context8.sent;
          return _context8.abrupt("return", request.Message);
        case 4:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function deletePlacePhotosById(_x8) {
    return _ref8.apply(this, arguments);
  };
}();
var getPlaceTypesById = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(data) {
    var request;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return _axios["default"].get("".concat(_environtment.env.PLACE_TYPES_API), data);
        case 2:
          request = _context9.sent;
          return _context9.abrupt("return", request.Result.Items[0]);
        case 4:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return function getPlaceTypesById(_x9) {
    return _ref9.apply(this, arguments);
  };
}();
var createAllPlaceTypes = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(data) {
    var request;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return _axios["default"].post("".concat(_environtment.env.PLACE_TYPES_API), data);
        case 2:
          request = _context10.sent;
          return _context10.abrupt("return", request.Message);
        case 4:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return function createAllPlaceTypes(_x10) {
    return _ref10.apply(this, arguments);
  };
}();
var updatePlaceTypesById = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(data) {
    var request;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return _axios["default"].put("".concat(_environtment.env.PLACE_TYPES_API), data);
        case 2:
          request = _context11.sent;
          return _context11.abrupt("return", request.Message);
        case 4:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return function updatePlaceTypesById(_x11) {
    return _ref11.apply(this, arguments);
  };
}();
var deletePlaceTypesById = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(data) {
    var request;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _context12.next = 2;
          return _axios["default"]["delete"]("".concat(_environtment.env.PLACE_TYPES_API), data);
        case 2:
          request = _context12.sent;
          return _context12.abrupt("return", request.Message);
        case 4:
        case "end":
          return _context12.stop();
      }
    }, _callee12);
  }));
  return function deletePlaceTypesById(_x12) {
    return _ref12.apply(this, arguments);
  };
}();
var DynamoDBProvider = {
  getPlaceReviewsById: getPlaceReviewsById,
  createPlaceReviews: createPlaceReviews,
  updatePlaceReviewsById: updatePlaceReviewsById,
  deletePlaceReviewsById: deletePlaceReviewsById,
  getPlacePhotosById: getPlacePhotosById,
  createPlacePhotos: createPlacePhotos,
  updatePlacePhotosById: updatePlacePhotosById,
  deletePlacePhotosById: deletePlacePhotosById,
  getPlaceTypesById: getPlaceTypesById,
  createAllPlaceTypes: createAllPlaceTypes,
  updatePlaceTypesById: updatePlaceTypesById,
  deletePlaceTypesById: deletePlaceTypesById
};
exports.DynamoDBProvider = DynamoDBProvider;