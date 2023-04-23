"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CloudinaryProvider = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _cloudinary = _interopRequireDefault(require("cloudinary"));
var _streamifier = _interopRequireDefault(require("streamifier"));
var _environtment = require("../config/environtment");
/**
 * Tài liệu tham khảo:
 * https://cloudinary.com/blog/node_js_file_upload_to_a_local_server_or_to_the_cloud
 * https://andela.com/insights/how-to-use-cloudinary-and-nodejs-to-upload-multiple-images/
 */

// https://www.npmjs.com/package/cloudinary

var cloudinaryV2 = _cloudinary["default"].v2;
cloudinaryV2.config({
  cloud_name: _environtment.env.CLOUDINARY_CLOUD_NAME,
  api_key: _environtment.env.CLOUDINARY_API_KEY,
  api_secret: _environtment.env.CLOUDINARY_API_SECRET
});
var streamUpload = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(fileBuffer, folderName) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", new Promise(function (resolve, reject) {
            var stream = cloudinaryV2.uploader.upload_stream({
              folder: folderName
            }, function (err, result) {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
            _streamifier["default"].createReadStream(fileBuffer).pipe(stream);
          }));
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function streamUpload(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var streamUploadMutiple = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(fileBuffers, folderName) {
    var uploadPromises, results;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          uploadPromises = fileBuffers.map(function (fileBuffer) {
            return new Promise(function (resolve, reject) {
              var stream = cloudinaryV2.uploader.upload_stream({
                folder: folderName
              }, function (err, result) {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              });
              _streamifier["default"].createReadStream(fileBuffer).pipe(stream);
            });
          }); // Đây là tiến trinh song song => giảm được thời gian chờ
          _context2.next = 3;
          return Promise.all(uploadPromises);
        case 3:
          results = _context2.sent;
          if (!results) {
            _context2.next = 8;
            break;
          }
          return _context2.abrupt("return", results);
        case 8:
          return _context2.abrupt("return");
        case 9:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function streamUploadMutiple(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var CloudinaryProvider = {
  streamUpload: streamUpload,
  streamUploadMutiple: streamUploadMutiple
};
exports.CloudinaryProvider = CloudinaryProvider;