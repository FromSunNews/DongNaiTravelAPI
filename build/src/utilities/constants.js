"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WHITELIST_DOMAINS = exports.WEBSITE_DOMAIN = exports.TextToSpeechConstants = exports.QueryValueSeperator = exports.PlaceFindStageByQuality = exports.PlaceFilterKeywords = exports.MapApiStatus = exports.HttpStatusCode = exports.FilterConstants = exports.DEFAULT_ITEMS_PER_PAGE = exports.DEFAULT_CURRENT_PAGE = void 0;
var _environtment = require("../config/environtment");
var HttpStatusCode = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
  EXPIRED: 410 //GONE
};
exports.HttpStatusCode = HttpStatusCode;
var MapApiStatus = {
  OK: 'OK',
  ZERO_RESULTS: 'This Place no longer exists',
  NOT_FOUND: 'Can not find any results',
  INVALID_REQUEST: 'Invalid request',
  OVER_QUERY_LIMIT: 'You have exceeded the query limit',
  REQUEST_DENIED: 'Request was denied',
  UNKNOWN_ERROR: 'Unknown error'
};
exports.MapApiStatus = MapApiStatus;
var FilterConstants = {
  categories: {
    ALL_CATEGORIES: 'all_categories'
  },
  sortBy: {
    DEFAULT: 'DEFAULT',
    PROMINENCE: 'PROMINENCE',
    NEAR_BY: 'NEAR_BY',
    STAR_LOW_TO_HIGH: 'STAR_LOW_TO_HIGH',
    STAR_HIGH_TO_LOW: 'STAR_HIGH_TO_LOW',
    RATING_LOW_TO_HIGH: 'RATING_LOW_TO_HIGH',
    RATING_HIGH_TO_LOW: 'RATING_HIGH_TO_LOW'
  },
  priceLevels: {
    LEVEL_1: 'LEVEL_1',
    LEVEL_2: 'LEVEL_2',
    LEVEL_3: 'LEVEL_3',
    LEVEL_4: 'LEVEL_4',
    LEVEL_5: 'LEVEL_5'
  }
};
exports.FilterConstants = FilterConstants;
var PlaceFindStageByQuality = {
  'all': {},
  'recommended': {
    'isRecommended': true
  },
  'popular': {
    'numberOfVisited': -1,
    'user_ratings_total': -1
  },
  'most_visit': {
    'numberOfVisited': -1
  },
  'high_rating': {
    'rating': -1
  }
};
exports.PlaceFindStageByQuality = PlaceFindStageByQuality;
var PlaceFilterKeywords = {
  quality: 'quality',
  type: 'type'
};
exports.PlaceFilterKeywords = PlaceFilterKeywords;
var QueryValueSeperator = ';';
exports.QueryValueSeperator = QueryValueSeperator;
var TextToSpeechConstants = {
  VN_FEMALE_1: {
    languageCode: 'vi',
    name: 'vi-VN-Standard-C'
  },
  VN_FEMALE_2: {
    languageCode: 'vi',
    name: 'vi-VN-Standard-A'
  },
  VN_MALE_1: {
    languageCode: 'vi',
    name: 'vi-VN-Standard-B'
  },
  VN_MALE_2: {
    languageCode: 'vi',
    name: 'vi-VN-Standard-D'
  },
  EN_FEMALE_1: {
    languageCode: 'en',
    name: 'en-US-Standard-H'
  },
  EN_FEMALE_2: {
    languageCode: 'en',
    name: 'en-US-Standard-F'
  },
  EN_MALE_1: {
    languageCode: 'en',
    name: 'en-US-Standard-D'
  },
  EN_MALE_2: {
    languageCode: 'en',
    name: 'en-US-Standard-I'
  }
};
exports.TextToSpeechConstants = TextToSpeechConstants;
var WHITELIST_DOMAINS = ['http://localhost:3000', 'http://localhost:3001', 'https://dong-nai-travel-admin.vercel.app'];
exports.WHITELIST_DOMAINS = WHITELIST_DOMAINS;
var websiteDomain = 'http://localhost:3000';
if (_environtment.env.BUILD_MODE === 'production') {
  websiteDomain = 'https://dong-nai-travel-admin.vercel.app';
}
var WEBSITE_DOMAIN = websiteDomain;
exports.WEBSITE_DOMAIN = WEBSITE_DOMAIN;
var DEFAULT_ITEMS_PER_PAGE = 12;
exports.DEFAULT_ITEMS_PER_PAGE = DEFAULT_ITEMS_PER_PAGE;
var DEFAULT_CURRENT_PAGE = 1;
exports.DEFAULT_CURRENT_PAGE = DEFAULT_CURRENT_PAGE;