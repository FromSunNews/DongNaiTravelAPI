import axios from 'axios'
import { env } from '*/config/environtment'
import encodeUrl from 'encodeurl'

// Phuong: https://developers.google.com/maps/documentation/places/web-service/search-text
const getPlacesTextSearchAPI = async (params) => {
  // Phuong: params là object

  const urlFields = ['query', 'radius', 'rankby', 'language', 'location', 'maxprice', 'minprice', 'opennow', 'pagetoken', 'region', 'type', 'key']

  let url = env.PLACE_TEXT_SEARCH_BASE_URL

  urlFields.map(field => {
    // Phuong: url mẫu:
    // https://maps.googleapis.com/maps/api/place/textsearch/json
    // ?location=42.3675294%2C-71.186966
    // &query=123%20main%20street
    // &radius=10000
    // &key=YOUR_API_KEY

    // Phuong: TH query hoặc location thì phải chuyển sang url encode .Vd: dấu cách => %20, @ => %2C
    if (field === 'query') {
      url = url + field + '=' + encodeUrl(params[field])
    }
    else if (field === 'location') {
      url = url + field + '=' + params[field].latitude + '%2C' + params[field].longitude
    }
    // Phuong: Giải quyết TH nếu language là rổng thì sẽ cho mặc định là tiếng việt
    else if (!params[field] && field === 'language')
      url = url + field + '=' + env.LANGUAGE_CODE_DEFAULT + '&'
    // Phuong: Giải quyết TH nếu key
    else if (!params[field] && field === 'key')
      url = url + field + '=' + env.MAP_API_KEY
    else if (params[field])
      url = url + field + '=' + params[field]

    // Phuong: Cuối cùng phải thêm dấu &
    if (field !== 'key' && params[field])
      url = url +'&'
  })
  console.log('url', url)

  const request = await axios.get(url)

  // console.log('🚀 ~ file: PlacesSearchProvider.js:48 ~ getPlacesTextSearchAPI ~ request.data', request.data)
  return request.data
}

// Phuong: https://developers.google.com/maps/documentation/places/web-service/search-nearby
const getPlacesNearByAPI = async (params) => {
  // Phuong: params là object

  const urlFields = ['keyword', 'rankby', 'language', 'location', 'maxprice', 'minprice', 'opennow', 'pagetoken', 'type', 'key']

  let url = env.PLACE_TEXT_SEARCH_BASE_URL

  urlFields.map(field => {
    // Phuong: url mẫu:
    // https://maps.googleapis.com/maps/api/place/nearbysearch/json
    // ?keyword=cruise
    // &location=-33.8670522%2C151.1957362
    // &radius=1500
    // &type=restaurant
    // &key=YOUR_API_KEY

    // Phuong: TH query hoặc location thì phải chuyển sang url encode .Vd: dấu cách => %20, @ => %2C
    if (field === 'keyword') {
      url = url + field + '=' + encodeUrl(params[field])
    }
    else if (field === 'location') {
      url = url + field + '=' + params[field].latitude + '%2C' + params[field].longitude
    }
    // Phuong: Giải quyết TH nếu language là rổng thì sẽ cho mặc định là tiếng việt
    else if (!params[field] && field === 'language')
      url = url + field + '=' + env.LANGUAGE_CODE_DEFAULT + '&'
    // Phuong: Giải quyết TH nếu radius là rổng thì sẽ cho mặc định là 5km
    else if (!params[field] && field === 'rankby')
      url = url + field + '=' + + env.RADIUS_DEFAULT + '&'
    // Phuong: Giải quyết TH nếu key
    else if (!params[field] && field === 'key')
      url = url + field + '=' + env.MAP_API_KEY
    else if (params[field])
      url = url + field + '=' + params[field]

    // Phuong: Cuối cùng phải thêm dấu &
    if (field !== 'key' && params[field])
      url = url +'&'
  })
  console.log('url', url)

  const request = await axios.get(url)

  // console.log('🚀 ~ file: PlacesSearchProvider.js:48 ~ getPlacesTextSearchAPI ~ request.data', request.data)
  return request.data
}

// Phuong: https://developers.google.com/maps/documentation/places/web-service/details
const getPlaceDetailsAPI = async (params) => {
  // Phuong: params là object

  const urlFields = ['place_id', 'fields', 'language', 'region', 'reviews_no_translations', 'reviews_sort', 'sessiontoken', 'key']

  let url = env.PLACE_DETAILS_BASE_URL

  urlFields.map(field => {
    // Phuong: url mẫu:
    // https://maps.googleapis.com/maps/api/place/details/json
    // ?fields=name%2Crating%2Cformatted_phone_number
    // &place_id=ChIJN1t_tDeuEmsRUsoyG83frY4
    // &key=YOUR_API_KEY

    if (params[field] && field === 'fields') {
      url = url + field + '='
      params[field].map((item, index) => {
        // TH đây là phần tử đầu
        if (index === 0)
          url = url + item
        else
          url = url + '%2C' + item
      })
    }
    // Phuong: Giải quyết TH nếu language là rổng thì sẽ cho mặc định là tiếng việt
    else if (!params[field] && field === 'language')
      url = url + field + '=' + env.LANGUAGE_CODE_DEFAULT + '&'
    // Phuong: Giải quyết TH nếu key
    else if (!params[field] && field === 'key')
      url = url + field + '=' + env.MAP_API_KEY
    else if (params[field])
      url = url + field + '=' + params[field]

    // Phuong: Cuối cùng phải thêm dấu &
    if (field !== 'key' && params[field])
      url = url +'&'
  })
  // console.log('🚀 getPlaceDetailsAPI ~ url', url)

  const request = await axios.get(url)

  // console.log('🚀 ~ file: PlacesSearchProvider.js:48 ~ getPlacesTextSearchAPI ~ request.data', request.data)
  return request.data
}

// Phuong: https://developers.google.com/maps/documentation/places/web-service/photos
const getPlacePhotosAPI = async (params) => {
  // Phuong: params là object

  const urlFields = ['photo_reference', 'maxheight', 'maxwidth', 'key']

  let url = env.PLACE_PHOTOS_BASE_URL

  urlFields.map(field => {
    // Phuong: url mẫu:
    // https://maps.googleapis.com/maps/api/place/photo
    // ?maxwidth=400
    // &photo_reference=Aap_uEA7vb0DDYVJWEaX3O-AtYp77AaswQKSGtDaimt3gt7QCNpdjp1BkdM6acJ96xTec3tsV_ZJNL_JP-lqsVxydG3nh739RE_hepOOL05tfJh2_ranjMadb3VoBYFvF0ma6S24qZ6QJUuV6sSRrhCskSBP5C1myCzsebztMfGvm7ij3gZT
    // &key=YOUR_API_KEY


    if (!params[field] && field === 'maxwidth') {
      if (!params['maxheight'])
        url = url + field + '=' + env.WIDTH_PHOTO_DEFAULT + '&'
    }
    // Phuong: Giải quyết TH nếu key
    else if (!params[field] && field === 'key')
      url = url + field + '=' + env.MAP_API_KEY
    // Phuong: Các TH khác
    else if (params[field])
      url = url + field + '=' + params[field]

    // Phuong: Cuối cùng phải thêm dấu &
    if (field !== 'key' && params[field])
      url = url +'&'
  })
  // console.log('🚀 getPlaceDetailsAPI ~ url', url)

  const request = await axios.get(url)

  // console.log('🚀 ~ file: PlacesSearchProvider.js:48 ~ getPlacesTextSearchAPI ~ request.data', request.data)
  return request.data
}

export const PlacesSearchProvider = {
  getPlacesTextSearchAPI,
  getPlaceDetailsAPI,
  getPlacePhotosAPI,
  getPlacesNearByAPI
}