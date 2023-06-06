import Joi from 'joi'

import {
  PlaceFieldNameProps
} from 'types'

/**
 * @type {PlaceFieldNameProps}
 */
export const placeFields = {
  place_id: 'place_id',
  photos_id: 'photos_id',
  reviews_id: 'reviews_id',
  content_id: 'content_id',
  isRecommended: 'isRecommended',
  user_favorites_total: 'user_favorites_total',
  reference: 'reference',
  plus_code: 'plus_code',
  business_status: 'business_status',
  current_opening_hours: 'current_opening_hours',
  opening_hours: 'opening_hours',
  formatted_address: 'formatted_address',
  name: 'name',
  address_components: 'address_components',
  adr_address: 'adr_address',
  formatted_phone_number: 'formatted_phone_number',
  international_phone_number: 'international_phone_number',
  geometry: 'geometry',
  icon: 'icon',
  icon_background_color: 'icon_background_color',
  icon_mask_base_uri: 'icon_mask_base_uri',
  rating: 'rating',
  user_ratings_total: 'user_ratings_total',
  editorial_summary: 'editorial_summary',
  types: 'types',
  url: 'url',
  utc_offset: 'utc_offset',
  vicinity: 'vicinity',
  website: 'website',
  wheelchair_accessible_entrance: 'wheelchair_accessible_entrance',
  permanently_closed: 'permanently_closed',
  curbside_pickup: 'curbside_pickup',
  delivery: 'delivery',
  dine_in: 'dine_in',
  price_level: 'price_level',
  reservable: 'reservable',
  scope: 'scope',
  secondary_opening_hours: 'secondary_opening_hours',
  serves_beer: 'serves_beer',
  serves_breakfast: 'serves_breakfast',
  serves_brunch: 'serves_brunch',
  serves_dinner: 'serves_dinner',
  serves_lunch: 'serves_lunch',
  serves_vegetarian_food: 'serves_vegetarian_food',
  serves_wine: 'serves_wine',
  takeout: 'takeout',
  video_urls: 'video_urls',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
}

export const placeCollectionSchema = Joi.object({
  place_id: Joi.string().required(),
  // get _id in photos collection
  photos_id: Joi.string().default(null),
  // get _id in reviews collection
  reviews_id: Joi.string().default(null),
  // get _id in reviews collection
  content_id: Joi.string().default(null),

  isRecommended: Joi.boolean().default(false),
  user_favorites_total: Joi.number().default(0),

  reference: Joi.string().default(null),

  plus_code: Joi.object().default(null),

  business_status : Joi.string().default(null),

  current_opening_hours: Joi.object().default(null),
  opening_hours: Joi.object().default(null),
  // address name
  formatted_address : Joi.string().default(null),
  name : Joi.string().default(null),
  address_components: Joi.array().default(null),
  adr_address: Joi.string().default(null),

  // number phone
  formatted_phone_number : Joi.string().default(null),
  international_phone_number: Joi.string().default(null),

  geometry : Joi.object().default(null),


  // icons
  icon : Joi.string().default(null),
  icon_background_color : Joi.string().default(null),
  icon_mask_base_uri : Joi.string().default(null),

  // photos:
  // photos: Joi.array().default(null),

  rating: Joi.number().default(null),
  user_ratings_total: Joi.number().default(null),

  // reviews: Joi.array().default(null),
  editorial_summary: Joi.object().default(null),

  types: Joi.array().default(null),

  url: Joi.string().default(null),
  utc_offset: Joi.number().default(null),
  vicinity: Joi.string().default(null),
  website: Joi.string().default(null),
  wheelchair_accessible_entrance: Joi.boolean().default(null),
  permanently_closed : Joi.boolean().default(null),
  curbside_pickup: Joi.boolean().default(null),
  delivery: Joi.boolean().default(null),
  dine_in: Joi.boolean().default(null),
  price_level: Joi.number().default(null),
  reservable: Joi.boolean().default(null),
  scope: Joi.string().default(null),
  secondary_opening_hours: Joi.array().default(null),
  serves_beer: Joi.boolean().default(null),
  serves_breakfast: Joi.boolean().default(null),
  serves_brunch: Joi.boolean().default(null),
  serves_dinner: Joi.boolean().default(null),
  serves_lunch: Joi.boolean().default(null),
  serves_vegetarian_food: Joi.boolean().default(null),
  serves_wine: Joi.boolean().default(null),
  takeout: Joi.boolean().default(null),

  // video_url
  video_urls: Joi.array().default(null),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp().default(null)
})