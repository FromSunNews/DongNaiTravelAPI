"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortByStarLowToHigh = exports.sortByStarHighToLow = exports.sortByRatingLowToHigh = exports.sortByRatingHighToLow = exports.haverSineDistanceFormula = exports.getExpectedFieldsProjection = exports.filterRadiusProminenceOrNearBy = void 0;
var _haversineDistance = _interopRequireDefault(require("haversine-distance"));
var _lodash = require("lodash");
var _constants = require("./constants");
var haverSineDistanceFormula = function haverSineDistanceFormula(coor1, coor2) {
  return (0, _haversineDistance["default"])(coor1, coor2);
};
exports.haverSineDistanceFormula = haverSineDistanceFormula;
var filterRadiusProminenceOrNearBy = function filterRadiusProminenceOrNearBy(arrPlaceTextSearch, location, radius) {
  // location = {
  //   lat: Number,
  //   lng: Number,
  // }
  var arrPlace = (0, _lodash.cloneDeep)(arrPlaceTextSearch);
  var i = 0;
  arrPlaceTextSearch.map(function (place, index) {
    if (haverSineDistanceFormula(place.geometry.location, location) > radius) {
      i++;
      arrPlace.splice(index, 1);
    }
  });
  return {
    isDeleteNextPageToken: i !== 0 ? true : false,
    arrPlace: arrPlace
  };
};
exports.filterRadiusProminenceOrNearBy = filterRadiusProminenceOrNearBy;
var sortByStarHighToLow = function sortByStarHighToLow(arrPlaceTextSearch) {
  arrPlaceTextSearch.sort(function (a, b) {
    return b.rating - a.rating;
  });
  return arrPlaceTextSearch;
};
exports.sortByStarHighToLow = sortByStarHighToLow;
var sortByStarLowToHigh = function sortByStarLowToHigh(arrPlaceTextSearch) {
  arrPlaceTextSearch.sort(function (a, b) {
    return a.rating - b.rating;
  });
  return arrPlaceTextSearch;
};
exports.sortByStarLowToHigh = sortByStarLowToHigh;
var sortByRatingLowToHigh = function sortByRatingLowToHigh(arrPlaceTextSearch) {
  arrPlaceTextSearch.sort(function (a, b) {
    return a.user_ratings_total - b.user_ratings_total;
  });
  return arrPlaceTextSearch;
};
exports.sortByRatingLowToHigh = sortByRatingLowToHigh;
var sortByRatingHighToLow = function sortByRatingHighToLow(arrPlaceTextSearch) {
  arrPlaceTextSearch.sort(function (a, b) {
    return b.user_ratings_total - a.user_ratings_total;
  });
  return arrPlaceTextSearch;
};

/**
 * Hàm này nhận vào 2 tham số là `fields` và `seperator` (không bắt buộc), đều là string.
 * `fields` là một string có dạng `"field_1;field_2;...;field_n"`.
 *
 * Và hàm này sẽ trả về một object bao gồm các thuộc tính là field name được ngăn cách bởi
 * `seperator` trong `fields` với value là `true`.
 * @param {string} fields Là một chuỗi có dạng `"field_1;field_2;...;field_n"`.
 * @param {string} seperator Là chuỗi, ký tự ngăn cách giữa các field name.
 * @returns {{[key: string]: true}}
 *
 * @example
 * ...
 * let fields = "name;age;address"
 * // Output:
 * // {name: true, age: true, address: true}
 * console.log(getExpectedFieldsOption(fields));
 * ...
 */
exports.sortByRatingHighToLow = sortByRatingHighToLow;
var getExpectedFieldsProjection = function getExpectedFieldsProjection(fields) {
  if (!fields) return {};
  var fieldsArr = fields.split(_constants.QueryValueSeperator).map(function (field) {
    return [field, true];
  });
  return Object.fromEntries(fieldsArr);
};
exports.getExpectedFieldsProjection = getExpectedFieldsProjection;