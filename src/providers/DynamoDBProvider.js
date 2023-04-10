import axios from 'axios'
import { env } from 'config/environtment'

const getPlaceReviewsById = async (data) => {
  const request = await axios.get(`${env.PLACE_REVIEWS_API}`, data)
  return request.Result.Items[0]
}

const createPlaceReviews = async (data) => {
  const request = await axios.post(`${env.PLACE_REVIEWS_API}`, data)
  return request.Message
}

const updatePlaceReviewsById = async (data) => {
  const request = await axios.put(`${env.PLACE_REVIEWS_API}`, data)
  return request.Message
}

const deletePlaceReviewsById = async (data) => {
  const request = await axios.delete(`${env.PLACE_REVIEWS_API}`, data)
  return request.Message
}

const getPlacePhotosById = async (data) => {
  const request = await axios.get(`${env.PLACE_PHOTOS_API}`, data)
  return request.Result.Items[0]
}

const createPlacePhotos = async (data) => {
  const request = await axios.post(`${env.PLACE_PHOTOS_API}`, data)
  return request.Message
}

const updatePlacePhotosById = async (data) => {
  const request = await axios.put(`${env.PLACE_PHOTOS_API}`, data)
  return request.Message
}

const deletePlacePhotosById = async (data) => {
  const request = await axios.delete(`${env.PLACE_PHOTOS_API}`, data)
  return request.Message
}

const getPlaceTypesById = async (data) => {
  const request = await axios.get(`${env.PLACE_TYPES_API}`, data)
  return request.Result.Items[0]
}

const createAllPlaceTypes = async (data) => {
  const request = await axios.post(`${env.PLACE_TYPES_API}`, data)
  return request.Message
}

const updatePlaceTypesById = async (data) => {
  const request = await axios.put(`${env.PLACE_TYPES_API}`, data)
  return request.Message
}

const deletePlaceTypesById = async (data) => {
  const request = await axios.delete(`${env.PLACE_TYPES_API}`, data)
  return request.Message
}

export const DynamoDBProvider = {
  getPlaceReviewsById,
  createPlaceReviews,
  updatePlaceReviewsById,
  deletePlaceReviewsById,
  getPlacePhotosById,
  createPlacePhotos,
  updatePlacePhotosById,
  deletePlacePhotosById,
  getPlaceTypesById,
  createAllPlaceTypes,
  updatePlaceTypesById,
  deletePlaceTypesById
}