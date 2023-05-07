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
  PlaceFindStages
} from 'utilities/mongo'


// Define Map collection
const mapCollectionName = 'maps'
const mapCollectionSchema = Joi.object({
  place_id: Joi.string().required(),
  // get _id in photos collection
  photos_id: Joi.string().default(null),
  // get _id in reviews collection
  reviews_id: Joi.string().default(null),
  // get _id in reviews collection
  content_id: Joi.string().default(null),

  isRecommended: Joi.boolean().default(false),
  numberOfVisited: Joi.number().default(0),

  reference: Joi.string().default(null),

  plus_code: Joi.object().default(null),

  business_status : Joi.string().default(null),

  current_opening_hours: Joi.object().default(null),
  opening_hours: Joi.object().default(null),
  // address name
  formatted_address : Joi.string().default(null),
  name : Joi.string().default(null),
  address_components: Joi.array().default(null),
  adr_address: Joi.string().default(null),

  // number phone
  formatted_phone_number : Joi.string().default(null),
  international_phone_number: Joi.string().default(null),

  geometry : Joi.object().default(null),


  // icons
  icon : Joi.string().default(null),
  icon_background_color : Joi.string().default(null),
  icon_mask_base_uri : Joi.string().default(null),

  // photos:
  // photos: Joi.array().default(null),

  rating: Joi.number().default(null),
  user_ratings_total: Joi.number().default(null),

  // reviews: Joi.array().default(null),
  editorial_summary: Joi.object().default(null),

  types: Joi.array().default(null),

  url: Joi.string().default(null),
  utc_offset: Joi.number().default(null),
  vicinity: Joi.string().default(null),
  website: Joi.string().default(null),
  wheelchair_accessible_entrance: Joi.boolean().default(null),
  permanently_closed : Joi.boolean().default(null),
  curbside_pickup: Joi.boolean().default(null),
  delivery: Joi.boolean().default(null),
  dine_in: Joi.boolean().default(null),
  price_level: Joi.number().default(null),
  reservable: Joi.boolean().default(null),
  scope: Joi.string().default(null),
  secondary_opening_hours: Joi.array().default(null),
  serves_beer: Joi.boolean().default(null),
  serves_breakfast: Joi.boolean().default(null),
  serves_brunch: Joi.boolean().default(null),
  serves_dinner: Joi.boolean().default(null),
  serves_lunch: Joi.boolean().default(null),
  serves_vegetarian_food: Joi.boolean().default(null),
  serves_wine: Joi.boolean().default(null),
  takeout: Joi.boolean().default(null),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp().default(null)
})

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
  return async (filter, fields, limit = 10, skip = 0) => {
    try {
      // Đầu tiên thì split cái filter ra bằng khoảng trắng;
      let filters = filter.split(' ')
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
        },
        {
          '$project': {
            ...getExpectedFieldsProjection(fields),
            'place_photos': {
              'photos': true
            }
          }
        },
        { '$skip': skip },
        { '$limit': limit }
      ]
      // console.log('Pipeline: ', pipeline)
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
  let specialtyFields = {
    reviews: {
      field: 'reviews',
      addFieldsStage:  { '$arrayElemAt': ['$reviews.reviews', 0] },
      lookupStage: {
        from: 'reviews',
        localField: 'place_id',
        foreignField: 'place_reviews_id',
        as: 'reviews'
      }
    },
    content: {
      field: 'content',
      addFieldsStage:  { '$arrayElemAt': ['$content', 0] },
      lookupStage: {
        from: 'content',
        localField: undefined,
        foreignField: undefined,
        as: 'content',
        options: {
          extras: {
            let: { pid: '$content_id' }
          },
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
                plainTextMarkFormat: true
              }
            }
          ]
        }
      }
    }
  }

  return async (data) => {
    try {
      // url chỉ nhận 2 query là placeId và fields
      let { placeId, fields } = data
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
      // Check xem trong fields có chứa các place đặc biệt hay không? Nếu có thì true, ngược lại là fail.
      let isContainOnlySpecialtyFields = fields.split(';').every(key => Boolean(specialtyFields[key]))

      for (let key in specialtyFields) {
        if (fields && fields.includes(key)) {
          /*
            Check xem nếu như trong fields có chứa content. Thì đầu tiên là thêm
            expression cho addFields stage. Tiếp theo là tạo lookup stage cho content.
            Cuối cùng là add lookup stage vào trong pipeline luôn. Add luôn ở đây là bởi vì
            nếu như không có thì addFields stage cũng sẽ là một mảng rỗng (với điều kiện là
            trong fields không có reviews).
          */
          if (!addFieldsStage[0]) addFieldsStage[0] = {
            '$addFields': {
              [specialtyFields[key].field]: specialtyFields[key].addFieldsStage
            }
          }
          // Nếu nhưng trong addFields stage có fields nào đó rồi thì chỉ cần thêm fields mới vào.
          else addFieldsStage[0]['$addFields'][specialtyFields[key].field] = specialtyFields[key].addFieldsStage
          let lookupStage = createLookupStage(
            specialtyFields[key].lookupStage.from,
            specialtyFields[key].lookupStage.localField,
            specialtyFields[key].lookupStage.foreignField,
            specialtyFields[key].lookupStage.as,
            specialtyFields[key].lookupStage.options
          )
          pipeline.push(lookupStage)
          if (isContainOnlySpecialtyFields) fields = fields.replace(new RegExp(`${specialtyFields[key].field};|${specialtyFields[key].field}`), '')
        }
      }

      console.log('MAP MODEL findOneWithPipeline (fields): ', fields)
      // Tạo project stage cho các fields của place. Nếu như fields chỉ chứa các fields đặc biệt hoặc
      // là không có fields nào thì nó sẽ trả về rỗng.
      placeDetailsProjectionStage = createProjectionStage(getExpectedFieldsProjection(fields))
      pipeline.push(...placeDetailsProjectionStage, ...addFieldsStage)
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

