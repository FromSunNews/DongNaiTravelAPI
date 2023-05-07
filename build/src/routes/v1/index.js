"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiV1 = void 0;
var _express = _interopRequireDefault(require("express"));
var _constants = require("../../utilities/constants");
var _user = require("./user.route");
var _map = require("./map.route");
var _direction = require("./direction.route");
var _content = require("./content.route");
var _notif = require("./notif.route");
var router = _express["default"].Router();

/**
 * GET v1/status
 */
router.get('/status', function (req, res) {
  return res.status(_constants.HttpStatusCode.OK).json({
    status: 'OK!'
  });
});

/** User APIs */
router.use('/users', _user.userRoutes);

/** Map APIs */
router.use('/map', _map.mapRoutes);

/** Direction APIs */
router.use('/direction', _direction.directionRoutes);

/** content APIs */
router.use('/content', _content.contentRoutes);

/** notif APIs */
router.use('/notif', _notif.notifRoutes);
var apiV1 = router;
exports.apiV1 = apiV1;