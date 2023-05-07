"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RedisQueueProvider = void 0;
var _bull = _interopRequireDefault(require("bull"));
var _environtment = require("../config/environtment");
// Sử dụng thư viện bull Khởi tạo một hàng đợi - queue
// với quequeName do chúng ta tự định nghĩa
// Và công việc sẽ được đẩy lên Redis cloud để xử lý

var generateQueue = function generateQueue(queueName) {
  try {
    return new _bull["default"](queueName, {
      redis: {
        host: _environtment.env.REDIS_HOST,
        port: _environtment.env.REDIS_PORT,
        username: _environtment.env.REDIS_USERNAME,
        password: _environtment.env.REDIS_PASSWORD
      }
    });
  } catch (error) {
    console.log('Error from RedisQueueProvider: ', error);
    throw new Error(error);
  }
};
var RedisQueueProvider = {
  generateQueue: generateQueue
};
exports.RedisQueueProvider = RedisQueueProvider;