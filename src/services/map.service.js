import { MapModel } from 'models/map.model'

import { PlacesSearchProvider } from 'providers/PlacesSearchProvider'
import { SendMessageToSlack } from 'providers/SendMessageToSlack'
import { RedisQueueProvider } from 'providers/RedisQueueProvider'

import { FilterConstants, MapApiStatus } from 'utilities/constants'
import { getExpectedFieldsProjection } from 'utilities/function'
import axios from 'axios'
import { env } from 'config/environtment'
import { Buffer } from 'buffer'
import { cloneDeep, sortBy } from 'lodash'
import { filterRadiusProminenceOrNearBy, sortByRatingHighToLow, sortByRatingLowToHigh, sortByStarHighToLow, sortByStarLowToHigh } from 'utilities/function'
import { OpenRouteServiceProvider } from 'providers/OpenRouteServiceProvider'
import { CloudinaryProvider } from 'providers/CloudinaryProvider'
import { PhotosModel } from 'models/photos.model'
import { ReviewsModel } from 'models/reviews.model'
import { OpenWeatherProvider } from 'providers/OpenWeatherProvider'

/**
 * @typedef GetPlacesServiceProps
 * @property {number} limit
 * @property {number} skip
 * @property {string} fields
 */

/**
 * Service này dùng để lấy ra tất cả các places, tuy nhiên là nên dùng nó để lấy một số lượng
 * có hạn nào đó thôi.
 * @param {GetPlacesServiceProps} data Là một object lấy từ `req.query`.
 * @returns {Promise<WithId<Document>[] | undefined>}
 */
const getPlaces = async (data) => {
  // Data của thằng này nó là query, không phải body.
  /*
    query = {
      filter: "" Cái này rỗng bởi vì mình đang cần tìm tất cả. Nếu có thì chỉ có sort by thôi.
      limit: 10,
      skip: 0,
      fields: "name;plus_code"
    }
  */
  try {
    let { limit, skip, fields } = data
    console.log(data)
    let places = await MapModel.findManyInLimit({}, getExpectedFieldsProjection(fields), parseInt(limit), parseInt(skip))
    return places
  } catch (error) {
    return undefined
  }
}

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

    // Phuong: Nếu result chỉ có 1 phần tử thì làm theo cách thông thường
    if (places.length === 1) {
      // Phuong: Check nó tồn tại chưa cái đã
      const existPlace = await MapModel.findOneByPlaceId(places[0].place_id)
      if (!existPlace) {
        // Phuong: oke lưu vào db thôi
        await MapModel.createNew(places[0])
      }
    }
    // Phuong:  Nếu có trên 2 phần tử thì cho nó chạy background job
    else if (places.length > 1) {
      try {
        // Phuong:  Bước 1: Khởi tạo một hàng đợi để tạo nhiều places (dự kiến 20 results cho mỗi page)
        let createPlacesQueue = RedisQueueProvider.generateQueue('createPlacesQueue')
        // Phuong:  Bước 2: Định nghĩa ra những việc cần làm trong tiến trình hàng đợi
        createPlacesQueue.process(async (job, done) => {
          try {
          // Phuong:  job.data ở đây chính là places được truyền vào từ bước 4

            let placesDetails = []
            const placeIds = []
            job.data.map(place => placeIds.push(place.place_id))
            // console.log('🚀 ~ file: map.service.js:48 ~ createPlacesQueue.process ~ placeIds', placeIds)

            // Nó được gọi là parallel axios api
            // https://blog.logrocket.com/using-axios-all-make-concurrent-requests/
            // Gọi hết api place details thông qua các placeId bằng cách gọi tiến trình song song
            axios.all(
              placeIds.map(placeId => axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&language=vi&key=${env.MAP_API_KEY}`))
            ).then(datas => {

              datas.map(async data => {
                const photosReference = []
                const profilePhotosReference = []

                let newPlace = data?.data?.result

                // Kiểm tra xem place_id nó có trong db hay chưa
                const existPlace = await MapModel.findOneByPlaceId(newPlace.place_id)
                console.log('🚀 ~ file: map.service.js:96 ~ createPlacesQueue.process ~ newPlace.place_id:', newPlace.place_id)
                if (!existPlace) {
                // Có thể xảy ra TH là không có photos nữa nên cần phải check kỹ
                // Xóa thằng photos trong newPlace
                  const photosClone = cloneDeep(data?.data?.result?.photos)
                  delete newPlace.photos
                  if (photosClone) {

                    photosClone.map(photo => photosReference.push({
                      height: Math.floor(photo.height),
                      width: Math.floor(photo.width),
                      photo_reference: photo.photo_reference
                    }))
                    // console.log('🚀 ~ file: map.service.js:60 ~ createPlacesQueue.process ~ photosReference', photosReference)

                    // https://blog.logrocket.com/using-axios-all-make-concurrent-requests/
                    // gọi tiến trình song để lấy loạt dữ liệu của photos
                    await axios.all(
                      photosReference.map(photoReference => axios.get(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=${photoReference.width}&maxheight=${photoReference.height}&photo_reference=${photoReference.photo_reference}&key=${env.MAP_API_KEY}`, { responseType: 'arraybuffer' }))
                    ).then(
                      async (datas) => {
                        let photoBuffers = []
                        datas.map(res => photoBuffers.push(res.data))
                        console.log('số photos của place photos buffer:', photoBuffers.length)

                        let resPhotos = await CloudinaryProvider.streamUploadMutiple(photoBuffers, 'place_photos')
                        let photosUrlToUpdate = []

                        resPhotos.map(res => photosUrlToUpdate.push(res.url))
                        console.log('Số photos của place photos khi đẩy lên cloudinary:', photosUrlToUpdate.length)
                        // photosToUpdate sẽ cập nhật vào database
                        // Không cần chờ nào xong nó tự create trong DB
                        const photosUpdated = await PhotosModel.createNew({
                          place_photos_id: newPlace.place_id,
                          photos: photosUrlToUpdate
                        })
                        //  thêm trường photoId trong newPlace
                        newPlace.photos_id = photosUpdated.insertedId.toString()
                      }
                    ).catch(err => console.log('Lỗi khi gọi place photos', err))
                  }

                  // Xóa thằng reviews trong newPlace
                  const reviewsClone = cloneDeep(data?.data?.result?.reviews)
                  delete newPlace.reviews
                  if (reviewsClone) {
                    reviewsClone.map(review => profilePhotosReference.push(review.profile_photo_url))
                    // console.log('🚀 ~ file: map.service.js:60 ~ createPlacesQueue.process ~ profilePhotosReference', profilePhotosReference)

                    // https://blog.logrocket.com/using-axios-all-make-concurrent-requests/
                    await axios.all(
                      profilePhotosReference.map(photoReference => axios.get(photoReference, { responseType: 'arraybuffer' }))
                    ).then(
                      async (datas) => {
                        let photoBuffers = []
                        datas.map(res => photoBuffers.push(res.data))
                        console.log('số photos của place reviews buffer:', photoBuffers.length)

                        let resPhotos = await CloudinaryProvider.streamUploadMutiple(photoBuffers, 'place_reviews')
                        console.log('Số photos của place reviews khi đẩy lên cloudinary:', resPhotos.length)

                        reviewsClone.map((review, index) => review.profile_photo_url = resPhotos[index].url)


                        // photosToUpdate sẽ cập nhật vào database
                        const photosUpdated = await ReviewsModel.createNew({
                          place_reviews_id: newPlace.place_id,
                          reviews: reviewsClone
                        })
                        //  thêm trường photoId trong newPlace
                        newPlace.reviews_id = photosUpdated.insertedId.toString()
                      }
                    ).catch(err => console.log('Lỗi ở gọi photo reviews', err))
                  }
                  MapModel.createNew(newPlace)
                  placesDetails.push(newPlace)
                } else {
                  console.log('Place đã có ...')
                }
              })

            }).catch(err => console.log('Lỗi khi gọi place details', err))

            // Bây giờ lưu vào database với 1 mảng obj của placesDetails
            // Bởi vì mình đang call api 20 vòng lặp xong trong 20 vòng lặp, mỗi kết quả trả về lại call
            // tiếp 5 api (để lấy được ảnh dạng binary xong rồi chuyển nó về base64)
            // Vấn đề lớn nhất là khi call được 20 thằng place r, trong mỗi thằng place call api đến photo của nó nhưng nó cần thời gian để nạp photo về
            // 20 thằng place mỗi 1 place trung bình 5 photo v nó làm công việc call api 100 lần
            //  Vì v ở đây tui set thời gian là 10s để chạy cho 20 place và hơn 100 photo
            // Nếu không để 10s nó sẽ chạy nhưng photo không được chuyển về base64 :(((
            // Có cách nào hay hơn thì say me nha
            setTimeout(async () => {
              if (placesDetails.length > 0) {
                // const placeDetailsCreated = await MapModel.createManyPlaces(placesDetails)
                done(null, `Tất cả ${placesDetails.length} Place đều đã có trong db!`)
              } else {
                done(null, `${placesDetails.length} Place đều đã có trong db!`)
              }
            }, 40000)
            // done(null, 'Tiến trình đã xong!')
          } catch (error) {
            done(new Error('Error from createPlacesQueue.process'))
          }
        })
        // Phuong: B3: Check completed hoặc failed, tùy trường hợp yêu cầu mà cần cái event này, để bắn thông báo khi job chạy xong chẳng hạn
        // Phuong: Nhiều event khác: https:// Phuong: github.com/OptimalBits/bull/blob/HEAD/REFERENCE.md#events
        createPlacesQueue.on('completed', (job, result) => {
        // Phuong  Bắn kết quả về Slack
          createPlacesQueue.close()
          console.log('Close queue')
          SendMessageToSlack.sendToSlack(`Job với id là: ${job.id} và tên job: *${job.queue.name}* đã *xong* và kết quả là: ${result}> Tác vụ hoàn thành trong ${ Date.now() - startTime}s`)
        })

        createPlacesQueue.on('failed', (job, error) => {
        // Phuong: Bắn lỗi về Slack hoặc Telegram ...
          createPlacesQueue.close()
          console.log('Close queue')
          SendMessageToSlack.sendToSlack(`Notification: Job với id là ${job.id} và tên job là *${job.queue.name}* đã bị *lỗi* \n\n ${error}`)
        })

        // Phuong: Bước 4: bước quan trọng cuối cùng: Thêm vào vào đợi Redis để xử lý
        createPlacesQueue.add(places, {
        })
      } catch (error) {
        throw new Error(`Error when call backgound job: ${error}`)
      }
    }

    console.log('====================================================================================================')
    console.log('Bắt đầu gọi để lấy base 64')
    let photosToReturn = []

    // vì các tác vụ background job được chạy sau khi data trả về cho người dùng, và dữ liệu sẽ được lấy từ places
    // nếu thằng places bị biến đổi thì thằng background job này sẽ lấy dữ liệu bị biến đổi đó đem đi xử lý
    // do mình muốn dùng dữ liệu cũ nên phải cloneDeep dữ liệu khi trả về
    let placesClone = cloneDeep(places)

    placesClone.map(place => place.photos && photosToReturn.push({
      height: Math.floor(place.photos[0].height/2),
      width: Math.floor(place.photos[0].width/2),
      photo_reference: place.photos[0].photo_reference
    }))
    // console.log('🚀 ~ file: map.service.js:32 ~ getPlacesTextSearch ~ photosToReturn', photosToReturn)

    // https://blog.logrocket.com/using-axios-all-make-concurrent-requests/
    await axios.all(
      photosToReturn.map(photoReference => axios.get(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=${photoReference.width}&maxheight=${photoReference.height}&photo_reference=${photoReference.photo_reference}&key=${env.MAP_API_KEY}`, { responseType: 'arraybuffer' }))
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
    ).catch(err => console.log('Lỗi ở gọi api để là photos => base64', err))

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
    console.log('🚀 ~ file: map.service.js:241 ~ getPlacesTextSearch ~ placesClone:', placesClone?.length)
    console.log('🚀 ~ file: map.service.js:241 ~ getPlacesTextSearch ~ nextPageToken:', nextPageToken)

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
  //   placeId: 'XXXXXXXXXX',
  //   hàm này để kiểm tra xem trên FE có đang bấm vào Poiclick trên nền tảng android hay không
  //   androidPoiClick: true
  // }
  console.log('🚀 ~ file: map.service.js:256 ~ getPlaceDetails ~ data:', data)
  try {
    let placeTranform, placeTranformReturn, existPlace
    // Kiểm tra trong database xem có place_id này chưa
    if (data?.androidPoiClick) {
      const placeIdClone = cloneDeep(data.placeId)
      // Tách 4 ký tự đầu tiên
      const firstString = placeIdClone.slice(0, 4)

      // Tách 12 ký tự cuối cùng
      const lastString = placeIdClone.slice(-12)

      existPlace = await MapModel.findOneByPlaceIdStartEnd(firstString, lastString)
    } else {
      existPlace = await MapModel.findOneByPlaceId(data.placeId)
    }
    console.log('🚀 ~ file: map.service.js:294 ~ getPlaceDetails ~ existPlace:', existPlace)
    if (!existPlace || existPlace.length === 0) {
      // Lấy dữ về place details trên google map
      const result = await PlacesSearchProvider.getPlaceDetailsAPI({
        place_id: data.placeId
      })

      placeTranform = cloneDeep(result.result)
      placeTranformReturn = cloneDeep(result.result)

      // Biến đổi các photo có Db thành img64
      // Có thể xảy ra TH là không có photos nữa nên cần phải check kỹ
      const photosClone = cloneDeep(placeTranform.photos)
      delete placeTranform.photos
      if (photosClone) {
        let photosReference = []

        photosClone.map(photo => photosReference.push({
          height:  Math.floor(photo.height),
          width:  Math.floor(photo.width),
          photo_reference: photo.photo_reference
        }))

        // https://blog.logrocket.com/using-axios-all-make-concurrent-requests/
        await axios.all(
          photosReference.map( photoReference => axios.get(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=${photoReference.width}&maxheight=${photoReference.height}&photo_reference=${photoReference.photo_reference}&key=${env.MAP_API_KEY}`, { responseType: 'arraybuffer' }))
        ).then(
          async (datas) => {
            let photoBuffers = []
            datas.map(res => photoBuffers.push(res.data))
            console.log('số photos của place photos buffer:', photoBuffers.length)

            let resPhotos = await CloudinaryProvider.streamUploadMutiple(photoBuffers, 'place_photos')
            let photosUrlToUpdate = []

            resPhotos.map(res => photosUrlToUpdate.push(res.url))
            console.log('Số photos của place photos khi đẩy lên cloudinary:', photosUrlToUpdate.length)
            // photosToUpdate sẽ cập nhật vào database
            // Không cần chờ nào xong nó tự create trong DB
            const photosUpdated = await PhotosModel.createNew({
              place_photos_id: placeTranform.place_id,
              photos: photosUrlToUpdate
            })
            //  thêm trường photoId trong
            placeTranform.photos_id = photosUpdated.insertedId.toString()
            placeTranformReturn.photos = photosUrlToUpdate

          }
        ).catch(err => console.log(err))
      }

      const reviewsClone = cloneDeep(placeTranform.reviews)
      delete placeTranform.reviews
      if (reviewsClone) {
        let profilePhotosReference = []
        reviewsClone.map(review => profilePhotosReference.push(review.profile_photo_url))
        // https://blog.logrocket.com/using-axios-all-make-concurrent-requests/
        await axios.all(
          profilePhotosReference.map( photoReference => axios.get(photoReference, { responseType: 'arraybuffer' }))
        ).then(
          async (datas) => {
            let photoBuffers = []
            datas.map(res => photoBuffers.push(res.data))
            console.log('số photos của place reviews buffer:', photoBuffers.length)

            let resPhotos = await CloudinaryProvider.streamUploadMutiple(photoBuffers, 'place_reviews')
            console.log('Số photos của place reviews khi đẩy lên cloudinary:', resPhotos.length)

            reviewsClone.map((review, index) => review.profile_photo_url = resPhotos[index].url)


            // photosToUpdate sẽ cập nhật vào database
            const photosUpdated = await ReviewsModel.createNew({
              place_reviews_id: placeTranform.place_id,
              reviews: reviewsClone
            })
            //  thêm trường photoId trong placeTranform
            placeTranform.reviews_id = photosUpdated.insertedId.toString()
            placeTranformReturn.reviews = reviewsClone
          }
        ).catch(err => console.log(err))
      }
      // Phuong: oke lưu vào db thôi. Không cần đợi
      MapModel.createNew(placeTranform)
    } else if (existPlace || existPlace.length !== 0) {
      console.log('Nơi này đã tồn tại!')
      if (data?.androidPoiClick) {
        placeTranformReturn = existPlace[0]
      } else {
        placeTranformReturn = existPlace
      }
      // bây giờ trong placeTranformReturn thiếu photos với reviews nên lấy hai thằng đó về thông qua place_id
      const photosReturn = await PhotosModel.findOneByPlaceId(placeTranformReturn.place_id)
      // console.log('🚀 ~ file: map.service.js:396 ~ getPlaceDetails ~ photosReturn:', photosReturn)
      const reviewsReturn = await ReviewsModel.findOneByPlaceId(placeTranformReturn.place_id)
      // console.log('🚀 ~ file: map.service.js:398 ~ getPlaceDetails ~ reviewsReturn:', reviewsReturn)
      if (photosReturn)
        placeTranformReturn.photos = photosReturn.photos
      if (reviewsReturn)
        placeTranformReturn.reviews = reviewsReturn.reviews
    }
    // Sau đó trả về cho user thoy
    return placeTranformReturn

  } catch (error) {
    // console.log(error)
    throw new Error(error)
  }
}

const getWeatherCurrent = async (data) => {
  console.log('🚀 ~ file: map.service.js:420 ~ getWeatherCurrent ~ data:', data)
  // data = {
  //   longitude: '',
  //   latitude: ''
  // }
  try {
    const weatherData = await OpenWeatherProvider.getWeatherCurrent(data)
    return weatherData
  } catch (error) {
    throw new Error(error)
  }
}

const getWeatherForecast = async (data) => {
  console.log('🚀 ~ file: map.service.js:420 ~ getWeatherForecast ~ data:', data)
  // data = {
  //   longitude: '',
  //   latitude: ''
  // }
  try {

    // https://blog.logrocket.com/using-axios-all-make-concurrent-requests/
    const promises = []
    let result = {}
    // Duyệt qua các ID và thêm vào danh sách promise
    for (let i=0; i<3; i++) {
      let promise

      if (i === 0) {
        const params = {
          lat: data.latitude,
          lon: data.longitude,
          units: 'metric',
          lang: env.LANGUAGE_CODE_DEFAULT,
          appid: env.OPEN_WEATHER_API_KEY
        }

        promise = axios.get(`${env.OPEN_WEATHER_BASE_URL}/data/2.5/weather`, { params })
      } else if (i === 1) {
        const params = {
          lat: data.latitude,
          lon: data.longitude,
          limit: 1,
          appid: env.OPEN_WEATHER_API_KEY
        }

        promise = axios.get(`${env.OPEN_WEATHER_BASE_URL}/geo/1.0/reverse`, { params })
      } else {
        const params = {
          lat: data.latitude,
          lon: data.longitude,
          units: 'metric',
          cnt: 40, // number of list (maximum 40 item ~ 5 days)
          lang: env.LANGUAGE_CODE_DEFAULT,
          appid: env.OPEN_WEATHER_API_KEY
        }

        promise = axios.get(`${env.OPEN_WEATHER_BASE_URL}/data/2.5/forecast`, { params })
      }

      promises.push(promise)
    }

    await axios.all(promises).then((responses) => {
      responses.map((res, index) => {
        if (index === 0) {
          // dữ liệu weather hiện tại
          result.weatherCurrent = res.data
        } else if (index === 1) {
          // geocoding reverse location
          result.nameGeocoding = res.data[0].name
        } else {
          // weather forecast
          result.weatherForecast = res.data.list
        }
      })
    }
    ).catch(err => console.log('Lỗi ở gọi api openweather', err))

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getGeocodingReverse = async (data) => {
  console.log('🚀 ~ file: map.service.js:420 ~ getGeocodingReverse ~ data:', data)
  // data = {
  //   longitude: '',
  //   latitude: ''
  // }
  try {
    const weatherData = await OpenWeatherProvider.getGeocodingReverse(data)
    return weatherData
  } catch (error) {
    throw new Error(error)
  }
}

export const MapService = {
  getPlaces,
  getPlacesTextSearch,
  getPlaceDetails,
  getWeatherCurrent,
  getWeatherForecast,
  getGeocodingReverse
}
