import axios from 'axios'
import { env } from '*/config/environtment'

// Phuong: https://developers.google.com/maps/documentation/places/web-service/search-text
const getDirectionsORS = async (params) => {
  // Phuong: params là object
  // Phuong: url mẫu:
  // https://api.openrouteservice.org/v2/directions/
  // driving-car
  // ?api_key=5b3ce3597851110001cf6248aea23ad2f8dc49c09e332eed8d6b4010
  // &start=8.681495,49.41461
  // &end=8.687872,49.420318

  let url_base = env.DIRECTION_ORS_BASE_URL

  let url = `${url_base}${params.profile}?api_key=${params.api_key}&start=${params.start[0]},${params.start[1]}&end=${params.end[0]},${params.end[1]}`

  console.log('url', url)

  const request = await axios.get(url)

  return request.data
}

export const OpenRouteServiceProvider = {
  getDirectionsORS
}