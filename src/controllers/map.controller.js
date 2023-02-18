import { HttpStatusCode } from '*/utilities/constants'
import { MapService } from '*/services/map.service'
import { env } from '*/config/environtment'
import encodeUrl from 'encodeurl'
import { PlacesSearchProvider } from '../providers/PlacesSearchProvider'
import { SendMessageToSlack } from '../providers/SendMessageToSlack'
import { CloudinaryProvider } from '../providers/CloudinaryProvider'

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
      map_api_key: env.MAP_API_KEY
    })

    // const result = await PlacesSearchProvider.getPlacePhotosAPI({
    //   photo_reference :'Aap_uEA7vb0DDYVJWEaX3O-AtYp77AaswQKSGtDaimt3gt7QCNpdjp1BkdM6acJ96xTec3tsV_ZJNL_JP-lqsVxydG3nh739RE_hepOOL05tfJh2_ranjMadb3VoBYFvF0ma6S24qZ6QJUuV6sSRrhCskSBP5C1myCzsebztMfGvm7ij3gZT'
    // })
    // console.log('privateKeys: ', env.MAP_API_KEY)
    // console.log('result: ', result)
    // SendMessageToSlack.sendToSlack('result:' + result)
    // const buffer = new Buffer(result, 'binary')
    // await CloudinaryProvider.streamUpload(buffer, 'users')

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
  privateKeys
  // createNew,
  // update,
}
