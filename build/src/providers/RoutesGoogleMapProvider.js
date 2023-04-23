"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RoutesGoogleMapProvider = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _axios = _interopRequireDefault(require("axios"));
var _environtment = require("../config/environtment");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
// https://developers.google.com/maps/documentation/routes/reference/rest/v2/TopLevel/computeRoutes?hl=vi
var getComputeRoutesGCP = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    var configAxios, body, request;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          console.log('🚀 ~ file: RoutesGoogleMapProvider.js:6 ~ getComputeRoutesGCP ~ data:', data);
          /*
            body mẫu gửi đi :
            body = {
              "origin":{
              "placeId": "ChIJT-ATCrLddDER922xDm5jhmo"
              },
              "destination":{
              "placeId": "ChIJOTlgic1SaDERw0JmWgNPVS4"
              },
              "travelMode": "DRIVE",
              "routingPreference": "TRAFFIC_AWARE_OPTIMAL",
              "polylineQuality": "HIGH_QUALITY",
              "polylineEncoding": "ENCODED_POLYLINE",
              "computeAlternativeRoutes": true,
              "routeModifiers": {
                "avoidTolls": false,
                "avoidHighways": false,
                "avoidFerries": false
              },
              "extraComputations": [
                "TOLLS",
                "FUEL_CONSUMPTION",
                "TRAFFIC_ON_POLYLINE"
              ],
              "languageCode": "vi"
            }
              header mẫu
            header = {
              "Content-Type" : "application/json",
              "X-Goog-Api-Key": "YOUR_API_KEY",
              "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"
            }
          */
          _context.prev = 1;
          configAxios = {
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': _environtment.env.MAP_API_KEY,
              'X-Goog-FieldMask': 'routes'
            }
          };
          body = {
            origin: data.origin,
            destination: data.destination,
            travelMode: data.mode,
            routingPreference: 'TRAFFIC_AWARE_OPTIMAL',
            polylineQuality: 'HIGH_QUALITY',
            polylineEncoding: 'ENCODED_POLYLINE',
            computeAlternativeRoutes: true,
            extraComputations: ['TOLLS', 'FUEL_CONSUMPTION', 'TRAFFIC_ON_POLYLINE'],
            languageCode: data.languageCode ? data.languageCode : _environtment.env.LANGUAGE_CODE_DEFAULT
          };
          if (data.routeModifiers) {
            body = _objectSpread(_objectSpread({}, body), {}, {
              routeModifiers: data.routeModifiers
            });
          }
          if (data.mode === 'WALK' || data.mode === 'BICYCLE') delete body.routingPreference;
          _context.next = 8;
          return _axios["default"].post(_environtment.env.COMPUTE_ROUTES_BASE_URL, body, configAxios);
        case 8:
          request = _context.sent;
          return _context.abrupt("return", request.data);
        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](1);
          throw new Error('Not found this route!');
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 12]]);
  }));
  return function getComputeRoutesGCP(_x) {
    return _ref.apply(this, arguments);
  };
}();
var RoutesGoogleMapProvider = {
  getComputeRoutesGCP: getComputeRoutesGCP
};
exports.RoutesGoogleMapProvider = RoutesGoogleMapProvider;