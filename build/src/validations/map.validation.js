"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapValidation = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _constants = require("../utilities/constants");
var getPlacesTextSearch = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var condition;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          condition = _joi["default"].object({
            // 'query', 'radius', 'language', 'location', 'maxprice', 'minprice', 'opennow', 'pagetoken', 'region', 'type', 'key'
            query: _joi["default"].string().required().min(2).max(50).trim(),
            radius: _joi["default"].string().required().min(3).max(5).trim(),
            location: _joi["default"].object().required(),
            maxprice: _joi["default"].string().trim(),
            minprice: _joi["default"].string().trim(),
            opennow: _joi["default"].string().trim(),
            pagetoken: _joi["default"].string().trim(),
            type: _joi["default"].string().min(2).max(50).trim(),
            sortBy: _joi["default"].string().min(2).max(50).trim()
          });
          _context.prev = 1;
          _context.next = 4;
          return condition.validateAsync(req.body, {
            abortEarly: false
          });
        case 4:
          next();
          _context.next = 10;
          break;
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          res.status(_constants.HttpStatusCode.BAD_REQUEST).json({
            errors: new Error(_context.t0).message
          });
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 7]]);
  }));
  return function getPlacesTextSearch(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var getPlaceDetails = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var condition;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          condition = _joi["default"].object({
            placeId: _joi["default"].string().required().trim()
          });
          _context2.prev = 1;
          _context2.next = 4;
          return condition.validateAsync(req.body, {
            abortEarly: false
          });
        case 4:
          next();
          _context2.next = 10;
          break;
        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](1);
          res.status(_constants.HttpStatusCode.BAD_REQUEST).json({
            errors: new Error(_context2.t0).message
          });
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 7]]);
  }));
  return function getPlaceDetails(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

// const createNew = async (req, res, next) => {
//   const condition = Joi.object({
//     query: Joi.string().min(2).max(50).trim()
//   })
//   try {
//     await condition.validateAsync(req.body, { abortEarly: false })
//     next()
//   } catch (error) {
//     res.status(HttpStatusCode.BAD_REQUEST).json({
//       errors: new Error(error).message
//     })
//   }
// }

// const update = async (req, res, next) => {
//   const condition = Joi.object({
//     // sth
//   })
//   try {
//     await condition.validateAsync(req.body, {
//       abortEarly: false,
//       allowUnknown: true
//     })
//     next()
//   } catch (error) {
//     res.status(HttpStatusCode.BAD_REQUEST).json({
//       errors: new Error(error).message
//     })
//   }
// }

var MapValidation = {
  getPlacesTextSearch: getPlacesTextSearch,
  getPlaceDetails: getPlaceDetails
  // createNew,
  // update
};
exports.MapValidation = MapValidation;