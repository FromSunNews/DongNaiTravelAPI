"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiV2 = void 0;
var _express = _interopRequireDefault(require("express"));
var _constants = require("../../utilities/constants");
var _user = require("./user.route");
var router = _express["default"].Router();

/**
 * GET v2/status
 */
router.get('/status', function (req, res) {
  return res.status(_constants.HttpStatusCode.OK).json({
    status: 'OK!'
  });
});

/** User APIs */
router.use('/users', _user.userRoutes);
var apiV2 = router;
exports.apiV2 = apiV2;