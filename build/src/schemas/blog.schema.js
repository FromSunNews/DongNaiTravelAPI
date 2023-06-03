"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.blogFields = exports.blogCollectionSchema = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _joi = _interopRequireDefault(require("joi"));
var _types = require("types");
var _Joi$object;
/**
 * @type {BlogFieldNamesProp}
 */
var blogFields = {
  authorId: 'authorId',
  reviewIds: 'reviewIds',
  contentId: 'contentId',
  name: 'name',
  avatar: 'avatar',
  userFavoritesTotal: 'userFavoritesTotal',
  userCommentsTotal: 'userCommentsTotal',
  type: 'type',
  mentionedPlaces: 'mentionedPlaces',
  isApproved: 'isApproved',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};
exports.blogFields = blogFields;
var blogCollectionSchema = _joi["default"].object((_Joi$object = {}, (0, _defineProperty2["default"])(_Joi$object, blogFields.authorId, _joi["default"].string().required()), (0, _defineProperty2["default"])(_Joi$object, blogFields.reviewIds, _joi["default"].array().items(_joi["default"].string())["default"]([])), (0, _defineProperty2["default"])(_Joi$object, blogFields.contentId, _joi["default"].string().required()), (0, _defineProperty2["default"])(_Joi$object, blogFields.name, _joi["default"].string().required()), (0, _defineProperty2["default"])(_Joi$object, blogFields.avatar, _joi["default"].string().required()), (0, _defineProperty2["default"])(_Joi$object, blogFields.userFavoritesTotal, _joi["default"].number()["default"](0)), (0, _defineProperty2["default"])(_Joi$object, blogFields.userCommentsTotal, _joi["default"].number()["default"](0)), (0, _defineProperty2["default"])(_Joi$object, blogFields.type, _joi["default"].number().required()), (0, _defineProperty2["default"])(_Joi$object, blogFields.mentionedPlaces, _joi["default"].array().items(_joi["default"].string())["default"]([])), (0, _defineProperty2["default"])(_Joi$object, blogFields.isApproved, _joi["default"]["boolean"]()["default"](false)), (0, _defineProperty2["default"])(_Joi$object, blogFields.createdAt, _joi["default"].date().timestamp('javascript')["default"](Date.now)), (0, _defineProperty2["default"])(_Joi$object, blogFields.updatedAt, _joi["default"].date().timestamp()["default"](null)), _Joi$object));
exports.blogCollectionSchema = blogCollectionSchema;