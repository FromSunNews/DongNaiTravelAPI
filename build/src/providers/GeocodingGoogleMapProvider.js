"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GeocodingGoogleMapProvider = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _axios = _interopRequireDefault(require("axios"));
var _environtment = require("../config/environtment");
var _constants = require("../utilities/constants");
// Lấy place_id dựa trên tọa độ
function getPlaceIdFromCoords(_x, _x2) {
  return _getPlaceIdFromCoords.apply(this, arguments);
} // Lấy place_id dựa trên tên địa điểm
function _getPlaceIdFromCoords() {
  _getPlaceIdFromCoords = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(latitude, longitude) {
    var _response$data, url, response;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          url = "".concat(_environtment.env.GEOCODING_BASE_URL, "latlng=").concat(latitude, ",").concat(longitude, "&key=").concat(_environtment.env.MAP_API_KEY);
          console.log('🚀 ~ file: GeocodingGoogleMapProvider.js:8 ~ getPlaceIdFromCoords ~ url:', url);
          _context.next = 5;
          return _axios["default"].get(url);
        case 5:
          response = _context.sent;
          if (!((response === null || response === void 0 ? void 0 : (_response$data = response.data) === null || _response$data === void 0 ? void 0 : _response$data.status) === 'OK')) {
            _context.next = 10;
            break;
          }
          return _context.abrupt("return", response.data.results[0].place_id);
        case 10:
          throw new Error(_constants.MapApiStatus[response.data.status.status]);
        case 11:
          _context.next = 16;
          break;
        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          throw new Error('Error axios from getPlaceIdFromCoords!');
        case 16:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 13]]);
  }));
  return _getPlaceIdFromCoords.apply(this, arguments);
}
function getPlaceIdFromAddress(_x3) {
  return _getPlaceIdFromAddress.apply(this, arguments);
}
function _getPlaceIdFromAddress() {
  _getPlaceIdFromAddress = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(address) {
    var _response$data2, url, response;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          url = "".concat(_environtment.env.GEOCODING_BASE_URL, "address=").concat(address, "&key=").concat(_environtment.env.MAP_API_KEY);
          console.log('🚀 ~ file: GeocodingGoogleMapProvider.js:18 ~ getPlaceIdFromAddress ~ url:', url);
          _context2.next = 5;
          return _axios["default"].get(url);
        case 5:
          response = _context2.sent;
          if (!((response === null || response === void 0 ? void 0 : (_response$data2 = response.data) === null || _response$data2 === void 0 ? void 0 : _response$data2.status) === 'OK')) {
            _context2.next = 10;
            break;
          }
          return _context2.abrupt("return", response.data.results[0].place_id);
        case 10:
          throw new Error(_constants.MapApiStatus[response.data.status.status]);
        case 11:
          _context2.next = 16;
          break;
        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          throw new Error('Error axios from getPlaceIdFromAddress!');
        case 16:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 13]]);
  }));
  return _getPlaceIdFromAddress.apply(this, arguments);
}
var GeocodingGoogleMapProvider = {
  getPlaceIdFromCoords: getPlaceIdFromCoords,
  getPlaceIdFromAddress: getPlaceIdFromAddress
};
exports.GeocodingGoogleMapProvider = GeocodingGoogleMapProvider;