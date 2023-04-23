"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trackingUserLocationCurrent = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _geolib = require("geolib");
var _OpenRouteServiceProvider = require("../providers/OpenRouteServiceProvider");
var _environtment = require("../config/environtment");
var trackingUserLocationCurrent = function trackingUserLocationCurrent(io, socket, socketIdMap) {
  socket.on('c_tracking_user_location_current', /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
      var _data$location, latitude, longitude, coorNearest, coorArrDirection, isCallNewApi, indexCoorNearest;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            // data có dạng:
            // data = {
            //   currentUserId: xxxxxxxxx,
            //   location: {
            //     longitude: xxxxxxxxxxxxx,
            //     latitude: xxxxxxxxxxxxx
            //   },
            //   destination: {
            //     longitude: xxxxxxxxxxxxx,
            //     latitude: xxxxxxxxxxxxx
            //   },
            //   coorArrDirection: [
            //     xxxxxxxxx
            //   ],
            //  profile: 'driving'
            // }
            // Xử lý data
            _data$location = data.location, latitude = _data$location.latitude, longitude = _data$location.longitude;
            coorNearest = (0, _geolib.findNearest)({
              latitude: latitude,
              longitude: longitude
            }, data.coorArrDirection);
            console.log('current coorArrDirection:', data.coorArrDirection.length);
            console.log('distance getDistance(data.location, coorNearest)', (0, _geolib.getDistance)(data.location, coorNearest));
            if (!((0, _geolib.getDistance)(data.location, coorNearest) <= 50)) {
              _context.next = 12;
              break;
            }
            // Nếu duowis 50m thì bỏ mấy ông nội đi qua xong r
            indexCoorNearest = data.coorArrDirection.findIndex(function (i) {
              return i.latitude === coorNearest.latitude && i.longitude === coorNearest.longitude;
            });
            console.log('🚀 ~ file: directionSocket.js:21 ~ socket.on ~ index:', indexCoorNearest);
            coorArrDirection = data.coorArrDirection.slice(indexCoorNearest);
            isCallNewApi = false;
            console.log('after coorArrDirection:', coorArrDirection.length);
            _context.next = 17;
            break;
          case 12:
            // Nếu trên 50m thì gọi luôn api chứ tính mẹ gì nữa
            console.log('Call new api:');
            _context.next = 15;
            return _OpenRouteServiceProvider.OpenRouteServiceProvider.getDirectionsORS({
              start: [data.location.longitude, data.location.latitude],
              end: [data.destination.longitude, data.destination.latitude],
              profile: data.profile,
              api_key: _environtment.env.ORS_API_KEY1
            });
          case 15:
            coorArrDirection = _context.sent;
            isCallNewApi = true;
          case 17:
            // socket.broadcast.emit:
            // Emit ngược lại một sự kiện có tên là "s_user_invited_to_board" về cho mọi client khác
            // (ngoại trừ chính thằng user gửi lên)

            // socket.emit
            // Emit với tất cả máy khách luôn cả thằng mới gửi
            // socket.emit('s_tracking_user_location_current', data)

            console.log('socketIdMap[data.currentUserId]: ', socketIdMap);
            io.to(socketIdMap[data.currentUserId]).emit('s_tracking_user_location_current', {
              isCallNewApi: isCallNewApi,
              coorArrDirection: coorArrDirection
            });
          case 19:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
};
exports.trackingUserLocationCurrent = trackingUserLocationCurrent;