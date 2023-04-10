import Joi from 'joi'
import { HttpStatusCode } from 'utilities/constants'

const routeContent = async (req, res, next) => {
  const condition = Joi.object({
    plainText: Joi.string().trim(),
    plainTextBase64: Joi.string().trim(),
    plainTextMarkFormat: Joi.string().trim()
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
  routeContent
}
