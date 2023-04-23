"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DirectionGoogleMapProvider = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _axios = _interopRequireDefault(require("axios"));
var _environtment = require("../config/environtment");
var _encodeurl = _interopRequireDefault(require("encodeurl"));
// Phuong: https://developers.google.com/maps/documentation/places/web-service/search-text
var getRouteDirectionAPI = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(params) {
    var urlFields, url, request;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          // Phuong: params là object
          urlFields = ['origin', 'destination', 'alternatives', 'arrival_time', 'avoid', 'departure_time', 'language', 'mode', 'region', 'traffic_model', 'transit_mode', 'transit_routing_preference', 'units', 'waypoints', 'key'];
          url = _environtment.env.DIRECTION_GCP_BASE_URL;
          urlFields.map(function (field) {
            // Phuong: url mẫu:
            // https://maps.googleapis.com/maps/api/directions/json
            // ?avoid=highways
            // &destination=Montreal
            // &mode=bicycling
            // &origin=Toronto
            // &key=YOUR_API_KEY

            // Phuong: *TH origin hoaặc destination thì phải chuyển thành string trước khi chuyền sang đây

            if (!params[field] && field === 'language') url = url + field + '=' + _environtment.env.LANGUAGE_CODE_DEFAULT + '&';
            // Phuong: chỉ nhiều hơn 1 đường đi
            if (!params[field] && field === 'alternatives') url = url + field + '=true&';
            // Phuong: Giải quyết TH nếu key
            else if (!params[field] && field === 'key') url = url + field + '=' + _environtment.env.MAP_API_KEY;else if (params[field]) url = url + field + '=' + params[field];

            // Phuong: Cuối cùng phải thêm dấu &
            if (field !== 'key' && params[field]) url = url + '&';
          });
          console.log('url', url);
          _context.next = 6;
          return _axios["default"].get(url);
        case 6:
          request = _context.sent;
          return _context.abrupt("return", request.data);
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function getRouteDirectionAPI(_x) {
    return _ref.apply(this, arguments);
  };
}();
var DirectionGoogleMapProvider = {
  getRouteDirectionAPI: getRouteDirectionAPI
};
exports.DirectionGoogleMapProvider = DirectionGoogleMapProvider;