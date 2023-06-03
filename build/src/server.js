"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _express = _interopRequireDefault(require("express"));
var _mongodb = require("./config/mongodb");
var _environtment = require("./config/environtment");
var _v = require("./routes/v1");
var _cors = _interopRequireDefault(require("cors"));
var _socket = _interopRequireDefault(require("socket.io"));
var _http = _interopRequireDefault(require("http"));
var _directionSocket = require("./sockets/directionSocket");
var _itinerarySocket = require("./sockets/itinerarySocket");
var _notifSocket = require("./sockets/notifSocket");
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _v2 = require("./routes/v2");
var _cors2 = require("./config/cors");
(0, _mongodb.connectDB)().then(function () {
  return console.log('Connected successfully to database server!');
}).then(function () {
  return bootServer();
})["catch"](function (error) {
  console.error(error);
  process.exit(1);
});
var bootServer = function bootServer() {
  // Phuong: sử dụng express
  var app = (0, _express["default"])();

  // Phuong: Fix cái vụ Cache from disk của ExpressJS
  // đối với client là Mobile thì không cấu hình này cũng đc
  app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-store');
    next();
  });
  app.use((0, _cookieParser["default"])());

  // Phuong: sử dụng cors cho web thôi còn mobile không có cũng đc
  // app.use(cors(corsOptions))

  // Enable req.body data
  // Xử lý lỗi PayloadTooLargeError: request entity too large
  app.use(_express["default"].json({
    limit: '50mb'
  }));
  app.use(_express["default"].urlencoded({
    limit: '50mb'
  }));

  // Phuong: cấu hình cho api cho client app user
  app.use('/v1', _v.apiV1);
  // Phuong: cấu hình cho api cho client app admin
  app.use('/v2', (0, _cors["default"])(_cors2.corsOptions), _v2.apiV2);

  // for real-time
  var socketIdMap = {};
  var server = _http["default"].createServer(app);
  var io = (0, _socket["default"])(server);
  io.on('connection', function (socket) {
    socket.join(socket.id);
    // lắng nghe sự kiện khi vào trang home của tài khoản
    // accoundId là _id của user đối với người đã đăng nhập
    //, còn đói với người mà chưa đăng nhập thì sẽ tạo id ngẫu nhiên để nhận biết
    socket.on('c_user_login', function (accountId) {
      console.log('Client Connected', accountId);

      // lưu socket ID của tài khoản đăng nhập vào biến socketIdMap
      socketIdMap[accountId] = socket.id;
    });

    // hàm xử lý thay đổi vị trí
    (0, _directionSocket.trackingUserLocationCurrent)(io, socket, socketIdMap);

    // Hàm xử lý tạo lịch trình cho user
    (0, _itinerarySocket.createTravelItinerary)(io, socket, socketIdMap);

    // Hàm xử lý nhận thông báo cho user
    (0, _notifSocket.getNotifToUser)(io, socket, socketIdMap);
    socket.on('disconnect', function () {
      console.log('🚀 ~ file: server.js:59 ~ socket.on ~ socketIdMap:', socketIdMap);
      console.log('Client disconnected: ', socket.id);
    });
  });
  server.listen(process.env.PORT || _environtment.env.APP_PORT, function () {
    console.log("Hello I'm DongNaiTravelAPI, I'm running at port: ".concat(process.env.PORT || _environtment.env.APP_PORT, "/"));
  });
};