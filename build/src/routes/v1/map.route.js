"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapRoutes = void 0;
var _express = _interopRequireDefault(require("express"));
var _map = require("../../controllers/map.controller");
var _map2 = require("../../validations/map.validation");
var router = _express["default"].Router();
router.route('/places').post(_map.MapController.getPlaces);
router.route('/places_text_search').post(_map2.MapValidation.getPlacesTextSearch, _map.MapController.getPlacesTextSearch);
router.route('/place_details').post(_map.MapController.getPlaceDetails);
router.route('/private_keys').get(_map.MapController.privateKeys);
router.route('/weather_current').post(_map.MapController.getWeatherCurrent);
router.route('/weather_forecast').post(_map.MapController.getWeatherForecast);
router.route('/geocoding_reverse').post(_map.MapController.getGeocodingReverse);
var mapRoutes = router;
exports.mapRoutes = mapRoutes;