"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlogQualityNames = exports.BlogFindStages = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _mongodb = require("mongodb");
var _blog = require("../../schemas/blog.schema");
var _BlogFindStageByQuali, _expressions;
/**
 * @typedef BlogQualityNamesProp
 * @property {"all"} all
 * @property {"most_favorites"} most_favorites
 * @property {"most_comments"} most_comments
 */

/**
 * Tên của các blog qualities
 * @type {BlogQualityNamesProp}
 */
var BlogQualityNames = {
  all: 'all',
  most_favorites: 'most_favorites',
  most_comments: 'most_comments'
};
exports.BlogQualityNames = BlogQualityNames;
var BlogFindStageByQuality = (_BlogFindStageByQuali = {}, (0, _defineProperty2["default"])(_BlogFindStageByQuali, BlogQualityNames.all, {}), (0, _defineProperty2["default"])(_BlogFindStageByQuali, BlogQualityNames.most_favorites, (0, _defineProperty2["default"])({}, _blog.blogFields.userFavoritesTotal, -1)), (0, _defineProperty2["default"])(_BlogFindStageByQuali, BlogQualityNames.most_comments, (0, _defineProperty2["default"])({}, _blog.blogFields.userCommentsTotal, -1)), _BlogFindStageByQuali);

/**
 * __Aggereration__
 *
 * Object này dùng để cung cấp một số find stage cho phương thức `aggerate()`
 */
var BlogFindStages = {
  quality: {
    name: 'quality',
    expressions: (_expressions = {}, (0, _defineProperty2["default"])(_expressions, BlogQualityNames.all, function () {
      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : BlogFindStageByQuality.all;
      return {
        '$match': filter
      };
    }), (0, _defineProperty2["default"])(_expressions, BlogQualityNames.most_comments, function () {
      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : BlogFindStageByQuality.most_comments;
      return {
        '$sort': filter
      };
    }), (0, _defineProperty2["default"])(_expressions, BlogQualityNames.most_favorites, function () {
      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : BlogFindStageByQuality.most_favorites;
      return {
        '$sort': filter
      };
    }), _expressions)
  },
  name: {
    name: 'name',
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
  except_by_blogid: {
    expressions: {
      'except_by_blogid': function except_by_blogid(id) {
        return id ? {
          '$match': {
            _id: {
              '$not': {
                '$eq': new _mongodb.ObjectId(id)
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
exports.BlogFindStages = BlogFindStages;