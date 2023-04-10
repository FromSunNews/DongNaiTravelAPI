import haversineDistance from 'haversine-distance'
import { cloneDeep } from 'lodash'

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

/**
 * Hàm này nhận vào 2 tham số là `fields` và `seperator` (không bắt buộc), đều là string.
 * `fields` là một string có dạng `"field_1;field_2;...;field_n"`.
 *
 * Và hàm này sẽ trả về một object bao gồm các thuộc tính là field name được ngăn cách bởi
 * `seperator` trong `fields` với value là `true`.
 * @param {string} fields Là một chuỗi có dạng `"field_1;field_2;...;field_n"`.
 * @param {string} seperator Là chuỗi, ký tự ngăn cách giữa các field name.
 * @returns {{[key: string]: true}}
 *
 * @example
 * ...
 * let fields = "name;age;address"
 * // Output:
 * // {name: true, age: true, address: true}
 * console.log(getExpectedFieldsOption(fields));
 * ...
 */
export const getExpectedFieldsProjection = (fields, seperator = ';') => {
  if (!fields) return {}
  let fieldsArr = fields.split(seperator).map(field => [field, true])
  return Object.fromEntries(fieldsArr)
}