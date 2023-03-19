import axios from 'axios'
import { env } from '*/config/environtment'
import { MapApiStatus } from '../utilities/constants'

// Lấy place_id dựa trên tọa độ
async function getPlaceIdFromCoords(latitude, longitude) {
  try {
    const url = `${env.GEOCODING_BASE_URL}latlng=${latitude},${longitude}&key=${env.MAP_API_KEY}`
    console.log('🚀 ~ file: GeocodingGoogleMapProvider.js:8 ~ getPlaceIdFromCoords ~ url:', url)
    const response = await axios.get(url)

    if (response?.data?.status === 'OK') {
      return response.data.results[0].place_id
    }
    else
      throw new Error(MapApiStatus[response.data.status.status])
  } catch (error) {
    throw new Error('Error axios from getPlaceIdFromCoords!')
  }
}

// Lấy place_id dựa trên tên địa điểm
async function getPlaceIdFromAddress(address) {
  try {
    const url = `${env.GEOCODING_BASE_URL}address=${address}&key=${env.MAP_API_KEY}`
    console.log('🚀 ~ file: GeocodingGoogleMapProvider.js:18 ~ getPlaceIdFromAddress ~ url:', url)
    const response = await axios.get(url)

    if (response?.data?.status === 'OK') {
      return response.data.results[0].place_id
    }
    else
      throw new Error(MapApiStatus[response.data.status.status])

  } catch (error) {
    throw new Error('Error axios from getPlaceIdFromAddress!')
  }
}

export const GeocodingGoogleMapProvider = {
  getPlaceIdFromCoords,
  getPlaceIdFromAddress
}