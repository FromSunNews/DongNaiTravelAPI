"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapCollectionSchema = void 0;
var _joi = _interopRequireDefault(require("joi"));
var mapCollectionSchema = _joi["default"].object({
  place_id: _joi["default"].string().required(),
  // get _id in photos collection
  photos_id: _joi["default"].string()["default"](null),
  // get _id in reviews collection
  reviews_id: _joi["default"].string()["default"](null),
  // get _id in reviews collection
  content_id: _joi["default"].string()["default"](null),
  isRecommended: _joi["default"]["boolean"]()["default"](false),
  numberOfVisited: _joi["default"].number()["default"](0),
  reference: _joi["default"].string()["default"](null),
  plus_code: _joi["default"].object()["default"](null),
  business_status: _joi["default"].string()["default"](null),
  current_opening_hours: _joi["default"].object()["default"](null),
  opening_hours: _joi["default"].object()["default"](null),
  // address name
  formatted_address: _joi["default"].string()["default"](null),
  name: _joi["default"].string()["default"](null),
  address_components: _joi["default"].array()["default"](null),
  adr_address: _joi["default"].string()["default"](null),
  // number phone
  formatted_phone_number: _joi["default"].string()["default"](null),
  international_phone_number: _joi["default"].string()["default"](null),
  geometry: _joi["default"].object()["default"](null),
  // icons
  icon: _joi["default"].string()["default"](null),
  icon_background_color: _joi["default"].string()["default"](null),
  icon_mask_base_uri: _joi["default"].string()["default"](null),
  // photos:
  // photos: Joi.array().default(null),

  rating: _joi["default"].number()["default"](null),
  user_ratings_total: _joi["default"].number()["default"](null),
  // reviews: Joi.array().default(null),
  editorial_summary: _joi["default"].object()["default"](null),
  types: _joi["default"].array()["default"](null),
  url: _joi["default"].string()["default"](null),
  utc_offset: _joi["default"].number()["default"](null),
  vicinity: _joi["default"].string()["default"](null),
  website: _joi["default"].string()["default"](null),
  wheelchair_accessible_entrance: _joi["default"]["boolean"]()["default"](null),
  permanently_closed: _joi["default"]["boolean"]()["default"](null),
  curbside_pickup: _joi["default"]["boolean"]()["default"](null),
  delivery: _joi["default"]["boolean"]()["default"](null),
  dine_in: _joi["default"]["boolean"]()["default"](null),
  price_level: _joi["default"].number()["default"](null),
  reservable: _joi["default"]["boolean"]()["default"](null),
  scope: _joi["default"].string()["default"](null),
  secondary_opening_hours: _joi["default"].array()["default"](null),
  serves_beer: _joi["default"]["boolean"]()["default"](null),
  serves_breakfast: _joi["default"]["boolean"]()["default"](null),
  serves_brunch: _joi["default"]["boolean"]()["default"](null),
  serves_dinner: _joi["default"]["boolean"]()["default"](null),
  serves_lunch: _joi["default"]["boolean"]()["default"](null),
  serves_vegetarian_food: _joi["default"]["boolean"]()["default"](null),
  serves_wine: _joi["default"]["boolean"]()["default"](null),
  takeout: _joi["default"]["boolean"]()["default"](null),
  createdAt: _joi["default"].date().timestamp('javascript')["default"](Date.now),
  updatedAt: _joi["default"].date().timestamp()["default"](null)
});
exports.mapCollectionSchema = mapCollectionSchema;