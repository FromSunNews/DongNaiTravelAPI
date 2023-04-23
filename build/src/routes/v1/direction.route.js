"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.directionRoutes = void 0;
var _express = _interopRequireDefault(require("express"));
var _direction = require("../../controllers/direction.controller");
var _direction2 = require("../../validations/direction.validation");
var router = _express["default"].Router();
router.route('/route_direction').post(_direction.DirectionController.getRouteDirection);
router.route('/chatgpt_itinerary').post(_direction.DirectionController.getChatGptItinerary);
var directionRoutes = router;
exports.directionRoutes = directionRoutes;