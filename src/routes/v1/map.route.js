import express from 'express'
import { MapController } from 'controllers/map.controller'
import { MapValidation } from 'validations/map.validation'

const router = express.Router()

router.route('/places')
  .post(MapController.getPlaces)

router.route('/places_text_search')
  .post(MapValidation.getPlacesTextSearch, MapController.getPlacesTextSearch)

router.route('/place_details')
  .post(MapController.getPlaceDetails)

router.route('/private_keys')
  .get(MapController.privateKeys)

router.route('/weather_current')
  .post(MapController.getWeatherCurrent)

router.route('/weather_forecast')
  .post(MapController.getWeatherForecast)

router.route('/geocoding_reverse')
  .post(MapController.getGeocodingReverse)


export const mapRoutes = router
