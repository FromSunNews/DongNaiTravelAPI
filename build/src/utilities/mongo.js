"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserUpdateCases = exports.SpecialtyPlaceFields = exports.SpecialtyPlaceFieldStageNames = exports.PlaceFindStages = void 0;
exports.createLookupStage = createLookupStage;
exports.createObjectIDByString = createObjectIDByString;
exports.createProjectionStage = createProjectionStage;
exports.getExpectedFieldsProjection = getExpectedFieldsProjection;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _mongodb = require("mongodb");
var _constants = require("./constants");
var _stages, _stages2, _stages3, _stages4;
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
/**
 * Hàm này nhận vào 2 tham số là `fields` và `seperator` (không bắt buộc), đều là string.
 * `fields` là một string có dạng `"field_1;field_2;...;field_n"`.
 *
 * Và hàm này sẽ trả về một object bao gồm các thuộc tính là field name được ngăn cách bởi
 * `seperator` trong `fields` với value là `true`.
 * @param fields Là một chuỗi có dạng `"field_1;field_2;...;field_n"`.
 * @param seperator Là chuỗi, ký tự ngăn cách giữa các field name.
 * @returns
 *
 * @example
 * ...
 * let fields = "name;age;address"
 * // Output:
 * // {name: true, age: true, address: true}
 * console.log(getExpectedFieldsOption(fields));
 * ...
 */
function getExpectedFieldsProjection(fields) {
  var seperator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ';';
  if (!fields) return {};
  var fieldsArr = fields.split(seperator).map(function (field) {
    return [field, true];
  });
  return Object.fromEntries(fieldsArr);
}

/**
 * Hàm này dùng để tạo ra một projection stage (`$project`).
 * @param fields Là một object chứa các trường dữ liệu cần lấy.
 * @returns
 *
 * @example
 * ...
 * let fields_1 = { name: true, age: true }
 * let fields_2 = {}
 *
 * console.log(createProjectionStage(fields_1)); // Output: { '$project': { name: true; age: true } }
 * console.log(createProjectionStage(fields_2)); // Output: {}
 * ...
 */
function createProjectionStage(fields) {
  return Object.keys(fields).length === 0 || !fields ? [] : [{
    '$project': fields
  }];
}

/**
 * Hàm này dùng để tạo ra một `ObjectId('id')` của mongoDB.
 * @param id Là phần `id` trong `ObjectId('id')`
 * @returns
 */
function createObjectIDByString(id) {
  var i = new _mongodb.ObjectId(id);
  return i;
}

/**
 * Hàm này dùng để tạo ra một lookup stage (bao gồm pipeline)
 * @param {string} from
 * @param {string} localField
 * @param {string} foreignField
 * @param {string} as
 * @param {{extras: {}, pipeline: []}} options
 * @returns
 */
function createLookupStage(from, localField, foreignField, as, options) {
  var lookupObject = {
    '$lookup': {
      'from': from
    }
  };
  if (localField) lookupObject.$lookup.localField = localField;
  if (foreignField) lookupObject.$lookup.foreignField = foreignField;
  if (options && options.extras) lookupObject.$lookup = _objectSpread(_objectSpread({}, lookupObject.$lookup), options.extras);
  if (options && options.pipeline) lookupObject.$lookup.pipeline = options.pipeline;
  lookupObject.$lookup.as = as;
  return lookupObject;
}

/**
 * Là một object chứa các $match stage cho place (dùng cho việc tìm nhiều place).
 * Với mỗi key sẽ có một expression. Mỗi một expression này sẽ là một function dùng
 * để tạo stage.
 *
 * Có 2 key chính, một là quality (trường hợp đặc biệt) và others. Others là các query
 * trường dữ liệu cụ thể, còn quality thì phải có một xíu tính toán.
 */
var PlaceFindStages = {
  // Special filter
  quality: {
    expressions: {
      'all': function all() {
        var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _constants.PlaceFindStageByQuality.all;
        return {
          '$match': filter
        };
      },
      'recommended': function recommended() {
        var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _constants.PlaceFindStageByQuality.recommended;
        return {
          '$match': filter
        };
      },
      'popular': function popular() {
        var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _constants.PlaceFindStageByQuality.popular;
        return {
          '$sort': filter
        };
      },
      'most_visit': function most_visit() {
        var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _constants.PlaceFindStageByQuality.most_visit;
        return {
          '$sort': filter
        };
      },
      'high_rating': function high_rating() {
        var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _constants.PlaceFindStageByQuality.high_rating;
        return {
          '$sort': filter
        };
      }
    }
  },
  name: {
    expressions: {
      'name': function name() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        return {
          '$match': {
            'name': {
              $regex: value,
              $options: 'i'
            }
          }
        };
      }
    }
  },
  type: {
    expressions: {
      'type': function type() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        return {
          '$match': {
            'types': {
              '$all': value.split(';')
            }
          }
        };
      }
    }
  },
  except_by_placeid: {
    expressions: {
      'except_by_placeid': function except_by_placeid(id) {
        return id ? {
          '$match': {
            place_id: {
              '$not': {
                '$eq': id
              }
            }
          }
        } : {
          '$match': {}
        };
      }
    }
  }
};

/**
 * Các trường hợp update của user sẽ chia ra làm nhiều phần.
 * - Update mặc định: là kiểu update sẽ dùng toán tử $set và sẽ có cập nhật updatedAt.
 * - Update các trường array, vì đa phần các trường array này có toán tử update riêng, và không cần phải cập nhật updatedAt
 */
exports.PlaceFindStages = PlaceFindStages;
var UserUpdateCases = {
  'default': function _default(newUserData) {
    return {
      $set: {
        newUserData: newUserData
      },
      $currentDate: {
        updatedAt: true
      }
    };
  },
  'addEle:savedPlaces': function addEleSavedPlaces(placeId) {
    return {
      $addToSet: {
        'savedPlaces': placeId
      }
    };
  },
  'removeEle:savedPlaces': function removeEleSavedPlaces(placeId) {
    return {
      $pull: {
        'savedPlaces': placeId
      }
    };
  },
  'addEle:follower': function addEleFollower(userId) {
    return {
      $addToSet: {
        'followerIds': userId
      }
    };
  },
  'removeEle:follower': function removeEleFollower(userId) {
    return {
      $pull: {
        'followerIds': userId
      }
    };
  },
  'addEle:visitedPlaces': function addEleVisitedPlaces(placeId) {
    return {
      $addToSet: {
        'visitedPlaces': placeId
      }
    };
  },
  'removeEle:visitedPlaces': function removeEleVisitedPlaces(placeId) {
    return {
      $pull: {
        'visitedPlaces': placeId
      }
    };
  }
};
exports.UserUpdateCases = UserUpdateCases;
var SpecialtyPlaceFieldStageNames = {
  addFields: 'addFields',
  lookup: 'lookup'
};
exports.SpecialtyPlaceFieldStageNames = SpecialtyPlaceFieldStageNames;
var SpecialtyPlaceFields = {
  place_photo: {
    field: 'place_photo',
    stages: (_stages = {}, (0, _defineProperty2["default"])(_stages, SpecialtyPlaceFieldStageNames.addFields, {
      $addFields: {
        '$arrayElemAt': [{
          '$arrayElemAt': ['$place_photo.photos', 0]
        }, 0]
      }
    }), (0, _defineProperty2["default"])(_stages, SpecialtyPlaceFieldStageNames.lookup, {
      $lookup: {
        from: 'photos',
        localField: 'place_id',
        foreignField: 'place_photos_id',
        as: 'place_photo'
      }
    }), _stages)
  },
  place_photos: {
    field: 'place_photos',
    stages: (_stages2 = {}, (0, _defineProperty2["default"])(_stages2, SpecialtyPlaceFieldStageNames.addFields, {
      $addFields: {
        '$arrayElemAt': ['$place_photos.photos', 0]
      }
    }), (0, _defineProperty2["default"])(_stages2, SpecialtyPlaceFieldStageNames.lookup, {
      $lookup: {
        from: 'photos',
        localField: 'place_id',
        foreignField: 'place_photos_id',
        as: 'place_photos'
      }
    }), _stages2)
  },
  reviews: {
    field: 'reviews',
    stages: (_stages3 = {}, (0, _defineProperty2["default"])(_stages3, SpecialtyPlaceFieldStageNames.addFields, {
      $addFields: {
        '$arrayElemAt': ['$reviews.reviews', 0]
      }
    }), (0, _defineProperty2["default"])(_stages3, SpecialtyPlaceFieldStageNames.lookup, {
      $lookup: {
        from: 'reviews',
        localField: 'place_id',
        foreignField: 'place_reviews_id',
        as: 'reviews'
      }
    }), _stages3)
  },
  content: {
    field: 'content',
    stages: (_stages4 = {}, (0, _defineProperty2["default"])(_stages4, SpecialtyPlaceFieldStageNames.addFields, {
      $addFields: {
        '$arrayElemAt': ['$content', 0]
      }
    }), (0, _defineProperty2["default"])(_stages4, SpecialtyPlaceFieldStageNames.lookup, {
      $lookup: {
        from: 'content',
        "let": {
          pid: '$content_id'
        },
        pipeline: [{
          $match: {
            $expr: {
              $eq: ['$_id', {
                $toObjectId: '$$pid'
              }]
            }
          }
        }, {
          $project: {
            plainTextMarkFormat: true,
            plainTextBase64: true,
            speech: true
          }
        }],
        as: 'content'
      }
    }), _stages4)
  },
  isLiked: {
    field: 'isLiked',
    stages: {}
  },
  isVisited: {
    field: 'isVisited',
    stages: {}
  }
};
exports.SpecialtyPlaceFields = SpecialtyPlaceFields;