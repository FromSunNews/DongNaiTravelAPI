import { ObjectId } from 'mongodb'
import { PlaceFindStageByQuality } from './constants'

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
export function getExpectedFieldsProjection(fields, seperator = ';') {
  if (!fields) return {}
  const fieldsArr = fields.split(seperator).map(field => [field, true])
  return Object.fromEntries(fieldsArr)
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
export function createProjectionStage(fields) {
  return Object.keys(fields).length === 0 || !fields ? [] : [{ '$project': fields }]
}

/**
 * Hàm này dùng để tạo ra một `ObjectId('id')` của mongoDB.
 * @param id Là phần `id` trong `ObjectId('id')`
 * @returns
 */
export function createObjectIDByString(id) {
  const i = new ObjectId(id)
  return i
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
export function createLookupStage(
  from,
  localField,
  foreignField,
  as,
  options
) {
  let lookupObject = {
    '$lookup': {
      'from': from
    }
  }
  if (localField) lookupObject.$lookup.localField = localField
  if (foreignField) lookupObject.$lookup.foreignField = foreignField
  if (options && options.extras) lookupObject.$lookup = { ...lookupObject.$lookup, ...options.extras }
  if (options && options.pipeline) lookupObject.$lookup.pipeline = options.pipeline
  lookupObject.$lookup.as = as
  return lookupObject
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
      'most_visit': (filter = PlaceFindStageByQuality.most_visit) => ({ '$sort': filter }),
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

/**
 * Các trường hợp update của user sẽ chia ra làm nhiều phần.
 * - Update mặc định: là kiểu update sẽ dùng toán tử $set và sẽ có cập nhật updatedAt.
 * - Update các trường array, vì đa phần các trường array này có toán tử update riêng, và không cần phải cập nhật updatedAt
 */
export const UserUpdateCases = {
  'default': (newUserData) => ({ $set: { newUserData }, $currentDate: { updatedAt: true } }),
  'addEle:savedPlaces': (placeId) => ({ $addToSet: { 'savedPlaces': placeId } }),
  'removeEle:savedPlaces': (placeId) => ({ $pull: { 'savedPlaces': placeId } }),
  'addEle:follower': (userId) => ({ $addToSet: { 'followerIds': userId } }),
  'removeEle:follower': (userId) => ({ $pull: { 'followerIds': userId } }),
  'addEle:visitedPlaces': (placeId) => ({ $addToSet: { 'visitedPlaces': placeId } }),
  'removeEle:visitedPlaces': (placeId) => ({ $pull: { 'visitedPlaces': placeId } })
}

export const SpecialtyPlaceFieldStageNames = {
  addFields: 'addFields',
  lookup: 'lookup'
}

export const SpecialtyPlaceFields = {
  place_photo: {
    field: 'place_photo',
    stages: {
      [SpecialtyPlaceFieldStageNames.addFields]: { $addFields: { '$arrayElemAt': [{ '$arrayElemAt': ['$place_photo.photos', 0] }, 0] } },
      [SpecialtyPlaceFieldStageNames.lookup]: {
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
      [SpecialtyPlaceFieldStageNames.addFields]: { $addFields: { '$arrayElemAt': ['$place_photos.photos', 0] } },
      [SpecialtyPlaceFieldStageNames.lookup]: {
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
      [SpecialtyPlaceFieldStageNames.addFields]: { $addFields: { '$arrayElemAt': ['$reviews.reviews', 0] } },
      [SpecialtyPlaceFieldStageNames.lookup]: {
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
      [SpecialtyPlaceFieldStageNames.addFields]: { $addFields: { '$arrayElemAt': ['$content', 0] } },
      [SpecialtyPlaceFieldStageNames.lookup]: {
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
    stages: {}
  },
  isVisited: {
    field: 'isVisited',
    stages: {}
  },
  _dataType: {
    field: 'isLiked',
    stages: {
      [SpecialtyPlaceFieldStageNames.addFields]: { $addFields: 'place' }
    }
  }
}