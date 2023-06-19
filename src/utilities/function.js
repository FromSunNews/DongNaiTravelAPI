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

/**
 * Hàm này dùng dể remove một prop nào đó ra khỏi `obj`, mà các tên của prop đó được
 * khai báo trong `propName`. Hàm này chỉ giúp xoá các prop ở level = 1 (depth = 1)
 * @param {[key: any]: any} obj Object cần được xoá.
 * @param {Array<string>} propName Một mảng các propName cần được xoá trong `obj`
 */
export const removePropsFromObj = (obj, propName) => {
  let clone = cloneDeep(obj)

  Object.keys(clone).forEach(fieldName => {
    if (propName.includes(fieldName)) {
      delete clone[fieldName]
    }
  })
  return clone
}

/**
 * __Only use for test API and Socket__
 *
 * Hàm này dùng để giải lập một tác vụ nào đó `callBack` trong thời gian `timeout`.
 * Dùng để test API hoặc là socket.
 *
 * Tại sao `wait` lại thực hiện được hành vi như vậy thì là do tính chất của Promise + setTimeout thôi. Khi mình tạo một promise
 * thì mình phải cung cấp cho nó một function (callback) bao gồm 2 inputs là resolve và reject. Khi tạo promise,
 * thì callBack này sẽ được thực thi. Sau khi thực thi xong callBack thì nó trả về promise (không biết còn làm gì khác không).
 * Và để ý khi mình dùng promise, thì mình dùng `.then()` hoặc là `await` để lấy dữ liệu. Vậy thì `promise` đang chờ cái gì đây?
 * Nó đang chờ thằng `resolve` hoặc `reject` được thực thi. Khi thực thi xong thì việc `await` coi như xong, hoặc `.then()` nhận được
 * dữ liệu từ `resolve` với `.catch()` thì là `reject`. Cộng với tính chât của `setTimeout()`, sau khoảng `timeout` đợi thì callBack của
 * `setTimeout` được thực thi, trong đó nó sẽ chạy `resolve` (trong `wait` thì là `res`).
 * @param {() => any} callBack Callback thực hiện bất cứ việc gì.
 * @param {number} timeout Thời gian mà callBack đó thực hiện.
 * @returns
 *
 * @example
 * ```js
 *  // Copy đống code này vào console của browser hoặc đâu đó hỗ trợ JS để xem ví dụ này
 *  (async function() {
 *    let res1 = await wait(() => {
 *      return "Hello"
 *    }, 1000);
 *
 *    console.log(res1);
 *
 *    let res2 = await wait(() => {
 *      return "From"
 *    }, 2000);
 *
 *    console.log(res2);
 *
 *    let res3 = await wait(() => {
 *      return "Tuan"
 *    }, 2000);
 *
 *    console.log(res3);
 *  })();
 * ```
 */
export const wait = (callBack, timeout) => {
  return new Promise((res) => {
    setTimeout(() => {
      // Promise đang `await` res() thực thi.
      res(callBack())
    }, timeout)
  })
}