import express from 'express'
import { DirectionController } from '*/controllers/direction.controller'
import { DirectionValidation } from '*/validations/direction.validation'

const router = express.Router()

router.route('/route_direction')
  .post(DirectionController.getRouteDirection)

router.route('/chatgpt_itinerary')
  .post(DirectionController.getChatGptItinerary)
export const directionRoutes = router
