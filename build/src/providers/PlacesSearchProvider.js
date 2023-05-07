"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlacesSearchProvider = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _axios = _interopRequireDefault(require("axios"));
var _environtment = require("../config/environtment");
var _encodeurl = _interopRequireDefault(require("encodeurl"));
// Phuong: https://developers.google.com/maps/documentation/places/web-service/search-text
var getPlacesTextSearchAPI = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(params) {
    var urlFields, url, request;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          // Phuong: params là object
          urlFields = ['query', 'radius', 'rankby', 'language', 'location', 'maxprice', 'minprice', 'opennow', 'pagetoken', 'region', 'type', 'key'];
          url = _environtment.env.PLACE_TEXT_SEARCH_BASE_URL;
          urlFields.map(function (field) {
            // Phuong: url mẫu:
            // https://maps.googleapis.com/maps/api/place/textsearch/json
            // ?location=42.3675294%2C-71.186966
            // &query=123%20main%20street
            // &radius=10000
            // &key=YOUR_API_KEY

            // Phuong: TH query hoặc location thì phải chuyển sang url encode .Vd: dấu cách => %20, @ => %2C
            if (field === 'query') {
              url = url + field + '=' + (0, _encodeurl["default"])(params[field]);
            } else if (field === 'location') {
              url = url + field + '=' + params[field].latitude + '%2C' + params[field].longitude;
            }
            // Phuong: Giải quyết TH nếu language là rổng thì sẽ cho mặc định là tiếng việt
            else if (!params[field] && field === 'language') url = url + field + '=' + _environtment.env.LANGUAGE_CODE_DEFAULT + '&';
            // Phuong: Giải quyết TH nếu key
            else if (!params[field] && field === 'key') url = url + field + '=' + _environtment.env.MAP_API_KEY;else if (params[field]) url = url + field + '=' + params[field];

            // Phuong: Cuối cùng phải thêm dấu &
            if (field !== 'key' && params[field]) url = url + '&';
          });
          console.log('url', url);
          _context.next = 6;
          return _axios["default"].get(url);
        case 6:
          request = _context.sent;
          return _context.abrupt("return", request.data);
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function getPlacesTextSearchAPI(_x) {
    return _ref.apply(this, arguments);
  };
}();

// Phuong: https://developers.google.com/maps/documentation/places/web-service/search-nearby
var getPlacesNearByAPI = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(params) {
    var urlFields, url, request;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          // Phuong: params là object
          urlFields = ['keyword', 'rankby', 'language', 'location', 'maxprice', 'minprice', 'opennow', 'pagetoken', 'type', 'key'];
          url = _environtment.env.PLACE_TEXT_SEARCH_BASE_URL;
          urlFields.map(function (field) {
            // Phuong: url mẫu:
            // https://maps.googleapis.com/maps/api/place/nearbysearch/json
            // ?keyword=cruise
            // &location=-33.8670522%2C151.1957362
            // &radius=1500
            // &type=restaurant
            // &key=YOUR_API_KEY

            // Phuong: TH query hoặc location thì phải chuyển sang url encode .Vd: dấu cách => %20, @ => %2C
            if (field === 'keyword') {
              url = url + field + '=' + (0, _encodeurl["default"])(params[field]);
            } else if (field === 'location') {
              url = url + field + '=' + params[field].latitude + '%2C' + params[field].longitude;
            }
            // Phuong: Giải quyết TH nếu language là rổng thì sẽ cho mặc định là tiếng việt
            else if (!params[field] && field === 'language') url = url + field + '=' + _environtment.env.LANGUAGE_CODE_DEFAULT + '&';
            // Phuong: Giải quyết TH nếu radius là rổng thì sẽ cho mặc định là 5km
            else if (!params[field] && field === 'rankby') url = url + field + '=' + +_environtment.env.RADIUS_DEFAULT + '&';
            // Phuong: Giải quyết TH nếu key
            else if (!params[field] && field === 'key') url = url + field + '=' + _environtment.env.MAP_API_KEY;else if (params[field]) url = url + field + '=' + params[field];

            // Phuong: Cuối cùng phải thêm dấu &
            if (field !== 'key' && params[field]) url = url + '&';
          });
          console.log('url', url);
          _context2.next = 6;
          return _axios["default"].get(url);
        case 6:
          request = _context2.sent;
          return _context2.abrupt("return", request.data);
        case 8:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getPlacesNearByAPI(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

// Phuong: https://developers.google.com/maps/documentation/places/web-service/details
var getPlaceDetailsAPI = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(params) {
    var urlFields, url, request;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          // Phuong: params là object
          urlFields = ['place_id', 'fields', 'language', 'region', 'reviews_no_translations', 'reviews_sort', 'sessiontoken', 'key'];
          url = _environtment.env.PLACE_DETAILS_BASE_URL;
          urlFields.map(function (field) {
            // Phuong: url mẫu:
            // https://maps.googleapis.com/maps/api/place/details/json
            // ?fields=name%2Crating%2Cformatted_phone_number
            // &place_id=ChIJN1t_tDeuEmsRUsoyG83frY4
            // &key=YOUR_API_KEY

            if (params[field] && field === 'fields') {
              url = url + field + '=';
              params[field].map(function (item, index) {
                // TH đây là phần tử đầu
                if (index === 0) url = url + item;else url = url + '%2C' + item;
              });
            }
            // Phuong: Giải quyết TH nếu language là rổng thì sẽ cho mặc định là tiếng việt
            else if (!params[field] && field === 'language') url = url + field + '=' + _environtment.env.LANGUAGE_CODE_DEFAULT + '&';
            // Phuong: Giải quyết TH nếu key
            else if (!params[field] && field === 'key') url = url + field + '=' + _environtment.env.MAP_API_KEY;else if (params[field]) url = url + field + '=' + params[field];

            // Phuong: Cuối cùng phải thêm dấu &
            if (field !== 'key' && params[field]) url = url + '&';
          });
          console.log('🚀 getPlaceDetailsAPI ~ url', url);
          _context3.next = 6;
          return _axios["default"].get(url);
        case 6:
          request = _context3.sent;
          return _context3.abrupt("return", request.data);
        case 8:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function getPlaceDetailsAPI(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

// Phuong: https://developers.google.com/maps/documentation/places/web-service/photos
var getPlacePhotosAPI = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(params) {
    var urlFields, url, request;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          // Phuong: params là object
          urlFields = ['photo_reference', 'maxheight', 'maxwidth', 'key'];
          url = _environtment.env.PLACE_PHOTOS_BASE_URL;
          urlFields.map(function (field) {
            // Phuong: url mẫu:
            // https://maps.googleapis.com/maps/api/place/photo
            // ?maxwidth=400
            // &photo_reference=Aap_uEA7vb0DDYVJWEaX3O-AtYp77AaswQKSGtDaimt3gt7QCNpdjp1BkdM6acJ96xTec3tsV_ZJNL_JP-lqsVxydG3nh739RE_hepOOL05tfJh2_ranjMadb3VoBYFvF0ma6S24qZ6QJUuV6sSRrhCskSBP5C1myCzsebztMfGvm7ij3gZT
            // &key=YOUR_API_KEY

            if (!params[field] && field === 'maxwidth') {
              if (!params['maxheight']) url = url + field + '=' + _environtment.env.WIDTH_PHOTO_DEFAULT + '&';
            }
            // Phuong: Giải quyết TH nếu key
            else if (!params[field] && field === 'key') url = url + field + '=' + _environtment.env.MAP_API_KEY;
            // Phuong: Các TH khác
            else if (params[field]) url = url + field + '=' + params[field];

            // Phuong: Cuối cùng phải thêm dấu &
            if (field !== 'key' && params[field]) url = url + '&';
          });
          console.log('🚀 getPlaceDetailsAPI ~ url', url);
          _context4.next = 6;
          return _axios["default"].get(url);
        case 6:
          request = _context4.sent;
          return _context4.abrupt("return", request.data);
        case 8:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function getPlacePhotosAPI(_x4) {
    return _ref4.apply(this, arguments);
  };
}();
var PlacesSearchProvider = {
  getPlacesTextSearchAPI: getPlacesTextSearchAPI,
  getPlaceDetailsAPI: getPlaceDetailsAPI,
  getPlacePhotosAPI: getPlacePhotosAPI,
  getPlacesNearByAPI: getPlacesNearByAPI
};
exports.PlacesSearchProvider = PlacesSearchProvider;