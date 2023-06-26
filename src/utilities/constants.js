import { env } from 'config/environtment'

export const HttpStatusCode = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
  EXPIRED: 410 //GONE
}

export const MapApiStatus = {
  OK: 'OK',
  ZERO_RESULTS : 'This Place no longer exists',
  NOT_FOUND  : 'Can not find any results',
  INVALID_REQUEST : 'Invalid request',
  OVER_QUERY_LIMIT : 'You have exceeded the query limit',
  REQUEST_DENIED : 'Request was denied',
  UNKNOWN_ERROR : 'Unknown error'
}

export const FilterConstants = {
  categories: {
    ALL_CATEGORIES: 'all_categories'
  },
  sortBy: {
    DEFAULT: 'DEFAULT',
    PROMINENCE : 'PROMINENCE',
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
}

export const QueryValueSeperator = ';'

export const TextToSpeechConstants = {
  VN_FEMALE_1: {
    languageCode: 'vi-VN',
    name: 'vi-VN-Standard-C'
  },
  VN_FEMALE_2: {
    languageCode: 'vi-VN',
    name: 'vi-VN-Standard-A'
  },
  VN_MALE_1: {
    languageCode: 'vi-VN',
    name: 'vi-VN-Standard-B'
  },
  VN_MALE_2: {
    languageCode: 'vi-VN',
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
}

export const WHITELIST_DOMAINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://dong-nai-travel-admin.vercel.app'
]

let websiteDomain = 'http://localhost:3000'
if (env.BUILD_MODE === 'production') {
  websiteDomain = 'https://dong-nai-travel-admin.vercel.app'
}

export const CloudinaryFolders = {
  user: {
    user: 'users'
  },
  place: {
    place_photos: 'place_photos'
  },
  blog: {
    blog_photos: 'blog_photos'
  },
  blog_content: {
    blog_speechs: 'blog_speechs'
  }
}

export const WEBSITE_DOMAIN = websiteDomain

export const DEFAULT_ITEMS_PER_PAGE = 12
export const DEFAULT_CURRENT_PAGE = 1