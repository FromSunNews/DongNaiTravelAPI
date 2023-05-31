"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _map = require("../models/map.model");
var _PlacesSearchProvider = require("../providers/PlacesSearchProvider");
var _SendMessageToSlack = require("../providers/SendMessageToSlack");
var _RedisQueueProvider = require("../providers/RedisQueueProvider");
var _constants = require("../utilities/constants");
var _function = require("../utilities/function");
var _axios = _interopRequireDefault(require("axios"));
var _environtment = require("../config/environtment");
var _buffer = require("buffer");
var _lodash = require("lodash");
var _OpenRouteServiceProvider = require("../providers/OpenRouteServiceProvider");
var _CloudinaryProvider = require("../providers/CloudinaryProvider");
var _photos = require("../models/photos.model");
var _reviews = require("../models/reviews.model");
var _OpenWeatherProvider = require("../providers/OpenWeatherProvider");
var _user = require("../models/user.model");
/**
 * @typedef GetPlacesServiceProps
 * @property {number} limit
 * @property {number} skip
 * @property {string} fields
 * @property {string} filter
 */

/**
 * Service này dùng để lấy ra tất cả các places, tuy nhiên là nên dùng nó để lấy một số lượng
 * có hạn nào đó thôi.
 * @param {GetPlacesServiceProps} data Là một object lấy từ `req.query`.
 * @returns {Promise<WithId<Document>[] | undefined>}
 */
var getPlaces = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    var limit, skip, fields, places;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          limit = data.limit, skip = data.skip, fields = data.fields;
          console.log(data);
          _context.next = 5;
          return _map.MapModel.findManyInLimit({}, (0, _function.getExpectedFieldsProjection)(fields), parseInt(limit), parseInt(skip));
        case 5:
          places = _context.sent;
          return _context.abrupt("return", places);
        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", undefined);
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 9]]);
  }));
  return function getPlaces(_x) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Service này dùng để lấy ra tất cả các places, tuy nhiên là nên dùng nó để lấy một số lượng
 * có hạn nào đó thôi. Service này dùng phương thức `findManyInLimitWithPipelines`.
 * @param {GetPlacesServiceProps} data Là một object lấy từ `req.query`.
 * @returns {Promise<WithId<Document>[] | undefined>}
 */
var getPlacesWithPipeline = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(query) {
    var limit, skip, fields, filter, user, data, places;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          limit = query.limit, skip = query.skip, fields = query.fields, filter = query.filter;
          if (!query.userId) {
            _context2.next = 6;
            break;
          }
          _context2.next = 5;
          return _user.UserModel.findOneById(query.userId);
        case 5:
          user = _context2.sent;
        case 6:
          data = {
            filter: filter,
            fields: fields,
            limit: parseInt(limit),
            skip: parseInt(skip),
            user: user
          };
          _context2.next = 9;
          return _map.MapModel.findManyInLimitWithPipeline(data);
        case 9:
          places = _context2.sent;
          return _context2.abrupt("return", places);
        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", undefined);
        case 16:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 13]]);
  }));
  return function getPlacesWithPipeline(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var getPlaceDetailWithPipeline = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(query) {
    var data, user, place;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          data = {
            placeId: query.placeId,
            fields: query.fields || '',
            lang: query.lang ? query.lang : 'en'
          };
          if (!query.userId) {
            _context3.next = 6;
            break;
          }
          _context3.next = 5;
          return _user.UserModel.findOneById(query.userId);
        case 5:
          user = _context3.sent;
        case 6:
          _context3.next = 8;
          return _map.MapModel.findOneWithPipeline(data, user);
        case 8:
          place = _context3.sent;
          return _context3.abrupt("return", place);
        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", undefined);
        case 15:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 12]]);
  }));
  return function getPlaceDetailWithPipeline(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
var getPlacesTextSearch = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(data) {
    var _placesClone, startTime, _sortBy, result, places, nextPageToken, existPlace, createPlacesQueue, photosToReturn, placesClone, location, resultFilterRadius;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          console.log('🚀 ~ file: map.service.js:14 ~ getPlacesTextSearch ~ data', data);
          // data theo dạng {
          // type: string,
          // sortBy: string,
          // radius: string,
          // query: string,
          // location: {
          // latitude: number,
          // longitude: number
          // },

          // }
          _context9.prev = 1;
          startTime = Date.now();
          _sortBy = data.sortBy;
          delete data.sortBy;
          if (_sortBy === _constants.FilterConstants.sortBy.PROMINENCE) {
            // Xóa radius và thêm vào rankBy
            delete data.radius;
            data.rankby = _environtment.env.RANKBY_PROMINENCE;
          } else if (_sortBy === _constants.FilterConstants.sortBy.NEAR_BY) {
            // Xóa radius và thêm vào rankBy
            delete data.radius;
            data.rankby = _environtment.env.RANKBY_DISTANCE;
          }
          _context9.next = 8;
          return _PlacesSearchProvider.PlacesSearchProvider.getPlacesTextSearchAPI(data);
        case 8:
          result = _context9.sent;
          if (!((result === null || result === void 0 ? void 0 : result.status) === 'OK')) {
            _context9.next = 14;
            break;
          }
          nextPageToken = result.next_page_token;
          places = result.results;
          _context9.next = 15;
          break;
        case 14:
          throw new Error(_constants.MapApiStatus[result.status]);
        case 15:
          if (!(places.length === 1)) {
            _context9.next = 24;
            break;
          }
          _context9.next = 18;
          return _map.MapModel.findOneByPlaceId(places[0].place_id);
        case 18:
          existPlace = _context9.sent;
          if (existPlace) {
            _context9.next = 22;
            break;
          }
          _context9.next = 22;
          return _map.MapModel.createNew(places[0]);
        case 22:
          _context9.next = 36;
          break;
        case 24:
          if (!(places.length > 1)) {
            _context9.next = 36;
            break;
          }
          _context9.prev = 25;
          // Phuong:  Bước 1: Khởi tạo một hàng đợi để tạo nhiều places (dự kiến 20 results cho mỗi page)
          createPlacesQueue = _RedisQueueProvider.RedisQueueProvider.generateQueue('createPlacesQueue'); // Phuong:  Bước 2: Định nghĩa ra những việc cần làm trong tiến trình hàng đợi
          createPlacesQueue.process( /*#__PURE__*/function () {
            var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(job, done) {
              var placesDetails, placeIds;
              return _regenerator["default"].wrap(function _callee8$(_context8) {
                while (1) switch (_context8.prev = _context8.next) {
                  case 0:
                    try {
                      // Phuong:  job.data ở đây chính là places được truyền vào từ bước 4
                      placesDetails = [];
                      placeIds = [];
                      job.data.map(function (place) {
                        return placeIds.push(place.place_id);
                      });
                      // console.log('🚀 ~ file: map.service.js:48 ~ createPlacesQueue.process ~ placeIds', placeIds)

                      // Nó được gọi là parallel axios api
                      // https://blog.logrocket.com/using-axios-all-make-concurrent-requests/
                      // Gọi hết api place details thông qua các placeId bằng cách gọi tiến trình song song
                      _axios["default"].all(placeIds.map(function (placeId) {
                        return _axios["default"].get("https://maps.googleapis.com/maps/api/place/details/json?place_id=".concat(placeId, "&language=vi&key=").concat(_environtment.env.MAP_API_KEY));
                      })).then(function (datas) {
                        datas.map( /*#__PURE__*/function () {
                          var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(data) {
                            var _data$data;
                            var photosReference, profilePhotosReference, newPlace, existPlace, _data$data2, _data$data2$result, _data$data3, _data$data3$result, photosClone, reviewsClone;
                            return _regenerator["default"].wrap(function _callee6$(_context6) {
                              while (1) switch (_context6.prev = _context6.next) {
                                case 0:
                                  photosReference = [];
                                  profilePhotosReference = [];
                                  newPlace = data === null || data === void 0 ? void 0 : (_data$data = data.data) === null || _data$data === void 0 ? void 0 : _data$data.result; // Kiểm tra xem place_id nó có trong db hay chưa
                                  _context6.next = 5;
                                  return _map.MapModel.findOneByPlaceId(newPlace.place_id);
                                case 5:
                                  existPlace = _context6.sent;
                                  console.log('🚀 ~ file: map.service.js:96 ~ createPlacesQueue.process ~ newPlace.place_id:', newPlace.place_id);
                                  if (existPlace) {
                                    _context6.next = 24;
                                    break;
                                  }
                                  // Có thể xảy ra TH là không có photos nữa nên cần phải check kỹ
                                  // Xóa thằng photos trong newPlace
                                  photosClone = (0, _lodash.cloneDeep)(data === null || data === void 0 ? void 0 : (_data$data2 = data.data) === null || _data$data2 === void 0 ? void 0 : (_data$data2$result = _data$data2.result) === null || _data$data2$result === void 0 ? void 0 : _data$data2$result.photos);
                                  delete newPlace.photos;
                                  if (!photosClone) {
                                    _context6.next = 14;
                                    break;
                                  }
                                  photosClone.map(function (photo) {
                                    return photosReference.push({
                                      height: Math.floor(photo.height),
                                      width: Math.floor(photo.width),
                                      photo_reference: photo.photo_reference
                                    });
                                  });
                                  // console.log('🚀 ~ file: map.service.js:60 ~ createPlacesQueue.process ~ photosReference', photosReference)

                                  // https://blog.logrocket.com/using-axios-all-make-concurrent-requests/
                                  // gọi tiến trình song để lấy loạt dữ liệu của photos
                                  _context6.next = 14;
                                  return _axios["default"].all(photosReference.map(function (photoReference) {
                                    return _axios["default"].get("https://maps.googleapis.com/maps/api/place/photo?maxwidth=".concat(photoReference.width, "&maxheight=").concat(photoReference.height, "&photo_reference=").concat(photoReference.photo_reference, "&key=").concat(_environtment.env.MAP_API_KEY), {
                                      responseType: 'arraybuffer'
                                    });
                                  })).then( /*#__PURE__*/function () {
                                    var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(datas) {
                                      var photoBuffers, resPhotos, photosUrlToUpdate, photosUpdated;
                                      return _regenerator["default"].wrap(function _callee4$(_context4) {
                                        while (1) switch (_context4.prev = _context4.next) {
                                          case 0:
                                            photoBuffers = [];
                                            datas.map(function (res) {
                                              return photoBuffers.push(res.data);
                                            });
                                            console.log('số photos của place photos buffer:', photoBuffers.length);
                                            _context4.next = 5;
                                            return _CloudinaryProvider.CloudinaryProvider.streamUploadMutiple(photoBuffers, 'place_photos');
                                          case 5:
                                            resPhotos = _context4.sent;
                                            photosUrlToUpdate = [];
                                            resPhotos.map(function (res) {
                                              return photosUrlToUpdate.push(res.url);
                                            });
                                            console.log('Số photos của place photos khi đẩy lên cloudinary:', photosUrlToUpdate.length);
                                            // photosToUpdate sẽ cập nhật vào database
                                            // Không cần chờ nào xong nó tự create trong DB
                                            _context4.next = 11;
                                            return _photos.PhotosModel.createNew({
                                              place_photos_id: newPlace.place_id,
                                              photos: photosUrlToUpdate
                                            });
                                          case 11:
                                            photosUpdated = _context4.sent;
                                            //  thêm trường photoId trong newPlace
                                            newPlace.photos_id = photosUpdated.insertedId.toString();
                                          case 13:
                                          case "end":
                                            return _context4.stop();
                                        }
                                      }, _callee4);
                                    }));
                                    return function (_x8) {
                                      return _ref7.apply(this, arguments);
                                    };
                                  }())["catch"](function (err) {
                                    return console.log('Lỗi khi gọi place photos', err);
                                  });
                                case 14:
                                  // Xóa thằng reviews trong newPlace
                                  reviewsClone = (0, _lodash.cloneDeep)(data === null || data === void 0 ? void 0 : (_data$data3 = data.data) === null || _data$data3 === void 0 ? void 0 : (_data$data3$result = _data$data3.result) === null || _data$data3$result === void 0 ? void 0 : _data$data3$result.reviews);
                                  delete newPlace.reviews;
                                  if (!reviewsClone) {
                                    _context6.next = 20;
                                    break;
                                  }
                                  reviewsClone.map(function (review) {
                                    return profilePhotosReference.push(review.profile_photo_url);
                                  });
                                  // console.log('🚀 ~ file: map.service.js:60 ~ createPlacesQueue.process ~ profilePhotosReference', profilePhotosReference)

                                  // https://blog.logrocket.com/using-axios-all-make-concurrent-requests/
                                  _context6.next = 20;
                                  return _axios["default"].all(profilePhotosReference.map(function (photoReference) {
                                    return _axios["default"].get(photoReference, {
                                      responseType: 'arraybuffer'
                                    });
                                  })).then( /*#__PURE__*/function () {
                                    var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(datas) {
                                      var photoBuffers, resPhotos, photosUpdated;
                                      return _regenerator["default"].wrap(function _callee5$(_context5) {
                                        while (1) switch (_context5.prev = _context5.next) {
                                          case 0:
                                            photoBuffers = [];
                                            datas.map(function (res) {
                                              return photoBuffers.push(res.data);
                                            });
                                            console.log('số photos của place reviews buffer:', photoBuffers.length);
                                            _context5.next = 5;
                                            return _CloudinaryProvider.CloudinaryProvider.streamUploadMutiple(photoBuffers, 'place_reviews');
                                          case 5:
                                            resPhotos = _context5.sent;
                                            console.log('Số photos của place reviews khi đẩy lên cloudinary:', resPhotos.length);
                                            reviewsClone.map(function (review, index) {
                                              return review.profile_photo_url = resPhotos[index].url;
                                            });

                                            // photosToUpdate sẽ cập nhật vào database
                                            _context5.next = 10;
                                            return _reviews.ReviewsModel.createNew({
                                              place_reviews_id: newPlace.place_id,
                                              reviews: reviewsClone
                                            });
                                          case 10:
                                            photosUpdated = _context5.sent;
                                            //  thêm trường photoId trong newPlace
                                            newPlace.reviews_id = photosUpdated.insertedId.toString();
                                          case 12:
                                          case "end":
                                            return _context5.stop();
                                        }
                                      }, _callee5);
                                    }));
                                    return function (_x9) {
                                      return _ref8.apply(this, arguments);
                                    };
                                  }())["catch"](function (err) {
                                    return console.log('Lỗi ở gọi photo reviews', err);
                                  });
                                case 20:
                                  _map.MapModel.createNew(newPlace);
                                  placesDetails.push(newPlace);
                                  _context6.next = 25;
                                  break;
                                case 24:
                                  console.log('Place đã có ...');
                                case 25:
                                case "end":
                                  return _context6.stop();
                              }
                            }, _callee6);
                          }));
                          return function (_x7) {
                            return _ref6.apply(this, arguments);
                          };
                        }());
                      })["catch"](function (err) {
                        return console.log('Lỗi khi gọi place details', err);
                      });

                      // Bây giờ lưu vào database với 1 mảng obj của placesDetails
                      // Bởi vì mình đang call api 20 vòng lặp xong trong 20 vòng lặp, mỗi kết quả trả về lại call
                      // tiếp 5 api (để lấy được ảnh dạng binary xong rồi chuyển nó về base64)
                      // Vấn đề lớn nhất là khi call được 20 thằng place r, trong mỗi thằng place call api đến photo của nó nhưng nó cần thời gian để nạp photo về
                      // 20 thằng place mỗi 1 place trung bình 5 photo v nó làm công việc call api 100 lần
                      //  Vì v ở đây tui set thời gian là 10s để chạy cho 20 place và hơn 100 photo
                      // Nếu không để 10s nó sẽ chạy nhưng photo không được chuyển về base64 :(((
                      // Có cách nào hay hơn thì say me nha
                      setTimeout( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
                        return _regenerator["default"].wrap(function _callee7$(_context7) {
                          while (1) switch (_context7.prev = _context7.next) {
                            case 0:
                              if (placesDetails.length > 0) {
                                // const placeDetailsCreated = await MapModel.createManyPlaces(placesDetails)
                                done(null, "T\u1EA5t c\u1EA3 ".concat(placesDetails.length, " Place \u0111\u1EC1u \u0111\xE3 c\xF3 trong db!"));
                              } else {
                                done(null, "".concat(placesDetails.length, " Place \u0111\u1EC1u \u0111\xE3 c\xF3 trong db!"));
                              }
                            case 1:
                            case "end":
                              return _context7.stop();
                          }
                        }, _callee7);
                      })), 40000);
                      // done(null, 'Tiến trình đã xong!')
                    } catch (error) {
                      done(new Error('Error from createPlacesQueue.process'));
                    }
                  case 1:
                  case "end":
                    return _context8.stop();
                }
              }, _callee8);
            }));
            return function (_x5, _x6) {
              return _ref5.apply(this, arguments);
            };
          }());
          // Phuong: B3: Check completed hoặc failed, tùy trường hợp yêu cầu mà cần cái event này, để bắn thông báo khi job chạy xong chẳng hạn
          // Phuong: Nhiều event khác: https:// Phuong: github.com/OptimalBits/bull/blob/HEAD/REFERENCE.md#events
          createPlacesQueue.on('completed', function (job, result) {
            // Phuong  Bắn kết quả về Slack
            createPlacesQueue.close();
            console.log('Close queue');
            _SendMessageToSlack.SendMessageToSlack.sendToSlack("Job v\u1EDBi id l\xE0: ".concat(job.id, " v\xE0 t\xEAn job: *").concat(job.queue.name, "* \u0111\xE3 *xong* v\xE0 k\u1EBFt qu\u1EA3 l\xE0: ").concat(result, "> T\xE1c v\u1EE5 ho\xE0n th\xE0nh trong ").concat(Date.now() - startTime, "s"));
          });
          createPlacesQueue.on('failed', function (job, error) {
            // Phuong: Bắn lỗi về Slack hoặc Telegram ...
            createPlacesQueue.close();
            console.log('Close queue');
            _SendMessageToSlack.SendMessageToSlack.sendToSlack("Notification: Job v\u1EDBi id l\xE0 ".concat(job.id, " v\xE0 t\xEAn job l\xE0 *").concat(job.queue.name, "* \u0111\xE3 b\u1ECB *l\u1ED7i* \n\n ").concat(error));
          });

          // Phuong: Bước 4: bước quan trọng cuối cùng: Thêm vào vào đợi Redis để xử lý
          createPlacesQueue.add(places, {});
          _context9.next = 36;
          break;
        case 33:
          _context9.prev = 33;
          _context9.t0 = _context9["catch"](25);
          throw new Error("Error when call backgound job: ".concat(_context9.t0));
        case 36:
          console.log('====================================================================================================');
          console.log('Bắt đầu gọi để lấy base 64');
          photosToReturn = []; // vì các tác vụ background job được chạy sau khi data trả về cho người dùng, và dữ liệu sẽ được lấy từ places
          // nếu thằng places bị biến đổi thì thằng background job này sẽ lấy dữ liệu bị biến đổi đó đem đi xử lý
          // do mình muốn dùng dữ liệu cũ nên phải cloneDeep dữ liệu khi trả về
          placesClone = (0, _lodash.cloneDeep)(places);
          placesClone.map(function (place) {
            return place.photos && photosToReturn.push({
              height: Math.floor(place.photos[0].height / 2),
              width: Math.floor(place.photos[0].width / 2),
              photo_reference: place.photos[0].photo_reference
            });
          });
          // console.log('🚀 ~ file: map.service.js:32 ~ getPlacesTextSearch ~ photosToReturn', photosToReturn)

          // https://blog.logrocket.com/using-axios-all-make-concurrent-requests/
          _context9.next = 43;
          return _axios["default"].all(photosToReturn.map(function (photoReference) {
            return _axios["default"].get("https://maps.googleapis.com/maps/api/place/photo?maxwidth=".concat(photoReference.width, "&maxheight=").concat(photoReference.height, "&photo_reference=").concat(photoReference.photo_reference, "&key=").concat(_environtment.env.MAP_API_KEY), {
              responseType: 'arraybuffer'
            });
          })).then(function (datas) {
            var photos = [];
            datas.map(function (res) {
              var urlBase64Decode = _buffer.Buffer.from(res.data, 'binary').toString('base64');
              photos.push(urlBase64Decode);
            });
            placesClone.map(function (place) {
              if (photos.length === 0) return;
              if (place.photos) {
                place.photos = [photos[0]];
                photos.shift();
              }
            });
          })["catch"](function (err) {
            return console.log('Lỗi ở gọi api để là photos => base64', err);
          });
        case 43:
          location = {
            lat: data.location.latitude,
            lng: data.location.longitude
          };
          if (_sortBy === _constants.FilterConstants.sortBy.PROMINENCE || _sortBy === _constants.FilterConstants.sortBy.NEAR_BY) {
            resultFilterRadius = (0, _function.filterRadiusProminenceOrNearBy)(placesClone, location, parseInt(data.radius));
            placesClone = resultFilterRadius.arrPlace;
            if (resultFilterRadius.isDeleteNextPageToken) nextPageToken = null;
          } else if (_sortBy === _constants.FilterConstants.sortBy.STAR_LOW_TO_HIGH) {
            placesClone = (0, _function.sortByStarLowToHigh)(placesClone);
          } else if (_sortBy === _constants.FilterConstants.sortBy.STAR_HIGH_TO_LOW) {
            placesClone = (0, _function.sortByStarHighToLow)(placesClone);
          } else if (_sortBy === _constants.FilterConstants.sortBy.RATING_LOW_TO_HIGH) {
            placesClone = (0, _function.sortByRatingLowToHigh)(placesClone);
          } else if (_sortBy === _constants.FilterConstants.sortBy.RATING_HIGH_TO_LOW) {
            placesClone = (0, _function.sortByRatingHighToLow)(placesClone);
          }
          console.log('🚀 ~ file: map.service.js:241 ~ getPlacesTextSearch ~ placesClone:', (_placesClone = placesClone) === null || _placesClone === void 0 ? void 0 : _placesClone.length);
          console.log('🚀 ~ file: map.service.js:241 ~ getPlacesTextSearch ~ nextPageToken:', nextPageToken);
          return _context9.abrupt("return", {
            arrPlace: placesClone,
            nextPageToken: nextPageToken
          });
        case 50:
          _context9.prev = 50;
          _context9.t1 = _context9["catch"](1);
          throw new Error(_context9.t1);
        case 53:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[1, 50], [25, 33]]);
  }));
  return function getPlacesTextSearch(_x4) {
    return _ref4.apply(this, arguments);
  };
}();
var getPlaceDetails = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(data) {
    var placeTranform, placeTranformReturn, existPlace, placeIdClone, firstString, lastString, result, photosClone, photosReference, reviewsClone, profilePhotosReference, photosReturn, reviewsReturn;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          // data có dạng:
          // data = {
          //   placeId: 'XXXXXXXXXX',
          //   hàm này để kiểm tra xem trên FE có đang bấm vào Poiclick trên nền tảng android hay không
          //   androidPoiClick: true
          // }
          console.log('🚀 ~ file: map.service.js:256 ~ getPlaceDetails ~ data:', data);
          _context12.prev = 1;
          if (!(data !== null && data !== void 0 && data.androidPoiClick)) {
            _context12.next = 11;
            break;
          }
          placeIdClone = (0, _lodash.cloneDeep)(data.placeId); // Tách 4 ký tự đầu tiên
          firstString = placeIdClone.slice(0, 4); // Tách 12 ký tự cuối cùng
          lastString = placeIdClone.slice(-12);
          _context12.next = 8;
          return _map.MapModel.findOneByPlaceIdStartEnd(firstString, lastString);
        case 8:
          existPlace = _context12.sent;
          _context12.next = 14;
          break;
        case 11:
          _context12.next = 13;
          return _map.MapModel.findOneByPlaceId(data.placeId);
        case 13:
          existPlace = _context12.sent;
        case 14:
          console.log('🚀 ~ file: map.service.js:294 ~ getPlaceDetails ~ existPlace:', existPlace);
          if (!(!existPlace || existPlace.length === 0)) {
            _context12.next = 38;
            break;
          }
          _context12.next = 18;
          return _PlacesSearchProvider.PlacesSearchProvider.getPlaceDetailsAPI({
            place_id: data.placeId
          });
        case 18:
          result = _context12.sent;
          placeTranform = (0, _lodash.cloneDeep)(result.result);
          placeTranformReturn = (0, _lodash.cloneDeep)(result.result);

          // Biến đổi các photo có Db thành img64
          // Có thể xảy ra TH là không có photos nữa nên cần phải check kỹ
          photosClone = (0, _lodash.cloneDeep)(placeTranform.photos);
          delete placeTranform.photos;
          if (!photosClone) {
            _context12.next = 28;
            break;
          }
          photosReference = [];
          photosClone.map(function (photo) {
            return photosReference.push({
              height: Math.floor(photo.height),
              width: Math.floor(photo.width),
              photo_reference: photo.photo_reference
            });
          });

          // https://blog.logrocket.com/using-axios-all-make-concurrent-requests/
          _context12.next = 28;
          return _axios["default"].all(photosReference.map(function (photoReference) {
            return _axios["default"].get("https://maps.googleapis.com/maps/api/place/photo?maxwidth=".concat(photoReference.width, "&maxheight=").concat(photoReference.height, "&photo_reference=").concat(photoReference.photo_reference, "&key=").concat(_environtment.env.MAP_API_KEY), {
              responseType: 'arraybuffer'
            });
          })).then( /*#__PURE__*/function () {
            var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(datas) {
              var photoBuffers, resPhotos, photosUrlToUpdate, photosUpdated;
              return _regenerator["default"].wrap(function _callee10$(_context10) {
                while (1) switch (_context10.prev = _context10.next) {
                  case 0:
                    photoBuffers = [];
                    datas.map(function (res) {
                      return photoBuffers.push(res.data);
                    });
                    console.log('số photos của place photos buffer:', photoBuffers.length);
                    _context10.next = 5;
                    return _CloudinaryProvider.CloudinaryProvider.streamUploadMutiple(photoBuffers, 'place_photos');
                  case 5:
                    resPhotos = _context10.sent;
                    photosUrlToUpdate = [];
                    resPhotos.map(function (res) {
                      return photosUrlToUpdate.push(res.url);
                    });
                    console.log('Số photos của place photos khi đẩy lên cloudinary:', photosUrlToUpdate.length);
                    // photosToUpdate sẽ cập nhật vào database
                    // Không cần chờ nào xong nó tự create trong DB
                    _context10.next = 11;
                    return _photos.PhotosModel.createNew({
                      place_photos_id: placeTranform.place_id,
                      photos: photosUrlToUpdate
                    });
                  case 11:
                    photosUpdated = _context10.sent;
                    //  thêm trường photoId trong
                    placeTranform.photos_id = photosUpdated.insertedId.toString();
                    placeTranformReturn.photos = photosUrlToUpdate;
                  case 14:
                  case "end":
                    return _context10.stop();
                }
              }, _callee10);
            }));
            return function (_x11) {
              return _ref11.apply(this, arguments);
            };
          }())["catch"](function (err) {
            return console.log(err);
          });
        case 28:
          reviewsClone = (0, _lodash.cloneDeep)(placeTranform.reviews);
          delete placeTranform.reviews;
          if (!reviewsClone) {
            _context12.next = 35;
            break;
          }
          profilePhotosReference = [];
          reviewsClone.map(function (review) {
            return profilePhotosReference.push(review.profile_photo_url);
          });
          // https://blog.logrocket.com/using-axios-all-make-concurrent-requests/
          _context12.next = 35;
          return _axios["default"].all(profilePhotosReference.map(function (photoReference) {
            return _axios["default"].get(photoReference, {
              responseType: 'arraybuffer'
            });
          })).then( /*#__PURE__*/function () {
            var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(datas) {
              var photoBuffers, resPhotos, photosUpdated;
              return _regenerator["default"].wrap(function _callee11$(_context11) {
                while (1) switch (_context11.prev = _context11.next) {
                  case 0:
                    photoBuffers = [];
                    datas.map(function (res) {
                      return photoBuffers.push(res.data);
                    });
                    console.log('số photos của place reviews buffer:', photoBuffers.length);
                    _context11.next = 5;
                    return _CloudinaryProvider.CloudinaryProvider.streamUploadMutiple(photoBuffers, 'place_reviews');
                  case 5:
                    resPhotos = _context11.sent;
                    console.log('Số photos của place reviews khi đẩy lên cloudinary:', resPhotos.length);
                    reviewsClone.map(function (review, index) {
                      return review.profile_photo_url = resPhotos[index].url;
                    });

                    // photosToUpdate sẽ cập nhật vào database
                    _context11.next = 10;
                    return _reviews.ReviewsModel.createNew({
                      place_reviews_id: placeTranform.place_id,
                      reviews: reviewsClone
                    });
                  case 10:
                    photosUpdated = _context11.sent;
                    //  thêm trường photoId trong placeTranform
                    placeTranform.reviews_id = photosUpdated.insertedId.toString();
                    placeTranformReturn.reviews = reviewsClone;
                  case 13:
                  case "end":
                    return _context11.stop();
                }
              }, _callee11);
            }));
            return function (_x12) {
              return _ref12.apply(this, arguments);
            };
          }())["catch"](function (err) {
            return console.log(err);
          });
        case 35:
          // Phuong: oke lưu vào db thôi. Không cần đợi
          _map.MapModel.createNew(placeTranform);
          _context12.next = 49;
          break;
        case 38:
          if (!(existPlace || existPlace.length !== 0)) {
            _context12.next = 49;
            break;
          }
          console.log('Nơi này đã tồn tại!');
          if (data !== null && data !== void 0 && data.androidPoiClick) {
            placeTranformReturn = existPlace[0];
          } else {
            placeTranformReturn = existPlace;
          }
          // bây giờ trong placeTranformReturn thiếu photos với reviews nên lấy hai thằng đó về thông qua place_id
          _context12.next = 43;
          return _photos.PhotosModel.findOneByPlaceId(placeTranformReturn.place_id);
        case 43:
          photosReturn = _context12.sent;
          _context12.next = 46;
          return _reviews.ReviewsModel.findOneByPlaceId(placeTranformReturn.place_id);
        case 46:
          reviewsReturn = _context12.sent;
          // console.log('🚀 ~ file: map.service.js:398 ~ getPlaceDetails ~ reviewsReturn:', reviewsReturn)
          if (photosReturn) placeTranformReturn.photos = photosReturn.photos;
          if (reviewsReturn) placeTranformReturn.reviews = reviewsReturn.reviews;
        case 49:
          return _context12.abrupt("return", placeTranformReturn);
        case 52:
          _context12.prev = 52;
          _context12.t0 = _context12["catch"](1);
          throw new Error(_context12.t0);
        case 55:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[1, 52]]);
  }));
  return function getPlaceDetails(_x10) {
    return _ref10.apply(this, arguments);
  };
}();
var getWeatherCurrent = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(data) {
    var weatherData;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          console.log('🚀 ~ file: map.service.js:420 ~ getWeatherCurrent ~ data:', data);
          // data = {
          //   longitude: '',
          //   latitude: ''
          // }
          _context13.prev = 1;
          _context13.next = 4;
          return _OpenWeatherProvider.OpenWeatherProvider.getWeatherCurrent(data);
        case 4:
          weatherData = _context13.sent;
          return _context13.abrupt("return", weatherData);
        case 8:
          _context13.prev = 8;
          _context13.t0 = _context13["catch"](1);
          throw new Error(_context13.t0);
        case 11:
        case "end":
          return _context13.stop();
      }
    }, _callee13, null, [[1, 8]]);
  }));
  return function getWeatherCurrent(_x13) {
    return _ref13.apply(this, arguments);
  };
}();
var getWeatherForecast = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(data) {
    var promises, result, i, promise, params, _params, _params2;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          console.log('🚀 ~ file: map.service.js:420 ~ getWeatherForecast ~ data:', data);
          // data = {
          //   longitude: '',
          //   latitude: ''
          // }
          _context14.prev = 1;
          // https://blog.logrocket.com/using-axios-all-make-concurrent-requests/
          promises = [];
          result = {}; // Duyệt qua các ID và thêm vào danh sách promise
          for (i = 0; i < 3; i++) {
            promise = void 0;
            if (i === 0) {
              params = {
                lat: data.latitude,
                lon: data.longitude,
                units: 'metric',
                lang: _environtment.env.LANGUAGE_CODE_DEFAULT,
                appid: _environtment.env.OPEN_WEATHER_API_KEY
              };
              promise = _axios["default"].get("".concat(_environtment.env.OPEN_WEATHER_BASE_URL, "/data/2.5/weather"), {
                params: params
              });
            } else if (i === 1) {
              _params = {
                lat: data.latitude,
                lon: data.longitude,
                limit: 1,
                appid: _environtment.env.OPEN_WEATHER_API_KEY
              };
              promise = _axios["default"].get("".concat(_environtment.env.OPEN_WEATHER_BASE_URL, "/geo/1.0/reverse"), {
                params: _params
              });
            } else {
              _params2 = {
                lat: data.latitude,
                lon: data.longitude,
                units: 'metric',
                cnt: 40,
                // number of list (maximum 40 item ~ 5 days)
                lang: _environtment.env.LANGUAGE_CODE_DEFAULT,
                appid: _environtment.env.OPEN_WEATHER_API_KEY
              };
              promise = _axios["default"].get("".concat(_environtment.env.OPEN_WEATHER_BASE_URL, "/data/2.5/forecast"), {
                params: _params2
              });
            }
            promises.push(promise);
          }
          _context14.next = 7;
          return _axios["default"].all(promises).then(function (responses) {
            responses.map(function (res, index) {
              if (index === 0) {
                // dữ liệu weather hiện tại
                result.weatherCurrent = res.data;
              } else if (index === 1) {
                // geocoding reverse location
                result.nameGeocoding = res.data[0].name;
              } else {
                // weather forecast
                result.weatherForecast = res.data.list;
              }
            });
          })["catch"](function (err) {
            return console.log('Lỗi ở gọi api openweather', err);
          });
        case 7:
          return _context14.abrupt("return", result);
        case 10:
          _context14.prev = 10;
          _context14.t0 = _context14["catch"](1);
          throw new Error(_context14.t0);
        case 13:
        case "end":
          return _context14.stop();
      }
    }, _callee14, null, [[1, 10]]);
  }));
  return function getWeatherForecast(_x14) {
    return _ref14.apply(this, arguments);
  };
}();
var getGeocodingReverse = /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(data) {
    var weatherData;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          console.log('🚀 ~ file: map.service.js:420 ~ getGeocodingReverse ~ data:', data);
          // data = {
          //   longitude: '',
          //   latitude: ''
          // }
          _context15.prev = 1;
          _context15.next = 4;
          return _OpenWeatherProvider.OpenWeatherProvider.getGeocodingReverse(data);
        case 4:
          weatherData = _context15.sent;
          return _context15.abrupt("return", weatherData);
        case 8:
          _context15.prev = 8;
          _context15.t0 = _context15["catch"](1);
          throw new Error(_context15.t0);
        case 11:
        case "end":
          return _context15.stop();
      }
    }, _callee15, null, [[1, 8]]);
  }));
  return function getGeocodingReverse(_x15) {
    return _ref15.apply(this, arguments);
  };
}();
var MapService = {
  getPlaces: getPlaces,
  getPlacesWithPipeline: getPlacesWithPipeline,
  getPlaceDetailWithPipeline: getPlaceDetailWithPipeline,
  getPlacesTextSearch: getPlacesTextSearch,
  getPlaceDetails: getPlaceDetails,
  getWeatherCurrent: getWeatherCurrent,
  getWeatherForecast: getWeatherForecast,
  getGeocodingReverse: getGeocodingReverse
};
exports.MapService = MapService;