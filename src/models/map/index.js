import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from 'config/mongodb'
import {
  PlaceFindStageByQuality,
  PlaceFilterKeywords,
  QueryValueSeperator
} from 'utilities/constants'
import {
  createProjectionStage,
  getExpectedFieldsProjection,
  AggregationStageNames,
  getFindStageWithFilters,
  getPipelineStagesWithSpecialtyFields,
  isValidObjectId
} from 'utilities/mongo'
import {
  removePropsFromObj
} from 'utilities/function'

import {
  PlaceFindStages,
  getSpecialtyPlaceFields,
  PlaceUpdateCases
} from './expressions'

import { placeCollectionSchema } from 'schemas/place.schema'

// Define Map collection
const mapCollectionName = 'maps'


// Phuong: Đây là những trường không được update (giá trị cố định không đổi)
const INVALID_UPDATE_FIELDS = ['_id', 'place_id', 'createdAt']

// Phuong: Tạo Schema để mongodb biết tạo bảng ntn
const validateSchema = async (data) => {
  return await placeCollectionSchema.validateAsync(data, { abortEarly: false })
}

// Phuong: Tìm dựa trên id của map.
const findOneById = async (id) => {
  try {
    const result = await getDB().collection(mapCollectionName)
    // Phuong: Bởi vì key _id trong mongodb đucợ luu ở dạng ObjectId nên phải
    // Phuong: chuyển qua ObjectId từ phía client đẩy lên mới tìm được
      .findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phuong: Tìm dựa trên place_id
const findOneByPlaceId = async (place_id) => {
  try {
    const result = await getDB().collection(mapCollectionName).findOne({ place_id: place_id })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phuong: Tìm dựa trên place_id nhưng bắt đầu bằng kí tự 1 và kết thúc bằng kí tự 2
const findOneByPlaceIdStartEnd = async (firstString, lastString) => {
  try {
    const regexPattern = new RegExp(`^${firstString}.*${lastString}$`)
    const result = await getDB().collection(mapCollectionName).find({ place_id: { $regex: regexPattern } }).toArray()
    console.log('🚀 ~ file: map.model.js:118 ~ findOneByPlaceIdStartEnd ~ result:', result)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Tuan: Lấy tất cả các dữ liệu của places, có giới hạn.
/**
 * Method này dùng để trả về một mảng dữ liệu của places. Có filter, limit và skip. Ngoài ra
 * thì có thể yêu cầu các trường dữ liệu cần trả về.
 * @param {{[key: string]: string}} filter Object chứa các filter theo tiêu chuẩn của mongo, nhưng đồng thời cũng phải thỏa scheme của Place.
 * @param {{[key: string]: string}} fields Object chứa các field-true để lấy các trường dữ liệu mong muốn.
 * @param {number} limit Số records giới hạn được trả về.
 * @param {number} skip Số records muốn mongo bỏ qua.
 * @returns
 */
const findManyInLimit = async (filter, fields, limit = 10, skip = 0) => {
  try {
    console.log(fields)
    const cursor = getDB().collection(mapCollectionName).find(filter, { projection: fields }).limit(limit).skip(skip)
    const result = await cursor.toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Tuan: Lấy tất cả các dữ liệu của places, có giới hạn.
/**
 * Method này dùng để trả về một mảng dữ liệu của places. Có filter, limit và skip. Ngoài ra
 * thì có thể yêu cầu các trường dữ liệu cần trả về.
 * @param {string} filter Object chứa các filter theo tiêu chuẩn của mongo, nhưng đồng thời cũng phải thỏa scheme của Place.
 * @param {string} fields Object chứa các field-true để lấy các trường dữ liệu mong muốn.
 * @param {number} limit Số records giới hạn được trả về.
 * @param {number} skip Số records muốn mongo bỏ qua.
 * @returns
 */
const findManyInLimitWithPipeline = (function() {
  return async (data) => {
    let { filter, fields, limit = 10, skip = 0, user } = data
    try {
      // Đầu tiên thì split cái filter ra bằng khoảng trắng;
      let filters = filter?.split(',')
      let pipeline = []
      let projectStage = []
      // T gọi cái này là find stage là bời vì nó sẽ tìm record theo $match
      let findStage = {
        match: {
          $match: {}
        },
        others: []
      }
      let specialtyPlaceFields = getSpecialtyPlaceFields()
      let [specialtyFieldsPipeline, newFields] = getPipelineStagesWithSpecialtyFields(specialtyPlaceFields, fields, user)

      if (filters)
        findStage = Object.assign({}, findStage, getFindStageWithFilters(PlaceFindStages, filters))

      projectStage = createProjectionStage(getExpectedFieldsProjection(newFields))

      pipeline.push(findStage.match, ...findStage.others, ...specialtyFieldsPipeline)

      if (projectStage[0]?.$project && Object.keys(projectStage[0]?.$project).length >= 1) pipeline.push(...projectStage)

      pipeline.push({ '$skip': skip }, { '$limit': limit })
      console.log('Pipeline: ', pipeline)
      const cursor = getDB().collection(mapCollectionName).aggregate(pipeline)
      const result = await cursor.toArray()
      return result
    } catch (error) {
      console.error(error.message)
      return undefined
    }
  }})()

/**
 * Hàm này dùng để tìm thông tin chi tiết của một địa điểm nào đó.
 * @param {*} data
 * @returns
 */
const findOneWithPipeline = (function() {
  return async (data, user) => {
    try {
      // url chỉ nhận 2 query là placeId và fields (có thể update thêm)
      // userId có thể undefined bởi vì không phải lúc nào cũng có thể
      let {
        placeId,
        fields,
        lang
      } = data

      // Khai báo pipeline. Stage đầu tiên là mình kiếm ra các document này trước.
      // Nếu như tìm được 1 document thì nó sẽ chỉ trả về một document trong một mảng.
      // Và vì mỗi place chỉ có một placeId cho nên là chỉ luôn tìm được một id.
      let pipeline = [
        {
          '$match': { 'place_id': placeId }
        }
      ]
      // Stage này dùng để chọn các fields data mong muốn trong `fields`.
      let placeDetailsProjectionStage
      // Lấy object chứa các field đặc biệt
      let specialtyPlaceFields = getSpecialtyPlaceFields()
      let [specialtyFieldsPipeline, newFields] = getPipelineStagesWithSpecialtyFields(specialtyPlaceFields, fields, user)

      if (lang) {
        specialtyPlaceFields.content.stages['lookup']['$lookup'].pipeline[1].$project.speech = { [lang]: true }
        specialtyPlaceFields.content.stages['lookup']['$lookup'].pipeline[1].$project.plainTextMarkFormat = { [lang]: true }
      }

      // Tạo project stage cho các fields của place. Nếu như fields chỉ chứa các fields đặc biệt hoặc
      // là không có fields nào thì nó sẽ trả về rỗng.
      placeDetailsProjectionStage = createProjectionStage(getExpectedFieldsProjection(newFields))

      pipeline.push(...specialtyFieldsPipeline, ...placeDetailsProjectionStage)
      console.log('Pipeline: ', pipeline)
      console.log('New fields: ', newFields)
      const cursor = getDB().collection(mapCollectionName).aggregate(pipeline)
      const result = await cursor.toArray()
      return result[0]
    } catch (error) {
      console.error(error.message)
      return undefined
    }
  }
})()

// Phương: tạo mới map
const createNew = async (data) => {
  try {
    const validatedValue = await validateSchema(data)

    const result = await getDB().collection(mapCollectionName).insertOne(validatedValue)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Phuong: Cập nhật map thông qua place_id
const updateByPlaceId = async (place_id, data) => {
  try {
    const updateData = { ...data }

    // Phuong: CHỗ này là xóa những trường mà mình không cho phép update
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const result = await getDB().collection(mapCollectionName).findOneAndUpdate(
      { place_id: place_id },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

const updateOneByCase = async (id, updateData, updateCase = 'default') => {
  try {
    let newUpdateData
    if (updateData) typeof updateData === 'string' | 'number' ? updateData : removePropsFromObj(updateData, INVALID_UPDATE_FIELDS)
    let [expression, extendedUpdateFilter] = PlaceUpdateCases[updateCase](newUpdateData)
    let idFilter = isValidObjectId(id) ? { _id: new ObjectId(id) } : { place_id: id }
    let updateFilter = {
      ...idFilter,
      ...extendedUpdateFilter
    }

    let result = await getDB().collection(mapCollectionName).updateOne(
      updateFilter,
      expression
    )

    return result
  } catch (error) {
    console.error(error.message)
    return undefined
  }
}

const createManyPlaces = async (places) => {
  // console.log('🚀 ~ file: map.model.js:141 ~ createManyPlaces ~ places', places)
  try {
    // Phuong: https://www.mongodb.com/docs/v6.0/reference/method/db.collection.insertMany/#mongodb-method-db.collection.insertMany
    const result = await getDB().collection(mapCollectionName).insertMany(places)
    console.log('🚀 ~ Successfully ~ createManyPlaces ~ places')

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const MapModel = {
  mapCollectionName,
  createNew,
  updateByPlaceId,
  updateOneByCase,
  findOneById,
  findOneWithPipeline,
  findOneByPlaceId,
  findManyInLimit,
  findManyInLimitWithPipeline,
  createManyPlaces
}

