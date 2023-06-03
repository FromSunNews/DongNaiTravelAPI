import Joi from 'joi'
import { HttpStatusCode } from 'utilities/constants'

const getText = async (req, res, next) => {
  const condition = Joi.object({
    question: Joi.string().required(),
    currentUserId: Joi.string().required(),
    languageCode: Joi.string().required(),
    coor: Joi.required()
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

export const ChatBotValidation = {
  getText
}
