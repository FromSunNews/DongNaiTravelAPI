"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _express = require("express");
var _constants = require("../utilities/constants");
var _map = require("../services/map.service");
var _environtment = require("../config/environtment");
/**
 * @param {Request} req Object chứa headers và body của HTTPRequest.
 * @param {Response} res Object chứa headers và payload của HTTPResponse.
 * @returns
 */
var getPlaces = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _map.MapService.getPlaces(req.query);
        case 3:
          result = _context.sent;
          return _context.abrupt("return", res.status(_constants.HttpStatusCode.OK).json(result));
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: _context.t0.message
          }));
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 7]]);
  }));
  return function getPlaces(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var getPlacesTextSearch = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return _map.MapService.getPlacesTextSearch(req.body);
        case 3:
          result = _context2.sent;
          console.log('🚀 ~ file: map.controller.js:8 ~ getPlacesTextSearch ~ result:', result);
          res.status(_constants.HttpStatusCode.OK).json(result);
          _context2.next = 11;
          break;
        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: _context2.t0.message
          });
        case 11:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 8]]);
  }));
  return function getPlacesTextSearch(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var privateKeys = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          try {
            res.status(_constants.HttpStatusCode.OK).json({
              map_api_key: _environtment.env.MAP_API_KEY,
              ors_api_key: [_environtment.env.ORS_API_KEY1]
            });
          } catch (error) {
            res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
              errors: error.message
            });
          }
        case 1:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function privateKeys(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var getPlaceDetails = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return _map.MapService.getPlaceDetails(req.body);
        case 3:
          result = _context4.sent;
          console.log('====================================================================================================================================\n', result.place_id);
          res.status(_constants.HttpStatusCode.OK).json(result);
          _context4.next = 11;
          break;
        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: _context4.t0.message
          });
        case 11:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 8]]);
  }));
  return function getPlaceDetails(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var getWeatherCurrent = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return _map.MapService.getWeatherCurrent(req.body);
        case 3:
          result = _context5.sent;
          res.status(_constants.HttpStatusCode.OK).json(result);
          _context5.next = 10;
          break;
        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: _context5.t0.message
          });
        case 10:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 7]]);
  }));
  return function getWeatherCurrent(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
var getWeatherForecast = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return _map.MapService.getWeatherForecast(req.body);
        case 3:
          result = _context6.sent;
          res.status(_constants.HttpStatusCode.OK).json(result);
          _context6.next = 10;
          break;
        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: _context6.t0.message
          });
        case 10:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 7]]);
  }));
  return function getWeatherForecast(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
var getGeocodingReverse = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var result;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return _map.MapService.getGeocodingReverse(req.body);
        case 3:
          result = _context7.sent;
          res.status(_constants.HttpStatusCode.OK).json(result);
          _context7.next = 10;
          break;
        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: _context7.t0.message
          });
        case 10:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 7]]);
  }));
  return function getGeocodingReverse(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();
// const createNew = async (req, res) => {
//   try {
//     const result = await MapService.createNew(req.body)
//     res.status(HttpStatusCode.OK).json(result)
//   } catch (error) {
//     res.status(HttpStatusCode.INTERNAL_SERVER).json({
//       errors: error.message
//     })
//   }
// }

// const update = async (req, res) => {
//   try {
//     const mapId = req.jwtDecoded._id
//     const mapAvatarFile = req.file
//     const result = await MapService.update(mapId, req.body, mapAvatarFile)

//     res.status(HttpStatusCode.OK).json(result)
//   } catch (error) {
//     res.status(HttpStatusCode.INTERNAL_SERVER).json({
//       errors: error.message
//     })
//   }
// }

var MapController = {
  getPlaces: getPlaces,
  getPlacesTextSearch: getPlacesTextSearch,
  privateKeys: privateKeys,
  getPlaceDetails: getPlaceDetails,
  getWeatherCurrent: getWeatherCurrent,
  getWeatherForecast: getWeatherForecast,
  getGeocodingReverse: getGeocodingReverse
  // createNew,
  // update,
};
exports.MapController = MapController;