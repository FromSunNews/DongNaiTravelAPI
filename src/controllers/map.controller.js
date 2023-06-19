import { Request, Response } from 'express'
import { HttpStatusCode } from 'utilities/constants'
import { MapService } from 'services/map.service'
import { env } from 'config/environtment'

/**
 * @param {Request} req Object chứa headers và body của HTTPRequest.
 * @param {Response} res Object chứa headers và payload của HTTPResponse.
 * @returns
 */
const getPlaces = async (req, res) => {
  try {
    let result = await MapService.getPlacesWithPipeline(req.query)
    return res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const getPlaceDetailsWithPipeline = async (req, res) => {
  try {
    // console.log('MAP CONTROLLER, getPlaceDetailsWithPipeline: ', req.query)
    let result = await MapService.getPlaceDetailWithPipeline(req.query)
    return res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const getPlacesTextSearch = async (req, res) => {
  try {
    const result = await MapService.getPlacesTextSearch(req.body)
    console.log('🚀 ~ file: map.controller.js:8 ~ getPlacesTextSearch ~ result:', result)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const privateKeys = async (req, res) => {
  try {
    res.status(HttpStatusCode.OK).json({
      map_api_key: env.MAP_API_KEY,
      ors_api_key: [ env.ORS_API_KEY1 ]
    })
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const getPlaceDetails = async (req, res) => {
  try {
    const result = await MapService.getPlaceDetails(req.body)
    console.log('====================================================================================================================================\n', result.place_id)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const getWeatherCurrent = async (req, res) => {
  try {
    const result = await MapService.getWeatherCurrent(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const getWeatherForecast = async (req, res) => {
  try {
    const result = await MapService.getWeatherForecast(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const getGeocodingReverse = async (req, res) => {
  try {
    const result = await MapService.getGeocodingReverse(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const getPlacesById = async (req, res) => {
  try {
    const result = await MapService.getPlacesById(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

// const createNew = async (req, res) => {
//   try {
//     const result = await MapService.createNew(req.body)
//     res.status(HttpStatusCode.OK).json(result)
//   } catch (error) {
//     res.status(HttpStatusCode.INTERNAL_SERVER).json({
//       errors: error.message
//     })
//   }
// }

// const update = async (req, res) => {
//   try {
//     const mapId = req.jwtDecoded._id
//     const mapAvatarFile = req.file
//     const result = await MapService.update(mapId, req.body, mapAvatarFile)

//     res.status(HttpStatusCode.OK).json(result)
//   } catch (error) {
//     res.status(HttpStatusCode.INTERNAL_SERVER).json({
//       errors: error.message
//     })
//   }
// }

export const MapController = {
  getPlaces,
  getPlaceDetailsWithPipeline,
  getPlacesTextSearch,
  privateKeys,
  getPlaceDetails,
  getWeatherCurrent,
  getWeatherForecast,
  getGeocodingReverse,
  getPlacesById
  // createNew,
  // update,
}
