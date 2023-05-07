"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SendMessageToSlack = void 0;
var _axios = _interopRequireDefault(require("axios"));
var _environtment = require("../config/environtment");
var sendToSlack = function sendToSlack(text) {
  _axios["default"].post(_environtment.env.SLACK_HOST, {
    'text': text
  });
};
var SendMessageToSlack = {
  sendToSlack: sendToSlack
};
exports.SendMessageToSlack = SendMessageToSlack;