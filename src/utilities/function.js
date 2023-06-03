import haversineDistance from 'haversine-distance'
import { cloneDeep } from 'lodash'

import { QueryValueSeperator } from './constants'

export const haverSineDistanceFormula = (coor1, coor2) => {
  return haversineDistance(coor1, coor2)
}

export const filterRadiusProminenceOrNearBy = (arrPlaceTextSearch, location, radius) => {
  // location = {
  //   lat: Number,
  //   lng: Number,
  // }
  let arrPlace = cloneDeep(arrPlaceTextSearch)
  let i = 0
  arrPlaceTextSearch.map((place, index) => {
    if (haverSineDistanceFormula(place.geometry.location, location) > radius) {
      i++
      arrPlace.splice(index, 1)
    }
  })

  return {
    isDeleteNextPageToken: i !== 0 ? true : false,
    arrPlace
  }
}

export const sortByStarHighToLow = (arrPlaceTextSearch) => {
  arrPlaceTextSearch.sort((a, b) => {
    return b.rating - a.rating
  })

  return arrPlaceTextSearch
}

export const sortByStarLowToHigh = (arrPlaceTextSearch) => {
  arrPlaceTextSearch.sort((a, b) => {
    return a.rating - b.rating
  })

  return arrPlaceTextSearch
}

export const sortByRatingLowToHigh = (arrPlaceTextSearch) => {
  arrPlaceTextSearch.sort((a, b) => {
    return a.user_ratings_total - b.user_ratings_total
  })

  return arrPlaceTextSearch
}

export const sortByRatingHighToLow = (arrPlaceTextSearch) => {

  arrPlaceTextSearch.sort((a, b) => {
    return b.user_ratings_total - a.user_ratings_total
  })

  return arrPlaceTextSearch
}