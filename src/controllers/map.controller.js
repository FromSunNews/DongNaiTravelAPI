import { HttpStatusCode } from '*/utilities/constants'
import { MapService } from '*/services/map.service'
import { env } from '*/config/environtment'

const getPlacesTextSearch = async (req, res) => {
  try {
    const result = await MapService.getPlacesTextSearch(req.body)
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
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const getDirectionsORS = async (req, res) => {
  try {
    const result = await MapService.getDirectionsORS(req.body)
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
  getPlacesTextSearch,
  privateKeys,
  getPlaceDetails,
  getDirectionsORS
  // createNew,
  // update,
}
