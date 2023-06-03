"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UploadMiddleware = void 0;
var _multer = _interopRequireDefault(require("multer"));
// https://www.npmjs.com/package/multer

var LIMIT_COMMON_FILE_SIZE = 10485760; // byte = 10 MB
var ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];

// kiem tra file nao duco chap nhan 
var fileFilter = function fileFilter(req, file, callback) {
  // console.log('upload middleware',file)
  // ben FE mimetype la type
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    var errMessage = 'File type is invalid!';
    return callback(errMessage, null);
  }
  return callback(null, true); // 2 tham so la err , susscess
};

var upload = (0, _multer["default"])({
  limits: {
    fileSize: LIMIT_COMMON_FILE_SIZE
  },
  fileFilter: fileFilter
});
var UploadMiddleware = {
  upload: upload
};
exports.UploadMiddleware = UploadMiddleware;