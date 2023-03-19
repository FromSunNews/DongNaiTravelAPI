import express from 'express'
import { MapController } from '*/controllers/map.controller'
import { MapValidation } from '*/validations/map.validation'

const router = express.Router()

router.route('/places_text_search')
  .post(MapValidation.getPlacesTextSearch, MapController.getPlacesTextSearch)

router.route('/place_details')
  .post(MapController.getPlaceDetails)

router.route('/ors_directions')
  .post(MapController.getDirectionsORS)

router.route('/private_keys')
  .get(MapController.privateKeys)


export const mapRoutes = router
