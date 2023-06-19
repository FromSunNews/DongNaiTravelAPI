import Joi from 'joi'

export const blogContentFields = {
  plainText: 'plainText',
  plainTextMarkFormat: 'plainTextMarkFormat',
  speech: 'speech',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
}

export const blogContentCollectionSchema = Joi.object({
  [blogContentFields.plainText]: Joi.string().default(''),
  [blogContentFields.plainTextMarkFormat]: Joi.string().default(''),
  [blogContentFields.speech]: Joi.object().default(null),
  [blogContentFields.createdAt]: Joi.date().timestamp('javascript').default(Date.now),
  [blogContentFields.updatedAt]: Joi.date().timestamp().default(null)
})