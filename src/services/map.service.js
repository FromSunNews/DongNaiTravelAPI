import { MapModel } from '*/models/map.model'

import { PlacesSearchProvider } from '../providers/PlacesSearchProvider'
import { SendMessageToSlack } from '../providers/SendMessageToSlack'
import { RedisQueueProvider } from '*/providers/RedisQueueProvider'

import { FilterConstants, MapApiStatus } from '../utilities/constants'
import axios from 'axios'
import { env } from '*/config/environtment'
import { Buffer } from 'buffer'
import { cloneDeep, sortBy } from 'lodash'
import { filterRadiusProminenceOrNearBy, sortByRatingHighToLow, sortByRatingLowToHigh, sortByStarHighToLow, sortByStarLowToHigh } from '../utilities/function'

const getPlacesTextSearch = async (data) => {
  console.log('🚀 ~ file: map.service.js:14 ~ getPlacesTextSearch ~ data', data)
  // data theo dạng {
  // type: string,
  // sortBy: string,
  // radius: string,
  // query: string,
  // location: {
  // latitude: number,
  // longitude: number
  // },

  // }
  try {
    const startTime = Date.now()
    let sortBy = data.sortBy
    delete data.sortBy

    if (sortBy === FilterConstants.sortBy.PROMINENCE) {
      // Xóa radius và thêm vào rankBy
      delete data.radius
      data.rankby = env.RANKBY_PROMINENCE
    } else if (sortBy === FilterConstants.sortBy.NEAR_BY) {
      // Xóa radius và thêm vào rankBy
      delete data.radius
      data.rankby = env.RANKBY_DISTANCE
    }

    const result = await PlacesSearchProvider.getPlacesTextSearchAPI(data)

    let places
    let nextPageToken

    if (result?.status === 'OK') {
      nextPageToken = result.next_page_token
      places = result.results
    }
    else
      throw new Error(MapApiStatus[result.status])

    // // Phuong: Nếu result chỉ có 1 phần tử thì làm theo cách thông thường
    // if (places.length === 1) {
    //   // Phuong: Check nó tồn tại chưa cái đã
    //   const existPlace = await MapModel.findOneByPlaceId(places[0].place_id)
    //   if (!existPlace) {
    //     // Phuong: oke lưu vào db thôi
    //     await MapModel.createNew(places[0])
    //   }
    // }
    // // Phuong:  Nếu có trên 2 phần tử thì cho nó chạy background job
    // else if (places.length > 1) {
    //   // Phuong:  Bước 1: Khởi tạo một hàng đợi để tạo nhiều places (dự kiến 20 results cho mỗi page)
    //   let createPlacesQueue = RedisQueueProvider.generateQueue('createPlacesQueue')
    //   // Phuong:  Bước 2: Định nghĩa ra những việc cần làm trong tiến trình hàng đợi
    //   createPlacesQueue.process(async (job, done) => {
    //     try {
    //       // Phuong:  job.data ở đây chính là places được truyền vào từ bước 4

    //       let placesDetails = []
    //       const placeIds = []
    //       job.data.map(place => placeIds.push(place.place_id))
    //       // console.log('🚀 ~ file: map.service.js:48 ~ createPlacesQueue.process ~ placeIds', placeIds)

    //       // Nó được gọi là parallel axios api
    //       // https://blog.logrocket.com/using-axios-all-make-concurrent-requests/
    //       axios.all(
    //         placeIds.map(async placeId => axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&language=vi&key=${env.MAP_API_KEY}`))
    //       ).then(
    //         async (datas) => {

    //           datas.map(async data => {
    //             const photosReference = []
    //             const profilePhotosReference = []

    //             let newPlace = data?.data?.result
    //             // Kiểm tra xem place_id nó có trong db hay chưa
    //             const existPlace = await MapModel.findOneByPlaceId(newPlace.place_id)
    //             if (!existPlace) {
    //               // Có thể xảy ra TH là không có photos nữa nên cần phải check kỹ
    //               if (data?.data?.result?.photos) {
    //                 data?.data?.result?.photos.map(photo => photosReference.push(photo.photo_reference))
    //                 // console.log('🚀 ~ file: map.service.js:60 ~ createPlacesQueue.process ~ photosReference', photosReference)

    //                 // https://blog.logrocket.com/using-axios-all-make-concurrent-requests/
    //                 await axios.all(
    //                   photosReference.map(async photoReference => axios.get(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${env.MAP_API_KEY}`, { responseType: 'arraybuffer' }))
    //                 ).then(
    //                   (datas) => {
    //                     let photos = []
    //                     datas.map(res => {
    //                       const urlBase64Decode = Buffer.from(res.data, 'binary').toString('base64')
    //                       photos.push(urlBase64Decode)
    //                     })
    //                     // console.log('🚀 ~ file: map.service.js:76 ~ createPlacesQueue.process ~ photos', photos)
    //                     // đã có photos thì đề lên thằng photo trong kết quả trả về
    //                     if (photos.length > 0) {
    //                       newPlace = {
    //                         ...newPlace,
    //                         photos: photos
    //                       }
    //                     }
    //                   }
    //                 )
    //               }

    //               if (data?.data?.result?.reviews) {
    //                 data?.data?.result?.reviews.map(review => profilePhotosReference.push(review.profile_photo_url))
    //                 // console.log('🚀 ~ file: map.service.js:60 ~ createPlacesQueue.process ~ profilePhotosReference', profilePhotosReference)

    //                 // https://blog.logrocket.com/using-axios-all-make-concurrent-requests/
    //                 await axios.all(
    //                   profilePhotosReference.map(async photoReference => axios.get(photoReference, { responseType: 'arraybuffer' }))
    //                 ).then(
    //                   (datas) => {
    //                     let photos = []
    //                     datas.map(res => {
    //                       const urlBase64Decode = Buffer.from(res.data, 'binary').toString('base64')
    //                       photos.push(urlBase64Decode)
    //                     })
    //                     // console.log('🚀 ~ file: map.service.js:76 ~ createPlacesQueue.process ~ photos', photos)
    //                     // đã có photos thì đề lên thằng photo trong kết quả trả về
    //                     if (photos.length > 0) {
    //                       photos.map((pt, index) => {
    //                         newPlace.reviews[index].profile_photo_url = pt
    //                       })
    //                     }
    //                   }
    //                 )
    //               }

    //               placesDetails.push(newPlace)
    //             } else {
    //               console.log('Place đã có ...')
    //             }
    //           })
    //         }
    //       )

    //       // Bây giờ lưu vào database với 1 mảng obj của placesDetails
    //       // Bởi vì mình đang call api 20 vòng lặp xong trong 20 vòng lặp, mỗi kết quả trả về lại call
    //       // tiếp 5 api (để lấy được ảnh dạng binary xong rồi chuyển nó về base64)
    //       // Vấn đề lớn nhất là khi call được 20 thằng place r, trong mỗi thằng place call api đến photo của nó nhưng nó cần thời gian để nạp photo về
    //       // 20 thằng place mỗi 1 place trung bình 5 photo v nó làm công việc call api 100 lần
    //       //  Vì v ở đây tui set thời gian là 10s để chạy cho 20 place và hơn 100 photo
    //       // Nếu không để 10s nó sẽ chạy nhưng photo không được chuyển về base64 :(((
    //       // Có cách nào hay hơn thì say me nha
    //       setTimeout(async () => {
    //         if (placesDetails.length > 0) {
    //           const placeDetailsCreated = await MapModel.createManyPlaces(placesDetails)
    //           done(null, placeDetailsCreated)
    //         } else {
    //           done(null, 'Tất cả các Place đều đã có trong db!')
    //         }
    //       }, 20000)
    //     } catch (error) {
    //       done(new Error('Error from createPlacesQueue.process'))
    //     }
    //   })
    //   // Phuong: B3: Check completed hoặc failed, tùy trường hợp yêu cầu mà cần cái event này, để bắn thông báo khi job chạy xong chẳng hạn
    //   // Phuong: Nhiều event khác: https:// Phuong: github.com/OptimalBits/bull/blob/HEAD/REFERENCE.md#events
    //   createPlacesQueue.on('completed', (job, result) => {
    //     // Phuong  Bắn kết quả về Slack
    //     SendMessageToSlack.sendToSlack(`Job với id là: ${job.id} và tên job: *${job.queue.name}* đã *xong* và kết quả là: ${result}> Tác vụ hoàn thành trong ${ Date.now() - startTime}s`)
    //   })

    //   createPlacesQueue.on('failed', (job, error) => {
    //     // Phuong: Bắn lỗi về Slack hoặc Telegram ...
    //     SendMessageToSlack.sendToSlack(`Notification: Job với id là ${job.id} và tên job là *${job.queue.name}* đã bị *lỗi* \n\n ${error}`)
    //   })

    //   // Phuong: Bước 4: bước quan trọng cuối cùng: Thêm vào vào đợi Redis để xử lý
    //   createPlacesQueue.add(places, {
    //     attempts: 0, // Phuong: số lần thử lại nếu lỗi
    //     backoff: 5000 // Phuong: khoảng thời gian delay giữa các lần thử lại job
    //   })
    // }

    let photosToReturn = []

    // vì các tác vụ background job được chạy sau khi data trả về cho người dùng, và dữ liệu sẽ được lấy từ places
    // nếu thằng places bị biến đổi thì thằng background job này sẽ lấy dữ liệu bị biến đổi đó đem đi xử lý
    // do mình muốn dùng dữ liệu cũ nên phải cloneDeep dữ liệu khi trả về
    let placesClone = cloneDeep(places)

    placesClone.map(place => place.photos && photosToReturn.push(place.photos[0].photo_reference))
    // console.log('🚀 ~ file: map.service.js:32 ~ getPlacesTextSearch ~ photosToReturn', photosToReturn)

    // https://blog.logrocket.com/using-axios-all-make-concurrent-requests/
    await axios.all(
      photosToReturn.map(async photo => axios.get(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo}&key=${env.MAP_API_KEY}`, { responseType: 'arraybuffer' }))
    ).then(
      (datas) => {
        let photos = []
        datas.map(res => {
          const urlBase64Decode = Buffer.from(res.data, 'binary').toString('base64')
          photos.push(urlBase64Decode)
        })

        placesClone.map((place) => {
          if (photos.length === 0)
            return
          if (place.photos) {
            place.photos = [photos[0]]
            photos.shift()
          }
        })
      }
    )

    const location = {
      lat: data.location.latitude,
      lng: data.location.longitude
    }

    if (sortBy === FilterConstants.sortBy.PROMINENCE || sortBy === FilterConstants.sortBy.NEAR_BY) {
      const resultFilterRadius = filterRadiusProminenceOrNearBy(placesClone, location, parseInt(data.radius))
      placesClone = resultFilterRadius.arrPlace
      if (resultFilterRadius.isDeleteNextPageToken)
        nextPageToken = null
    } else if (sortBy === FilterConstants.sortBy.STAR_LOW_TO_HIGH) {
      placesClone = sortByStarLowToHigh(placesClone)
    } else if (sortBy === FilterConstants.sortBy.STAR_HIGH_TO_LOW) {
      placesClone = sortByStarHighToLow(placesClone)
    } else if (sortBy === FilterConstants.sortBy.RATING_LOW_TO_HIGH) {
      placesClone = sortByRatingLowToHigh(placesClone)
    } else if (sortBy === FilterConstants.sortBy.RATING_HIGH_TO_LOW) {
      placesClone = sortByRatingHighToLow(placesClone)
    }

    return {
      arrPlace: placesClone,
      nextPageToken: nextPageToken
    }

  } catch (error) {
    throw new Error(error)
  }
}

const getPlaceDetails = async (data) => {
  // data có dạng:
  // data = {
  //   placeId: 'XXXXXXXXXX'
  // }
  try {
    let placeTranform
    // Kiểm tra trong database xem có place_id này chưa
    const existPlace = await MapModel.findOneByPlaceId(data.placeId)
    if (!existPlace) {
      // Lấy dữ về place details trên google map
      const result = await PlacesSearchProvider.getPlaceDetailsAPI({
        place_id: data.placeId
      })

      placeTranform = result.result

      // Biến đổi các photo có Db thành img64
      // Có thể xảy ra TH là không có photos nữa nên cần phải check kỹ
      if (placeTranform.photos) {
        let photosReference = []

        placeTranform.photos.map(photo => photosReference.push(photo.photo_reference))

        // https://blog.logrocket.com/using-axios-all-make-concurrent-requests/
        await axios.all(
          photosReference.map(async photoReference => axios.get(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${env.MAP_API_KEY}`, { responseType: 'arraybuffer' }))
        ).then(
          (datas) => {
            let photos = []
            datas.map(res => {
              const urlBase64Decode = Buffer.from(res.data, 'binary').toString('base64')
              photos.push(urlBase64Decode)
            })
            if (photos.length > 0)
              placeTranform.photos = photos
          }
        )
      }

      if (placeTranform.reviews) {
        let profilePhotosReference = []
        placeTranform.reviews.map(review => profilePhotosReference.push(review.profile_photo_url))

        // https://blog.logrocket.com/using-axios-all-make-concurrent-requests/
        await axios.all(
          profilePhotosReference.map(async photoReference => axios.get(photoReference, { responseType: 'arraybuffer' }))
        ).then(
          (datas) => {
            let photos = []
            datas.map(res => {
              const urlBase64Decode = Buffer.from(res.data, 'binary').toString('base64')
              photos.push(urlBase64Decode)
            })
            // console.log('🚀 ~ file: map.service.js:76 ~ createPlacesQueue.process ~ photos', photos)
            // đã có photos thì đề lên thằng photo trong kết quả trả về
            if (photos.length > 0) {
              photos.map((pt, index) => {
                placeTranform.reviews[index].profile_photo_url = pt
              })
            }
          }
        )
      }
      // Phuong: oke lưu vào db thôi. Không cần đợi
      // MapModel.createNew(placeTranform)
    } else {
      placeTranform = existPlace
    }
    // Sau đó trả về cho user thoy
    return placeTranform

  } catch (error) {
    // console.log(error)
    throw new Error(error)
  }
}

export const MapService = {
  getPlacesTextSearch,
  getPlaceDetails
}
