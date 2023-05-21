import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { getDB } from 'config/mongodb'
import {
  PlaceFindStageByQuality,
  PlaceFilterKeywords,
  QueryValueSeperator
} from 'utilities/constants'
import {
  createLookupStage,
  createObjectIDByString,
  createProjectionStage,
  getExpectedFieldsProjection,
  PlaceFindStages,
  SpecialtyPlaceFields,
  SpecialtyPlaceFieldStageNames
} from 'utilities/mongo'

import { mapCollectionSchema } from 'schemas/place.schema'

// Define Map collection
const mapCollectionName = 'maps'


// Phuong: Đây là những trường không được update (giá trị cố định không đổi)
const INVALID_UPDATE_FILEDS = ['_id', 'place_id', 'createdAt']

// Phuong: Tạo Schema để mongodb biết tạo bảng ntn
const validateSchema = async (data) => {
  return await mapCollectionSchema.validateAsync(data, { abortEarly: false })
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
      let filters = filter.split(' ')
      let addFieldsStage = { $addFields: {} }
      let projectStage = {
        '$project': {}
      }
      // T gọi cái này là find stage là bời vì nó sẽ tìm record theo $match
      let findStage = {
        match: {
          $match: {}
        },
        others: []
      }

      for (let filter of filters) {
        let [key, value] = filter.split(':')
        let hasQuality = key.includes('quality')
        let expression = PlaceFindStages.quality.expressions[value] || PlaceFindStages[key].expressions[key]
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

      // console.log('FIND STAGE: ', findStage)

      addFieldsStage.$addFields = {
        place_photos: { '$arrayElemAt': ['$place_photos.photos', 0] }
      }
      if (user) {
        addFieldsStage.$addFields[SpecialtyPlaceFields.isLiked.field] = {
          $in: ['$place_id', user.savedPlaces]
        }
        addFieldsStage.$addFields[SpecialtyPlaceFields.isVisited.field] = {
          $in: ['$place_id', user.visitedPlaces]
        }
      }

      if (fields) fields += `;place_photos;${SpecialtyPlaceFields.isLiked.field};${SpecialtyPlaceFields.isVisited.field}`
      projectStage.$project = { ...getExpectedFieldsProjection(fields) }

      const pipeline = [
        findStage.match,
        ...findStage.others,
        {
          '$lookup': {
            'from': 'photos',
            'localField': 'place_id',
            'foreignField': 'place_photos_id',
            'as': 'place_photos'
          }
        }
      ]

      if (Object.keys(projectStage.$project).length >= 1) pipeline.push(projectStage)

      pipeline.push(addFieldsStage, { '$skip': skip }, { '$limit': limit })
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
  /*
    Khai bảo các fields đặc biệt (Chính là các fields được lookup)
    Lấy dữ liệu này hoạt động theo kiểu:
    - Nếu như fields là rỗng, thì nó sẽ lấy tất cả fields trong place.
    - Nếu như fields chứa một hay nhiều fields đặc biệt fn này sẽ lấy dữ liệu tất cả các fields trong
    place cùng với một hay nhiều fields đặc biệt.
    - Nếu như fields chứa một hay nhiều fields đặc và có một hay nhiều fields trong place, thì
    fn này sẽ lấy dữ liệu của một hay nhiều fields đặc biệt cùng với một hay nhiều fields trong place.
    Và như đã nói thì khi lookup các fields đặc biệt, mình phải thêm các stage khác hỗ trợ. Cho nên trong
    biến này mình sẽ khai báo thêm các data cho các stage đó.
  */
  // let specialtyFields = {
  //   reviews: {
  //     field: 'reviews',
  //     addFieldsStage:  { '$arrayElemAt': ['$reviews.reviews', 0] },
  //     lookupStage: {
  //       from: 'reviews',
  //       localField: 'place_id',
  //       foreignField: 'place_reviews_id',
  //       as: 'reviews'
  //     }
  //   },
  //   content: {
  //     field: 'content',
  //     addFieldsStage:  { '$arrayElemAt': ['$content', 0] },
  //     lookupStage: {
  //       from: 'content',
  //       localField: undefined,
  //       foreignField: undefined,
  //       as: 'content',
  //       options: {
  //         extras: {
  //           let: { pid: '$content_id' }
  //         },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $eq: ['$_id', { $toObjectId: '$$pid' }]
  //               }
  //             }
  //           },
  //           {
  //             $project: {
  //               plainTextMarkFormat: true,
  //               plainTextBase64: true,
  //               speech: true
  //             }
  //           }
  //         ]
  //       }
  //     }
  //   },
  //   isLiked: {
  //     field: 'isLiked'
  //   }
  // }

  return async (data, user) => {
    try {
      // url chỉ nhận 2 query là placeId và fields (có thể update thêm)
      // userId có thể undefined bởi vì không phải lúc nào cũng có thể
      let {
        placeId,
        fields,
        lang
      } = data
      console.log('REQUESTED FIELDS: ', fields)
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
      // Stage này hỗ trợ cho stage ở trên, dùng để thêm các field bên ngoài trong quá trình lookup
      // Trong đó có reviews và content.
      let addFieldsStage = []
      if (lang) {
        SpecialtyPlaceFields.content.stages['lookup']['$lookup'].pipeline[1].$project.speech = { [lang]: true }
        SpecialtyPlaceFields.content.stages['lookup']['$lookup'].pipeline[1].$project.plainTextBase64 = { [lang]: true }
        SpecialtyPlaceFields.content.stages['lookup']['$lookup'].pipeline[1].$project.plainTextMarkFormat = { [lang]: true }
      }

      for (let key in SpecialtyPlaceFields) {
        /*
          Ở đây mình check thêm việc là có phải một người dùng trong app yêu cầu hay không?
          Nếu có thì mình check luôn là place này có được người dùng yêu thích hay không?
          Hay là đã được người dùng này ghé thăm hay chưa? isLiked và isVisited cũng là 2
          fields đặc biệt, nhưng khác với 2 field kia là 2 fields này không dùng $lookup.
        */
        if (key === SpecialtyPlaceFields.isLiked.field || key === SpecialtyPlaceFields.isVisited.field) {
          if (Boolean(fields) && !fields.includes(key)) fields += `;${key}`
          if (user) {
            let arrVal = key === SpecialtyPlaceFields.isLiked.field ? user.savedPlaces : user.visitedPlaces
            if (!addFieldsStage[0]) addFieldsStage[0] = { '$addFields': {} }
            addFieldsStage[0]['$addFields'][key] = {
              $in: ['$place_id', arrVal]
            }
          }
          continue
        }

        for (let stageKey in SpecialtyPlaceFieldStageNames) {
          if (fields && !fields.includes(key)) continue
          let stage = SpecialtyPlaceFields[key].stages[stageKey]

          if (!addFieldsStage[0]) addFieldsStage[0] = { '$addFields': {} }
          if (stageKey === SpecialtyPlaceFieldStageNames.addFields) {
            addFieldsStage[0]['$addFields'][key] = stage['$addFields']
          }

          if (stageKey === SpecialtyPlaceFieldStageNames.lookup) {
            pipeline.push(stage)
          }

        }
      }
      // Tạo project stage cho các fields của place. Nếu như fields chỉ chứa các fields đặc biệt hoặc
      // là không có fields nào thì nó sẽ trả về rỗng.
      placeDetailsProjectionStage = createProjectionStage(getExpectedFieldsProjection(fields))
      pipeline.push(...addFieldsStage, ...placeDetailsProjectionStage)
      // console.log('MAP MODEL findOneWithPipeline (addFieldsStage): ', addFieldsStage[0]['$addFields']['content'])
      // console.log('MAP MODEL findOneWithPipeline (addFieldsStage): ', addFieldsStage[0]['$addFields']['reviews'])
      console.log('MAP MODEL findOneWithPipeline (pipeline): ', pipeline)
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
      if (INVALID_UPDATE_FILEDS.includes(fieldName)) {
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
  findOneById,
  findOneWithPipeline,
  findOneByPlaceId,
  findManyInLimit,
  findManyInLimitWithPipeline,
  createManyPlaces
}

