"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OpenWeatherProvider = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _environtment = require("../config/environtment");
var _axios = _interopRequireDefault(require("axios"));
// https://openweathermap.org/current#data
var getWeatherCurrent = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(coor) {
    var params, response;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          params = {
            lat: coor.latitude,
            lon: coor.longitude,
            units: 'metric',
            lang: _environtment.env.LANGUAGE_CODE_DEFAULT,
            appid: _environtment.env.OPEN_WEATHER_API_KEY
          };
          _context.next = 4;
          return _axios["default"].get("".concat(_environtment.env.OPEN_WEATHER_BASE_URL, "/data/2.5/weather"), {
            params: params
          });
        case 4:
          response = _context.sent;
          return _context.abrupt("return", response.data);
        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          throw new Error("Error in getMessage: ".concat(_context.t0.message));
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 8]]);
  }));
  return function getWeatherCurrent(_x) {
    return _ref.apply(this, arguments);
  };
}();

// https://openweathermap.org/forecast5
var getWeatherForecast = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(coor) {
    var params, response;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          params = {
            lat: coor.latitude,
            lon: coor.longitude,
            units: 'metric',
            cnt: 40,
            // number of list (maximum 40 item ~ 5 days)
            lang: _environtment.env.LANGUAGE_CODE_DEFAULT,
            appid: _environtment.env.OPEN_WEATHER_API_KEY
          };
          _context2.next = 4;
          return _axios["default"].get("".concat(_environtment.env.OPEN_WEATHER_BASE_URL, "/data/2.5/forecast"), {
            params: params
          });
        case 4:
          response = _context2.sent;
          return _context2.abrupt("return", response.data);
        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          throw new Error("Error in getMessage: ".concat(_context2.t0.message));
        case 11:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 8]]);
  }));
  return function getWeatherForecast(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

// https://openweathermap.org/api/geocoding-api#reverse
var getGeocodingReverse = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(coor) {
    var params, response;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          params = {
            lat: coor.latitude,
            lon: coor.longitude,
            limit: 1,
            appid: _environtment.env.OPEN_WEATHER_API_KEY
          };
          _context3.next = 4;
          return _axios["default"].get("".concat(_environtment.env.OPEN_WEATHER_BASE_URL, "/geo/1.0/reverse"), {
            params: params
          });
        case 4:
          response = _context3.sent;
          console.log('🚀 ~ file: OpenWeatherProvider.js:67 ~ getGeocodingReverse ~ response.data[0].name:', response.data[0].name);
          return _context3.abrupt("return", {
            name: response.data[0].name
          });
        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          throw new Error("Error in getMessage: ".concat(_context3.t0.message));
        case 12:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 9]]);
  }));
  return function getGeocodingReverse(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
var OpenWeatherProvider = {
  getWeatherCurrent: getWeatherCurrent,
  getWeatherForecast: getWeatherForecast,
  getGeocodingReverse: getGeocodingReverse
};
exports.OpenWeatherProvider = OpenWeatherProvider;