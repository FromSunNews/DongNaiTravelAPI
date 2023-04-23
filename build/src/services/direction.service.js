"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DirectionService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _direction = require("../models/direction.model");
var _PlacesSearchProvider = require("../providers/PlacesSearchProvider");
var _SendMessageToSlack = require("../providers/SendMessageToSlack");
var _RedisQueueProvider = require("../providers/RedisQueueProvider");
var _constants = require("../utilities/constants");
var _axios = _interopRequireDefault(require("axios"));
var _environtment = require("../config/environtment");
var _buffer = require("buffer");
var _lodash = require("lodash");
var _function = require("../utilities/function");
var _OpenRouteServiceProvider = require("../providers/OpenRouteServiceProvider");
var _polyline = _interopRequireDefault(require("@mapbox/polyline"));
var _GeocodingGoogleMapProvider = require("../providers/GeocodingGoogleMapProvider");
var _DirectionGoogleMapProvider = require("../providers/DirectionGoogleMapProvider");
var _ChatGptProvider = require("../providers/ChatGptProvider");
var _RoutesGoogleMapProvider = require("../providers/RoutesGoogleMapProvider");
var _LangChainProvider = require("../providers/LangChainProvider");
var getRouteDirection = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    var oriToCheck, desToCheck, _result, checkWaypointsDb, indexOfWay, drirection, body, directionTranformYet;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          // data có dạng:
          // data = {
          //   oriAddress: 'abc' || null,
          //   desAddress: 'abc' || null,
          //   oriPlaceId: sdgkl_27e921 || null,
          //   desPlaceId: sdgkl_27e921 || null,
          //   oriCoor: {
          //      longitude: 10.214290,
          //      latitude: 100.1283824
          // } || null,
          //   desCoor: {
          //      longitude: 10.214290,
          //      latitude: 100.1283824
          // } || null,
          //   modeORS: 'driving-car',
          //   modeGCP: 'driving',
          //   typeOri: 'place_id' || 'address' || 'coordinate',
          //   typeDes: 'place_id' || 'address' || 'coordinate',
          //   routeModifiers: {
          //   avoidTolls: false,
          //   avoidHighways: false,
          //   avoidFerries: false,
          //   avoidIndoor: false
          //   },
          //   languageCode: 'vi'
          // }
          console.log('🚀 ~ file: direction.service.js:256 ~ getPlaceDetails ~ data:', data);
          _context.prev = 1;
          if (!(data.typeOri === 'place_id')) {
            _context.next = 6;
            break;
          }
          oriToCheck = data.oriPlaceId;
          _context.next = 16;
          break;
        case 6:
          if (!(data.typeOri === 'address')) {
            _context.next = 12;
            break;
          }
          _context.next = 9;
          return _GeocodingGoogleMapProvider.GeocodingGoogleMapProvider.getPlaceIdFromAddress(data.oriAddress);
        case 9:
          oriToCheck = _context.sent;
          _context.next = 16;
          break;
        case 12:
          if (!(data.typeOri === 'coordinate')) {
            _context.next = 16;
            break;
          }
          _context.next = 15;
          return _GeocodingGoogleMapProvider.GeocodingGoogleMapProvider.getPlaceIdFromCoords(data.oriCoor.latitude, data.oriCoor.longitude);
        case 15:
          oriToCheck = _context.sent;
        case 16:
          if (!(data.typeDes === 'place_id')) {
            _context.next = 20;
            break;
          }
          desToCheck = data.desPlaceId;
          _context.next = 30;
          break;
        case 20:
          if (!(data.typeDes === 'address')) {
            _context.next = 26;
            break;
          }
          _context.next = 23;
          return _GeocodingGoogleMapProvider.GeocodingGoogleMapProvider.getPlaceIdFromAddress(data.desAddress);
        case 23:
          desToCheck = _context.sent;
          _context.next = 30;
          break;
        case 26:
          if (!(data.typeDes === 'coordinate')) {
            _context.next = 30;
            break;
          }
          _context.next = 29;
          return _GeocodingGoogleMapProvider.GeocodingGoogleMapProvider.getPlaceIdFromCoords(data.desCoor.latitude, data.desCoor.longitude);
        case 29:
          desToCheck = _context.sent;
        case 30:
          console.log('oriToCheck', oriToCheck);
          console.log('desToCheck', desToCheck);
          // Kiểm tra trong database xem có geocoded_waypoints có hai đứa này không
          _context.next = 34;
          return _direction.DirectionModel.findOriDesPlaceId(oriToCheck, desToCheck);
        case 34:
          checkWaypointsDb = _context.sent;
          console.log('🚀 ~ file: direction.service.js:72 ~ getRouteDirection ~ checkWaypointsDb:', checkWaypointsDb);
          indexOfWay = checkWaypointsDb.findIndex(function (way) {
            return way.transport === data.modeGCP;
          }); // nếu indexOfWay = -1 là tìm không thấy
          if (!(checkWaypointsDb.length !== 0 && indexOfWay !== -1)) {
            _context.next = 46;
            break;
          }
          console.log('Lấy trong DB');
          console.log('🚀 ~ file: direction.service.js:83 ~ getRouteDirection ~ indexOfWay:', indexOfWay);
          console.log('🚀 vaof ~ indexOfWay:');

          // Nếu có thì lấy về luôn. À quên đối với GCP còn phải encode points
          // Muốn decode thì sẽ tiếp cận từ routes(là mảng -> số đường đi từ A -> B)
          if (checkWaypointsDb[indexOfWay].callFrom === 'GCP') {
            checkWaypointsDb[indexOfWay].data.routes.map(function (route) {
              var legs = route.legs;
              if (legs) {
                legs.map(function (leg) {
                  // xử lý thằng duration và staticDuration tách s ra chuyển về number
                  leg.duration = Number(leg.duration.split('s')[0]);
                  leg.staticDuration = Number(leg.staticDuration.split('s')[0]);
                  var steps = leg.steps;
                  if (steps) {
                    steps.map(function (step) {
                      // xử lý thằng staticDuration tách s ra chuyển về number
                      step.staticDuration = Number(step.staticDuration.split('s')[0]);
                      var points = _polyline["default"].decode(step.polyline.encodedPolyline);
                      var pointsToUpdate = [];
                      points.map(function (point) {
                        return pointsToUpdate.push({
                          latitude: point[0],
                          longitude: point[1]
                        });
                      });
                      step.polyline = pointsToUpdate;
                    });
                  }
                });
              }
              // Xử lý decode polyline
              var points = _polyline["default"].decode(route.polyline.encodedPolyline);
              var pointsToUpdate = [];
              points.map(function (point) {
                return pointsToUpdate.push({
                  latitude: point[0],
                  longitude: point[1]
                });
              });
              route.polyline = pointsToUpdate;
              // xử lý thằng duration và staticDuration tách s ra chuyển về number
              route.duration = Number(route.duration.split('s')[0]);
              route.staticDuration = Number(route.staticDuration.split('s')[0]);
            });
          }
          _result = {
            data: checkWaypointsDb[indexOfWay].data,
            callFrom: checkWaypointsDb[indexOfWay].callFrom,
            oriPlaceId: oriToCheck ? oriToCheck : null,
            desPlaceId: desToCheck ? desToCheck : null
          };
          console.log('🚀 ~ file: direction.service.js:125 ~ getRouteDirection ~ result:', _result);
          _context.next = 58;
          break;
        case 46:
          // Nếu không có thì phải gọi thằng GCP direction
          console.log('Call API');
          body = {
            origin: oriToCheck ? {
              placeId: oriToCheck
            } : {
              latitude: data.oriCoor.latitude,
              longitude: data.oriCoor.longitude
            },
            destination: desToCheck ? {
              placeId: desToCheck
            } : {
              latitude: data.desCoor.latitude,
              longitude: data.desCoor.longitude
            },
            mode: data.modeGCP,
            routeModifiers: data.routeModifiers,
            languageCode: data.languageCode
          };
          if (!body.routeModifiers) {
            delete body.routeModifiers;
          }
          _context.next = 51;
          return _RoutesGoogleMapProvider.RoutesGoogleMapProvider.getComputeRoutesGCP(body);
        case 51:
          drirection = _context.sent;
          if (drirection.error) {
            _context.next = 58;
            break;
          }
          if (!(!drirection.routes || drirection.routes.length === 0)) {
            _context.next = 55;
            break;
          }
          return _context.abrupt("return", {
            error: 'This route is not supported or not found!'
          });
        case 55:
          // Biến đổi dữ liệu trả về
          directionTranformYet = (0, _lodash.cloneDeep)(drirection);
          drirection.routes.map(function (route) {
            var legs = route.legs;
            if (legs) {
              legs.map(function (leg) {
                // xử lý thằng duration và staticDuration tách s ra chuyển về number
                leg.duration = Number(leg.duration.split('s')[0]);
                leg.staticDuration = Number(leg.staticDuration.split('s')[0]);
                var steps = leg.steps;
                if (steps) {
                  steps.map(function (step) {
                    // xử lý thằng staticDuration tách s ra chuyển về number
                    step.staticDuration = Number(step.staticDuration.split('s')[0]);
                    var points = _polyline["default"].decode(step.polyline.encodedPolyline);
                    var pointsToUpdate = [];
                    points.map(function (point) {
                      return pointsToUpdate.push({
                        latitude: point[0],
                        longitude: point[1]
                      });
                    });
                    step.polyline = pointsToUpdate;
                  });
                }
              });
            }
            // Xử lý decode polyline
            var points = _polyline["default"].decode(route.polyline.encodedPolyline);
            var pointsToUpdate = [];
            points.map(function (point) {
              return pointsToUpdate.push({
                latitude: point[0],
                longitude: point[1]
              });
            });
            route.polyline = pointsToUpdate;
            // xử lý thằng duration và staticDuration tách s ra chuyển về number
            route.duration = Number(route.duration.split('s')[0]);
            route.staticDuration = Number(route.staticDuration.split('s')[0]);
          });
          _result = {
            data: drirection,
            callFrom: 'GCP',
            transport: data.modeGCP,
            oriPlaceId: oriToCheck ? oriToCheck : null,
            desPlaceId: desToCheck ? desToCheck : null
          };
        case 58:
          // dữ liẹu trả về theo dạng:
          // data: {
          //   data: kết quả tương ứng
          //   callFrom: 'ORS' || 'GCP'
          // }

          console.log('🚀 ~ file: direction.service.js:210 ~ getRouteDirection ~ result:', _result);
          return _context.abrupt("return", _result);
        case 62:
          _context.prev = 62;
          _context.t0 = _context["catch"](1);
          throw new Error(_context.t0);
        case 65:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 62]]);
  }));
  return function getRouteDirection(_x) {
    return _ref.apply(this, arguments);
  };
}();
var getChatGptItinerary = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(data) {
    var _result2;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          console.log('🚀 ~ file: direction.service.js:214 ~ getRouteDirection ~ data:', data);
          _context2.prev = 1;
          _context2.next = 4;
          return _LangChainProvider.LangChainProvider.getMessage(data.textInput);
        case 4:
          _result2 = _context2.sent;
          return _context2.abrupt("return", _result2);
        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](1);
          throw new Error(_context2.t0);
        case 11:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 8]]);
  }));
  return function getChatGptItinerary(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var DirectionService = {
  getRouteDirection: getRouteDirection,
  getChatGptItinerary: getChatGptItinerary
};
exports.DirectionService = DirectionService;