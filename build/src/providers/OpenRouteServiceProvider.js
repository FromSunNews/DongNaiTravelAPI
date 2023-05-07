"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OpenRouteServiceProvider = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _axios = _interopRequireDefault(require("axios"));
var _environtment = require("../config/environtment");
// Phuong: https://developers.google.com/maps/documentation/places/web-service/search-text
var getDirectionsORS = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(params) {
    var url_base, url, request;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          // Phuong: params là object
          // Phuong: url mẫu:
          // https://api.openrouteservice.org/v2/directions/
          // driving-car
          // ?api_key=5b3ce3597851110001cf6248aea23ad2f8dc49c09e332eed8d6b4010
          // &start=8.681495,49.41461
          // &end=8.687872,49.420318
          url_base = _environtment.env.DIRECTION_ORS_BASE_URL;
          url = "".concat(url_base).concat(params.profile, "?api_key=").concat(params.api_key, "&start=").concat(params.start[0], ",").concat(params.start[1], "&end=").concat(params.end[0], ",").concat(params.end[1]);
          console.log('url', url);
          _context.next = 5;
          return _axios["default"].get(url);
        case 5:
          request = _context.sent;
          return _context.abrupt("return", request.data);
        case 7:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function getDirectionsORS(_x) {
    return _ref.apply(this, arguments);
  };
}();
var OpenRouteServiceProvider = {
  getDirectionsORS: getDirectionsORS
};
exports.OpenRouteServiceProvider = OpenRouteServiceProvider;