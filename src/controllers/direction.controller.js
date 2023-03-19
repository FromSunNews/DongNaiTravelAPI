import { HttpStatusCode } from '*/utilities/constants'
import { DirectionService } from '*/services/direction.service'

const getRouteDirection = async (req, res) => {
  try {
    const result = await DirectionService.getRouteDirection(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const getChatGptItinerary = async (req, res) => {
  try {
    const result = await DirectionService.getChatGptItinerary(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

export const DirectionController = {
  getRouteDirection,
  getChatGptItinerary
}
