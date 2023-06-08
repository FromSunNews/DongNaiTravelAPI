
import { env } from 'config/environtment'
import axios from 'axios'
import { GeocodingGoogleMapProvider } from './GeocodingGoogleMapProvider'

// https://openweathermap.org/current#data
const getWeatherCurrent = async (coor) => {
  // coor = {
  //   longitude: '',
  //   latitude: ''
  // }
  try {
    const params = {
      lat: coor.latitude,
      lon: coor.longitude,
      units: 'metric',
      lang: env.LANGUAGE_CODE_DEFAULT,
      appid: env.OPEN_WEATHER_API_KEY
    }
    const response = await axios.get(`${env.OPEN_WEATHER_BASE_URL}/data/2.5/weather`, { params })
    return response.data
  } catch (error) {
    throw new Error(`Error in getMessage: ${error.message}`)
  }
}

// https://openweathermap.org/forecast5
const getWeatherForecast = async (coor) => {
  // coor = {
  //   longitude: '',
  //   latitude: ''
  // }
  try {
    const params = {
      lat: coor.latitude,
      lon: coor.longitude,
      units: 'metric',
      cnt: 40, // number of list (maximum 40 item ~ 5 days)
      lang: env.LANGUAGE_CODE_DEFAULT,
      appid: env.OPEN_WEATHER_API_KEY
    }
    const response = await axios.get(`${env.OPEN_WEATHER_BASE_URL}/data/2.5/forecast`, { params })
    return response.data
  } catch (error) {
    throw new Error(`Error in getMessage: ${error.message}`)
  }
}

// https://openweathermap.org/forecast5
const getWeatherForecastByCity = async (address) => {
  // coor = {
  //   longitude: '',
  //   latitude: ''
  // }
  const params = {
    q: address,
    units: 'metric',
    cnt: 40, // number of list (maximum 40 item ~ 5 days)
    lang: env.LANGUAGE_CODE_DEFAULT,
    appid: env.OPEN_WEATHER_API_KEY
  }
  const response = await axios.get(`${env.OPEN_WEATHER_BASE_URL}/data/2.5/forecast`, { params })
  return response.data
}

// https://openweathermap.org/api/geocoding-api#reverse
const getGeocodingReverse = async (coor) => {
  // coor = {
  //   longitude: '',
  //   latitude: ''
  // }
  try {
    const params = {
      lat: coor.latitude,
      lon: coor.longitude,
      limit: 1,
      appid: env.OPEN_WEATHER_API_KEY
    }
    const response = await axios.get(`${env.OPEN_WEATHER_BASE_URL}/geo/1.0/reverse`, { params })

    console.log('🚀 ~ file: OpenWeatherProvider.js:67 ~ getGeocodingReverse ~ response.data[0].name:', response.data[0].name)
    return {
      name: response.data[0].name
    }
  } catch (error) {
    throw new Error(`Error in getMessage: ${error.message}`)
  }
}


// https://openweathermap.org/api/geocoding-api#reverse
const getGeocodingDirect = async (address) => {
  // coor = {
  //   longitude: '',
  //   latitude: ''
  // }
  try {
    const params = {
      q: address,
      limit: 1,
      appid: env.OPEN_WEATHER_API_KEY
    }
    const response = await axios.get(`${env.OPEN_WEATHER_BASE_URL}/geo/1.0/direct`, { params })

    console.log('🚀 ~ file: OpenWeatherProvider.js:67 ~ getGeocodingReverse ~ response.data[0].name:', response.data[0].name)
    return {
      name: response.data[0].name,
      coor: {
        longitude: response.data[0].lon,
        latitude: response.data[0].lat
      }
    }
  } catch (error) {
    // Lỗi thì qua geocoding của googlemap
    const response = GeocodingGoogleMapProvider.getPlaceIdFromAddress(address)
    return {
      name: response.formatted_address,
      coor: {
        longitude: response.geometry.location.lng,
        latitude: response.geometry.location.lat
      }
    }
  }
}
export const OpenWeatherProvider = {
  getWeatherCurrent,
  getWeatherForecast,
  getGeocodingReverse,
  getWeatherForecastByCity,
  getGeocodingDirect
}
