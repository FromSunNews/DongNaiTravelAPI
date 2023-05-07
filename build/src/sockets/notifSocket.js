"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNotifToUser = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var getNotifToUser = function getNotifToUser(io, socket, socketIdMap) {
  socket.on('c_notification_to_user', /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            //   "notif": {
            //     "_id": "643eca95e29035a4940f0b6a",
            //     "userReceivedId": "643e346dc7320343a784522b",
            //     "userSentId": "643e33f0c7320343a784522a",
            //     "typeNofif": "FOLLOW",
            //     "desc": {
            //         "en": "She has started following your profile",
            //         "vi": "Cô ấy đã bắt đầu theo dõi trang cá nhân của bạn"
            //     },
            //     "content": {
            //         "listUrlAvatar": [
            //             "http://res.cloudinary.com/dbtb0sjby/image/upload/v1681798300/users/bj50oclvtigrkd4molkd.jpg",
            //             "http://res.cloudinary.com/dbtb0sjby/image/upload/v1681798300/users/bj50oclvtigrkd4molkd.jpg",
            //             "http://res.cloudinary.com/dbtb0sjby/image/upload/v1681798300/users/bj50oclvtigrkd4molkd.jpg",
            //             "http://res.cloudinary.com/dbtb0sjby/image/upload/v1681798300/users/bj50oclvtigrkd4molkd.jpg",
            //             "http://res.cloudinary.com/dbtb0sjby/image/upload/v1681798300/users/bj50oclvtigrkd4molkd.jpg"
            //         ],
            //         "moreUrlAvatar": 2
            //     },
            //     "_destroy": false,
            //     "_isVisited": false,
            //     "createdAt": 1681836693885,
            //     "updatedAt": null
            // }
            // Xử lý data

            // socket.broadcast.emit:
            // Emit ngược lại một sự kiện có tên là "s_user_invited_to_board" về cho mọi client khác
            // (ngoại trừ chính thằng user gửi lên)

            // socket.emit
            // Emit với tất cả máy khách luôn cả thằng mới gửi
            // socket.emit('s_tracking_user_location_current', data)

            // Thằng này gửi cho một thằng cụ thể nào đó
            console.log('socketIdMap[data.currentUserId]: ', socketIdMap);
            io.to(socketIdMap[data.notif.userReceivedId]).emit('s_notification_to_user', data);
          case 2:
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
exports.getNotifToUser = getNotifToUser;