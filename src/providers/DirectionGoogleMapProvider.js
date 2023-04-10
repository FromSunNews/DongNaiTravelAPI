import axios from 'axios'
import { env } from 'config/environtment'
import encodeUrl from 'encodeurl'

// Phuong: https://developers.google.com/maps/documentation/places/web-service/search-text
const getRouteDirectionAPI = async (params) => {
  // Phuong: params là object

  const urlFields = ['origin', 'destination', 'alternatives', 'arrival_time', 'avoid', 'departure_time', 'language', 'mode', 'region', 'traffic_model', 'transit_mode', 'transit_routing_preference', 'units', 'waypoints', 'key']

  let url = env.DIRECTION_GCP_BASE_URL

  urlFields.map(field => {
    // Phuong: url mẫu:
    // https://maps.googleapis.com/maps/api/directions/json
    // ?avoid=highways
    // &destination=Montreal
    // &mode=bicycling
    // &origin=Toronto
    // &key=YOUR_API_KEY

    // Phuong: *TH origin hoaặc destination thì phải chuyển thành string trước khi chuyền sang đây

    if (!params[field] && field === 'language')
      url = url + field + '=' + env.LANGUAGE_CODE_DEFAULT + '&'
    // Phuong: chỉ nhiều hơn 1 đường đi
    if (!params[field] && field === 'alternatives')
      url = url + field + '=true&'
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

  // console.log('🚀 ~ file: PlacesSearchProvider.js:48 ~ getRouteDirectionAPI ~ request.data', request.data)
  return request.data
}

export const DirectionGoogleMapProvider = {
  getRouteDirectionAPI
}