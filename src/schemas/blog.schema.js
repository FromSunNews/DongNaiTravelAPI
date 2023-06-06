import Joi from 'joi'

import {
  BlogFieldNameProps
} from 'types'


/**
 * @type {BlogFieldNameProps}
 */
export const blogFields = {
  authorId: 'authorId',
  reviewIds: 'reviewIds',
  contentId: 'contentId',
  name: 'name',
  avatar: 'avatar',
  userFavoritesTotal: 'userFavoritesTotal',
  userCommentsTotal: 'userCommentsTotal',
  type: 'type',
  readTime: 'readTime',
  mentionedPlaces: 'mentionedPlaces',
  isApproved: 'isApproved',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
}

export const blogCollectionSchema = Joi.object({
  [blogFields.authorId]: Joi.string().required(),
  [blogFields.reviewIds]: Joi.array().items(Joi.string()).default([]),
  [blogFields.contentId]: Joi.string().required(),
  [blogFields.name]: Joi.string().required(),
  [blogFields.avatar]: Joi.string().required(),
  [blogFields.userFavoritesTotal]: Joi.number().default(0),
  [blogFields.userCommentsTotal]: Joi.number().default(0),
  [blogFields.type]: Joi.string().required(),
  [blogFields.readTime]: Joi.number().required(),
  [blogFields.mentionedPlaces]: Joi.array().items(Joi.string()).default([]),
  [blogFields.isApproved]: Joi.boolean().default(false),
  [blogFields.createdAt]: Joi.date().timestamp('javascript').default(Date.now),
  [blogFields.updatedAt]: Joi.date().timestamp().default(null)
})