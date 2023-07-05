/**
 * File này sẽ chứa các expressions đặc biệt cho blog, để thực hiện một số function như là updateOne, aggregate...
 * Nhìn chung là nó giống như mấy cái expression mà t đã setup ở trong `mongo.js` (có thể trong tương lai cũng thêm nó vào trong
 * một file như này luôn)
 */

import { ObjectId } from 'mongodb'
import {
  blogFields
} from 'schemas/blog.schema'

import {
  AggregationStageNames,
  SpecialUpdateCases
} from 'utilities/mongo'

import {
  BlogQualityNameProps,
  SpecialtyDataFieldProps
} from 'types'
import { placeFields } from 'schemas/place.schema'

/**
 * Tên của các blog qualities
 * @type {BlogQualityNameProps}
 */
export const BlogQualityNames = {
  all: 'all',
  most_favorites: 'most_favorites',
  most_comments: 'most_comments'
}

const BlogFindStageByQuality = {
  [BlogQualityNames.all]: {},
  [BlogQualityNames.most_favorites]: { [blogFields.userFavoritesTotal]: -1 },
  [BlogQualityNames.most_comments]: { [blogFields.userCommentsTotal]: -1 }
}

/**
 * __Aggereration__
 *
 * Object này dùng để cung cấp một số find stage cho phương thức `aggerate()`
 */
export const BlogFindStages = {
  quality: {
    name: 'quality',
    expressions: {
      [BlogQualityNames.all]: (filter = BlogFindStageByQuality.all) => ({ '$match': filter }),
      [BlogQualityNames.most_comments]: (filter = BlogFindStageByQuality.most_comments) => ({ '$sort': filter }),
      [BlogQualityNames.most_favorites]: (filter = BlogFindStageByQuality.most_favorites) => ({ '$sort': filter })
    }
  },
  name: {
    name: 'name',
    expressions: {
      'name': (value = '') => ({ '$match': { 'name': { $regex: value, $options: 'i' } } })
    }
  },
  type: {
    expressions: {
      'type': (value = '') => ({ '$match': { 'types': { '$eq': value } } })
    }
  },
  except_by_blogid: {
    expressions: {
      'except_by_blogid': id => id ? ({ '$match': { _id: { '$not': { '$eq': new ObjectId(id) } } } }) : ({ '$match': {} })
    }
  }
}

export function getSpecialtyBlogFields() {
  return {
    content: {
      field: 'content',
      stages: {
        [AggregationStageNames.addFields]: { $addFields: { content: { '$arrayElemAt': ['$content', 0] } } },
        [AggregationStageNames.lookup]: {
          $lookup: {
            from: 'blog_content',
            let: { pid: '$contentId' },
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
                  _id: false,
                  plainTextMarkFormat: true,
                  plainText: true,
                  speech: true
                }
              }
            ],
            as: 'content'
          }
        }
      }
    },
    author: {
      field: 'author',
      stages: {
        [AggregationStageNames.addFields]: { $addFields: { author: { '$arrayElemAt': ['$author', 0] } } },
        [AggregationStageNames.lookup]: {
          $lookup: {
            from: 'users',
            let: { pid: '$authorId' },
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
                  _id: false,
                  displayName: true,
                  firstName: true,
                  lastName: true,
                  avatar: true
                }
              }
            ],
            as: 'author'
          }
        }
      }
    },
    isLiked: {
      field: 'isLiked',
      functionalStages: {
        [AggregationStageNames.addFields]: user => ({ $addFields: { isLiked: { $in: [{ $toString: '$_id' }, user.savedBlogs] } } })
      }
    },
    _dataType: {
      field: '_dataType',
      stages: {
        [AggregationStageNames.addFields]: { $addFields: { _dataType: 'blog' } }
      }
    }
  }
}

/**
 * Đây là một số case update đặc biệt cho blog.
 */
export const BlogUpdateCases = {
  'default': data => SpecialUpdateCases.default.getExprNExtUpdateFilter(data),
  'addEle:reviewIds': reviewId => SpecialUpdateCases.addEle.getExprNExtUpdateFilter(blogFields.reviewIds, reviewId),
  'removeEle:reviewIds': reviewId => SpecialUpdateCases.removeEle.getExprNExtUpdateFilter(blogFields.reviewIds, reviewId),
  'inc:userFavoritesTotal': () => SpecialUpdateCases.inc.getExprNExtUpdateFilter(blogFields.userFavoritesTotal),
  'dec:userFavoritesTotal': () => SpecialUpdateCases.dec.getExprNExtUpdateFilter(blogFields.userFavoritesTotal),
  'inc:userCommentsTotal': () => SpecialUpdateCases.inc.getExprNExtUpdateFilter(blogFields.userCommentsTotal),
  'dec:userCommentsTotal': () => SpecialUpdateCases.dec.getExprNExtUpdateFilter(blogFields.userCommentsTotal)
}