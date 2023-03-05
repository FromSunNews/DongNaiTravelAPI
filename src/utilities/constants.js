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