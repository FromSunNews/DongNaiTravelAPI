import Joi from 'joi'
import { HttpStatusCode } from 'utilities/constants'

const routeDirection = async (req, res, next) => {
  const condition = Joi.object({
    // 'query', 'radius', 'language', 'location', 'maxprice', 'minprice', 'opennow', 'pagetoken', 'region', 'type', 'key'
    start: Joi.string().required().min(2).max(50).trim(),
    end: Joi.string().required().min(3).max(5).trim(),
    location: Joi.object().required(),
    maxprice: Joi.string().trim(),
    minprice: Joi.string().trim(),
    opennow: Joi.string().trim(),
    pagetoken: Joi.string().trim(),
    type: Joi.string().min(2).max(50).trim(),
    sortBy: Joi.string().min(2).max(50).trim()
  })
  try {
    await condition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      errors: new Error(error).message
    })
  }
}

export const MapValidation = {
  routeDirection
}
