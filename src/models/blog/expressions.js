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
  SpecialtyFieldStageNames
} from 'utilities/mongo'

import {
  BlogQualityNameProps
} from 'types'

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
  except_by_blogid: {
    expressions: {
      'except_by_blogid': id => id ? ({ '$match': { _id: { '$not': { '$eq': new ObjectId(id) } } } }) : ({ '$match': {} })
    }
  }
}

export const SpecialtyBlogFields = {
  content: {
    field: 'content',
    stages: {
      [SpecialtyFieldStageNames.addFields]: { $addFields: { '$arrayElemAt': ['$content', 0] } },
      [SpecialtyFieldStageNames.lookup]: {
        $lookup: {
          from: 'content',
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
      [SpecialtyFieldStageNames.addFields]: { $addFields: { '$arrayElemAt': ['$author', 0] } },
      [SpecialtyFieldStageNames.lookup]: {
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
    stages: {}
  },
  _dataType: {
    field: 'isLiked',
    stages: {
      [SpecialtyFieldStageNames.addFields]: { $addFields: 'blog' }
    }
  }
}