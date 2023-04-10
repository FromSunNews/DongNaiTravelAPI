import axios from 'axios'
import { env } from 'config/environtment'

// https://developers.google.com/maps/documentation/routes/reference/rest/v2/TopLevel/computeRoutes?hl=vi
const getComputeRoutesGCP = async (data) => {
  console.log('🚀 ~ file: RoutesGoogleMapProvider.js:6 ~ getComputeRoutesGCP ~ data:', data)
  /*
    body mẫu gửi đi :
    body = {
      "origin":{
      "placeId": "ChIJT-ATCrLddDER922xDm5jhmo"
      },
      "destination":{
      "placeId": "ChIJOTlgic1SaDERw0JmWgNPVS4"
      },
      "travelMode": "DRIVE",
      "routingPreference": "TRAFFIC_AWARE_OPTIMAL",
      "polylineQuality": "HIGH_QUALITY",
      "polylineEncoding": "ENCODED_POLYLINE",
      "computeAlternativeRoutes": true,
      "routeModifiers": {
        "avoidTolls": false,
        "avoidHighways": false,
        "avoidFerries": false
      },
      "extraComputations": [
        "TOLLS",
        "FUEL_CONSUMPTION",
        "TRAFFIC_ON_POLYLINE"
      ],
      "languageCode": "vi"
    }

    header mẫu
    header = {
      "Content-Type" : "application/json",
      "X-Goog-Api-Key": "YOUR_API_KEY",
      "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"
    }
  */
  try {
    let configAxios = {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': env.MAP_API_KEY,
        'X-Goog-FieldMask': 'routes'
      }
    }

    let body = {
      origin: data.origin,
      destination: data.destination,
      travelMode: data.mode,
      routingPreference: 'TRAFFIC_AWARE_OPTIMAL',
      polylineQuality: 'HIGH_QUALITY',
      polylineEncoding: 'ENCODED_POLYLINE',
      computeAlternativeRoutes: true,
      extraComputations: [
        'TOLLS',
        'FUEL_CONSUMPTION',
        'TRAFFIC_ON_POLYLINE'
      ],
      languageCode: data.languageCode ? data.languageCode : env.LANGUAGE_CODE_DEFAULT
    }

    if (data.routeModifiers) {
      body = {
        ...body,
        routeModifiers: data.routeModifiers
      }
    }

    if (data.mode === 'WALK' || data.mode === 'BICYCLE')
      delete body.routingPreference

    const request = await axios.post(env.COMPUTE_ROUTES_BASE_URL, body, configAxios)

    return request.data
  } catch (error) {
    throw new Error('Not found this route!')
  }


}

export const RoutesGoogleMapProvider = {
  getComputeRoutesGCP
}