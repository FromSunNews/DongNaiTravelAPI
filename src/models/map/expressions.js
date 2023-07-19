import {
  AggregationStageNames,
  SpecialUpdateCases
} from 'utilities/mongo'

import {
  placeFields
} from 'schemas/place.schema'

/**
 * Keyword cho filter của place (filter param trong url).
 * Hiện tại thì chỉ có:
 * - quality
 * - type
 * - name
 */
export const PlaceFilterKeywords = {
  quality: 'quality',
  type: 'type',
  name: 'name'
}

/**
 * Find stage của place.
 */
export const PlaceFindStageByQuality = {
  'all': {},
  'recommended': { [placeFields.isRecommended]: true },
  'popular': { [placeFields.user_favorites_total]: -1, [placeFields.user_ratings_total]: -1 },
  'most_favorite': { [placeFields.user_favorites_total]: -1 },
  'high_rating': { [placeFields.rating]: -1 }
}

export function getSpecialtyPlaceFields() {
  return {
    place_photo: {
      field: 'place_photo',
      stages: {
        [AggregationStageNames.addFields]: { $addFields: { place_photo: { '$arrayElemAt': [{ '$arrayElemAt': ['$place_photo.photos', 0] }, 0] } } },
        [AggregationStageNames.lookup]: {
          $lookup: {
            from: 'photos',
            localField: 'place_id',
            foreignField: 'place_photos_id',
            as: 'place_photo'
          }
        }
      }
    },
    place_photos: {
      field: 'place_photos',
      stages: {
        [AggregationStageNames.addFields]: { $addFields: { place_photos: { '$arrayElemAt': ['$place_photos.photos', 0] } } },
        [AggregationStageNames.lookup]: {
          $lookup: {
            from: 'photos',
            localField: 'place_id',
            foreignField: 'place_photos_id',
            as: 'place_photos'
          }
        }
      }
    },
    reviews: {
      field: 'reviews',
      stages: {
        [AggregationStageNames.addFields]: { $addFields: { reviews: { '$arrayElemAt': ['$reviews.reviews', 0] } } },
        [AggregationStageNames.lookup]: {
          $lookup: {
            from: 'reviews',
            localField: 'place_id',
            foreignField: 'place_reviews_id',
            as: 'reviews'
          }
        }
      }
    },
    content: {
      field: 'content',
      stages: {
        [AggregationStageNames.addFields]: { $addFields: { content: { '$arrayElemAt': ['$content', 0] } } },
        [AggregationStageNames.lookup]: {
          $lookup: {
            from: 'content',
            let: { pid: '$content_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', { $toObjectId: '$$pid' }]
                  }
                }
              },
              {
                $project: {
                  plainTextMarkFormat: true,
                  plainTextBase64: true,
                  speech: true
                }
              }
            ],
            as: 'content'
          }
        }
      }
    },
    isLiked: {
      field: 'isLiked',
      functionalStages: {
        [AggregationStageNames.addFields]: user => ({ $addFields: { isLiked: { $in: ['$place_id', user.savedPlaces] } } })
      }
    },
    _dataType: {
      field: '_dataType',
      stages: {
        [AggregationStageNames.addFields]: { $addFields: { _dataType: 'place' } }
      }
    }
  }
}

/**
 * Là một object chứa các $match stage cho place (dùng cho việc tìm nhiều place).
 * Với mỗi key sẽ có một expression. Mỗi một expression này sẽ là một function dùng
 * để tạo stage.
 *
 * Có 2 key chính, một là quality (trường hợp đặc biệt) và others. Others là các query
 * trường dữ liệu cụ thể, còn quality thì phải có một xíu tính toán.
 */
export const PlaceFindStages = {
  // Special filter
  quality: {
    expressions: {
      'all': (filter = PlaceFindStageByQuality.all) => ({ '$match': filter }),
      'recommended': (filter = PlaceFindStageByQuality.recommended) => ({ '$match': filter }),
      'popular': (filter = PlaceFindStageByQuality.popular) => ({ '$sort': filter }),
      'most_favorite': (filter = PlaceFindStageByQuality.most_favorite) => ({ '$sort': filter }),
      'high_rating': (filter = PlaceFindStageByQuality.high_rating) => ({ '$sort': filter })
    }
  },
  name: {
    expressions: {
      'name': (value = '') => ({ '$match': { 'name': { $regex: value, $options: 'i' } } })
    }
  },
  type: {
    expressions: {
      'type': (value = '') => ({ '$match': { 'types': { '$all': value.split(';') } } })
    }
  },
  except_by_placeid: {
    expressions: {
      'except_by_placeid': id => id ? ({ '$match': { place_id: { '$not': { '$eq': id } } } }) : ({ '$match': {} })
    }
  }
}

export const PlaceUpdateCases = {
  'default': (data) => SpecialUpdateCases.default.getExprNExtUpdateFilter(data),
  'inc:userRatingsTotal': () => SpecialUpdateCases.inc.getExprNExtUpdateFilter(placeFields.user_ratings_total),
  'dec:userRatingsTotal': () => SpecialUpdateCases.dec.getExprNExtUpdateFilter(placeFields.user_ratings_total),
  'inc:userFavoritesTotal': () => SpecialUpdateCases.inc.getExprNExtUpdateFilter(placeFields.user_favorites_total),
  'dec:userFavoritesTotal': () => SpecialUpdateCases.dec.getExprNExtUpdateFilter(placeFields.user_favorites_total),
  'addEle:types': (type) => SpecialUpdateCases.addEle.getExprNExtUpdateFilter(placeFields.types, type),
  'removeEle:types': (type) => SpecialUpdateCases.removeEle.getExprNExtUpdateFilter(placeFields.types, type)
}