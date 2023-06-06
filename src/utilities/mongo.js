import { ObjectId } from 'mongodb'

import {
  LookupArraysProps
} from 'types'

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

export const AggregationStageNames = {
  addFields: 'addFields',
  lookup: 'lookup'
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
 * Hàm này dùng để lấy ra các pipeline stages cho các trường dữ liệu đặc biệt của document mà
 * đã được setup trong `expression.js` của model. Hàm này trả về một pipeline và `fields` đã được
 * thay đổi trong quá trình tạo các stages.
 *
 * `SpecialtyDataFields` là một object có chứa các thuộc tính sau:
 * - Field: là tên của field data,
 * - Stages: là các stage ($addField, $lookup) dã được fix cứng
 * - FunctionalStage: là các function trả về stages.
 *
 * @param {*} specialtyDataFields
 * @param {string} fields
 * @param {} user
 * @returns
 */
export function getPipelineStagesWithSpecialtyFields(specialtyDataFields, fields, user) {
  let fieldsInArr = fields?.split(';')
  let addFieldsStage = []
  let pipeline = []

  for (let specialtyField in specialtyDataFields) {
    if (specialtyField === specialtyDataFields.isLiked?.field || specialtyField === specialtyDataFields.isVisited?.field) {
      if (Boolean(fields) && !fieldsInArr.find(field => field === specialtyField)) fields += `;${specialtyField}`
      if (user) {
        // functionalStage = user => ({ $addFields: isLiked: { $in: [{ $toString: '$_id' }, user[key]] } })
        // Vì có một isLike, isVisited (có thể bỏ) chỉ có duy nhất một stage, cho nên gán như này luôn
        let functionalStage = specialtyDataFields[specialtyField].functionalStages['addFields']
        let stage = functionalStage(user)
        if (!addFieldsStage[0]) addFieldsStage[0] = { '$addFields': {} }
        addFieldsStage[0]['$addFields'] = {
          ...addFieldsStage[0]['$addFields'],
          ...stage['$addFields']
        }
      }
      continue
    }

    for (let stageName in AggregationStageNames) {
      if (Boolean(fields) && !fieldsInArr.find(field => field === specialtyField)) continue
      let stage = specialtyDataFields[specialtyField].stages[stageName]

      if (!addFieldsStage[0]) addFieldsStage[0] = { '$addFields': {} }
      if (stageName === AggregationStageNames.addFields && stage) {
        // Add tên field + expression
        addFieldsStage[0]['$addFields'] = {
          ...addFieldsStage[0]['$addFields'],
          ...stage['$addFields']
        }
      }

      if (stageName === AggregationStageNames.lookup && stage) {
        pipeline.push(stage)
      }
    }
  }
  pipeline.push(...addFieldsStage)
  return [pipeline, fields]
}

/**
 * Hàm này dùng để lấy find stage của một hay nhiều document nào đó mà đã được setup trong
 * `expression.js` của model.
 * @param {*} findStages
 * @param {Array<string>} filters
 * @returns
 */
export function getFindStageWithFilters(findStages, filters) {
  let findStage = {
    match: {
      $match: {}
    },
    others: []
  }

  for (let filter of filters) {
    filter = decodeURIComponent(filter)
    let [key, value] = filter.split(':')
    let hasQuality = key.includes('quality')
    let expression = findStages.quality.expressions[value] || findStages[key].expressions[key]
    if (!expression()['$match']) findStage.others.push(expression())
    if (hasQuality) {
      findStage.match['$match'] = { ...findStage.match['$match'], ...expression()['$match'] }
      continue
    }
    if (!hasQuality) {
      findStage.match['$match'] = { ...findStage.match['$match'], ...expression(value)['$match'] }
      continue
    }
  }

  return findStage
}

export const SpecialUpdateCases = {
  default: {
    name: 'default',
    /**
     * Lấy biểu thức để update document.
     * Trả về theo dạng __`__`[expression, extUpdateFilter]`__`__
     * @param {any} data Dữ liệu cần update
     * @returns
     */
    getExprNExtUpdateFilter: (data) => [{ $set: data, $currentDate: { updatedAt: true } }]
  },
  addEle: {
    name: 'addEle',
    /**
     * Lấy biểu thức để thêm một `value` vào `field`, là field có `type=array` trong document.
     * Trả về theo dạng __`[expression, extUpdateFilter]`__
     * @param {string} field Tên của field cần thêm element.
     * @param {any} value Giá trị cần thêm.
     * @returns
     */
    getExprNExtUpdateFilter: (field, value) => [{ $addToSet: { [field]: value } }]
  },
  removeEle: {
    name: 'removeEle',
    /**
     * Lấy biểu thức để bỏ `value` ra khỏi `field`, là field có `type=array` trong document.
     * Trả về theo dạng __`[expression, extUpdateFilter]`__
     * @param {string} field Tên của field cần bỏ element.
     * @param {any} value Giá trị cần bỏ.
     * @returns
     */
    getExprNExtUpdateFilter: (field, value) => [{ $pull: { [field]: value } }]
  },
  inc: {
    name: 'inc',
    /**
     * Cái này chỉ dùng với những field có `type=number`
     * Trả về theo dạng __`[expression, extUpdateFilter]`__
     * @param {string} field Tên của field cần tăng `value`.
     * @returns
     */
    getExprNExtUpdateFilter: (field) => [{ $inc: { [field]: 1 } }]
  },
  dec: {
    name: 'dec',
    /**
     * Cái này chỉ dùng với những field có `type=number`
     * Trả về theo dạng __`[expression, extUpdateFilter]`__
     * @param {string} field Tên của field cần tăng `value`.
     * @returns
     */
    getExprNExtUpdateFilter: (field) => [{ $inc: { [field]: -1 } }, { [field]: { $gt: 0 } }]
  }
}

/**
 * Hàm này dùng để check xem `id` (string) có phải là một chuỗi ObjectId
 * hợp lệ hay không?
 */
export const isValidObjectId = (function() {
  let reg = /^[0-9a-fA-F]{24}$/
  /**
   * @param {string} id
   */
  return function(id) {
    return reg.test(id)
  }
})()