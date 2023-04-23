"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PASSWORD_RULE = exports.EMAIL_RULE = void 0;
var EMAIL_RULE = /^\S+@\S+\.\S+$/;
exports.EMAIL_RULE = EMAIL_RULE;
var PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/;
exports.PASSWORD_RULE = PASSWORD_RULE;