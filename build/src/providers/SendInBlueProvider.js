"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SendInBlueProvider = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _sibApiV3Sdk = _interopRequireDefault(require("sib-api-v3-sdk"));
var _environtment = require("../config/environtment");
// Guide:
// https://levelup.gitconnected.com/how-to-send-emails-from-node-js-with-sendinblue-c4caacb68f31

var defaultClient = _sibApiV3Sdk["default"].ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = _environtment.env.SENDINBLUE_API_KEY;
var tranEmailApi = new _sibApiV3Sdk["default"].TransactionalEmailsApi();
// const adminSender = {
//  email: 'ptu2747@gmail.com',
//  name: 'FromSunNews'
// }

var adminSender = {
  email: 'dongnaitravelapp@gmail.com',
  // Email tai khoan tao tren sendinblue
  name: 'DongNaiTravelApp'
};
var sendEmail = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(toEmail, subject, htmlContent) {
    var receivers, mailOptions;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          receivers = [{
            email: toEmail
          }];
          mailOptions = {
            sender: adminSender,
            to: receivers,
            subject: subject,
            htmlContent: htmlContent
          };
          return _context.abrupt("return", tranEmailApi.sendTransacEmail(mailOptions));
        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          throw new Error(_context.t0);
        case 9:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 6]]);
  }));
  return function sendEmail(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var SendInBlueProvider = {
  sendEmail: sendEmail
};
exports.SendInBlueProvider = SendInBlueProvider;