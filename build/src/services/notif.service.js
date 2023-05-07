"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NotifService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _notif = require("../models/notif.model");
var _user = require("./user.service");
var _lodash = require("lodash");
var createNewNotif = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    var listUrlAvatarReturn, createdNotif, getCreatedNotif, dataBothUser, result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          // data = {
          //   userReceivedId: 'askdjioasjd',
          //   userSentId: 'dsaDSAjdisaji',
          //   "userSent" : {
          //     _id:
          //     avatar:
          //     displayName
          // },
          //   typeNofif: 'FOLLOW' || 'COMMEMT' || 'INVITE' || 'POST',
          //   desc: {
          //   en: 'She has started following your profile',
          //   vi: 'Cô ấy đã bắt đầu theo dõi trang cá nhân của bạn'
          //  },
          //  content: {
          // 'FOLLOW'
          // listUrlAvatar: ['asd', 'sad', 'asfhjasg'],
          // moreUrlAvatar: 0
          // 'COMMENT'
          // comment: 'asbfjashfklasnkflanskfnksa'
          // 'INVITE'
          // inviteStatus: 'PENDING', 'ACCEPTED', 'REJECTED'
          // 'POST'
          // urlPhotoBlog: 'asknfklasnfkl',
          // moreUrlPhotoBlog: 4,
          // contentBlog
          // }
          // }
          console.log('🚀 ~ file: notif.service.js:4 ~ createNewBoardNotif ~ data:', data);
          _context.prev = 1;
          if (!((data === null || data === void 0 ? void 0 : data.typeNofif) === 'FOLLOW')) {
            _context.next = 8;
            break;
          }
          _context.next = 5;
          return _user.UserService.getListUrlAvatar({
            userReceivedId: data.userReceivedId,
            userSentId: data.userSentId
          });
        case 5:
          listUrlAvatarReturn = _context.sent;
          console.log('🚀 ~ file: notif.service.js:35 ~ createNewNotif ~ listUrlAvatarReturn:', listUrlAvatarReturn);
          data.content = {
            listUrlAvatar: listUrlAvatarReturn.listUrlAvatar,
            moreUrlAvatar: listUrlAvatarReturn.moreUrlAvatar
          };
        case 8:
          _context.next = 10;
          return _notif.NotifModel.createNewNotif(data);
        case 10:
          createdNotif = _context.sent;
          _context.next = 13;
          return _notif.NotifModel.findOneById(createdNotif.insertedId.toString());
        case 13:
          getCreatedNotif = _context.sent;
          _context.next = 16;
          return _user.UserService.update({
            userReceivedId: data.userReceivedId,
            userSentId: data.userSentId,
            notifId: createdNotif.insertedId.toString(),
            typeNofif: data.typeNofif
          });
        case 16:
          dataBothUser = _context.sent;
          // trả về FE
          // FE nhận và emit một sự kiện đến BE => thằng user nhận được và hiện thông báo lên
          result = {
            notif: getCreatedNotif,
            userReceived: dataBothUser.updateUserFollowing,
            userSent: dataBothUser.updatedUser
          };
          console.log('🚀 ~ file: notif.service.js:31 ~ createNewBoardNotif ~ result:', result);
          return _context.abrupt("return", result);
        case 22:
          _context.prev = 22;
          _context.t0 = _context["catch"](1);
          throw new Error(_context.t0);
        case 25:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 22]]);
  }));
  return function createNewNotif(_x) {
    return _ref.apply(this, arguments);
  };
}();
var getNotifs = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(data) {
    var _getNotifs;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          console.log('🚀 ~ file: notif.service.js:72 ~ getNotifs ~ data:', data);
          _context2.prev = 1;
          _getNotifs = 'getNotifs';
          return _context2.abrupt("return", _getNotifs);
        case 6:
          _context2.prev = 6;
          _context2.t0 = _context2["catch"](1);
          throw new Error(_context2.t0);
        case 9:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 6]]);
  }));
  return function getNotifs(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var updateNotif = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(data) {
    var notifId, _getNotifs2;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          console.log('🚀 ~ file: notif.service.js:89 ~ updateNotif ~ data:', data);
          notifId = (0, _lodash.cloneDeep)(data.notifId);
          delete data.notifId;
          _context3.prev = 3;
          _getNotifs2 = _notif.NotifModel.updateNotif(notifId, data);
          return _context3.abrupt("return", _getNotifs2);
        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](3);
          throw new Error(_context3.t0);
        case 11:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[3, 8]]);
  }));
  return function updateNotif(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
var updateManyNotifs = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(data) {
    var _getNotifs3;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          console.log('🚀 ~ file: notif.service.js:72 ~ getNotifs ~ data:', data);
          _context4.prev = 1;
          _getNotifs3 = _notif.NotifModel.updateManyNotifs(data.arrayNotifs);
          return _context4.abrupt("return", _getNotifs3);
        case 6:
          _context4.prev = 6;
          _context4.t0 = _context4["catch"](1);
          throw new Error(_context4.t0);
        case 9:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[1, 6]]);
  }));
  return function updateManyNotifs(_x4) {
    return _ref4.apply(this, arguments);
  };
}();
var NotifService = {
  createNewNotif: createNewNotif,
  getNotifs: getNotifs,
  updateNotif: updateNotif,
  updateManyNotifs: updateManyNotifs
};
exports.NotifService = NotifService;