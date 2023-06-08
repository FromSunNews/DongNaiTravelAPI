import { DirectionModel } from 'models/direction.model'

import { PlacesSearchProvider } from 'providers/PlacesSearchProvider'
import { SendMessageToSlack } from 'providers/SendMessageToSlack'
import { RedisQueueProvider } from 'providers/RedisQueueProvider'

import { FilterConstants, MapApiStatus } from 'utilities/constants'
import axios from 'axios'
import { env } from 'config/environtment'
import { Buffer } from 'buffer'
import { cloneDeep, result, sortBy } from 'lodash'
import { filterRadiusProminenceOrNearBy, sortByRatingHighToLow, sortByRatingLowToHigh, sortByStarHighToLow, sortByStarLowToHigh } from 'utilities/function'
import { OpenRouteServiceProvider } from 'providers/OpenRouteServiceProvider'
import polyline from '@mapbox/polyline'
import { GeocodingGoogleMapProvider } from 'providers/GeocodingGoogleMapProvider'
import { DirectionGoogleMapProvider } from 'providers/DirectionGoogleMapProvider'
import { ChatGptProvider } from 'providers/ChatGptProvider'
import { RoutesGoogleMapProvider } from 'providers/RoutesGoogleMapProvider'
import { LangChainProvider } from 'providers/LangChainProvider'

const getRouteDirection = async (data) => {
  // data có dạng:
  // data = {
  //   oriAddress: 'abc' || null,
  //   desAddress: 'abc' || null,
  //   oriPlaceId: sdgkl_27e921 || null,
  //   desPlaceId: sdgkl_27e921 || null,
  //   oriCoor: {
  //      longitude: 10.214290,
  //      latitude: 100.1283824
  // } || null,
  //   desCoor: {
  //      longitude: 10.214290,
  //      latitude: 100.1283824
  // } || null,
  //   modeORS: 'driving-car',
  //   modeGCP: 'driving',
  //   typeOri: 'place_id' || 'address' || 'coordinate',
  //   typeDes: 'place_id' || 'address' || 'coordinate',
  //   routeModifiers: {
  //   avoidTolls: false,
  //   avoidHighways: false,
  //   avoidFerries: false,
  //   avoidIndoor: false
  //   },
  //   languageCode: 'vi'
  // }
  console.log('🚀 ~ file: direction.service.js:256 ~ getPlaceDetails ~ data:', data)
  try {
    let oriToCheck
    let desToCheck

    let result

    if (data.typeOri === 'place_id') {
      oriToCheck = data.oriPlaceId
    } else if (data.typeOri === 'address') {
      // geocoding 2 thằng origin và destination để lấy chính xác place_id để đi kiểm tra trong db
      const geocodingOri = GeocodingGoogleMapProvider.getPlaceIdFromAddress(data.oriAddress)
      oriToCheck = geocodingOri.place_id
    } else if (data.typeOri === 'coordinate') {
      // geocoding 2 thằng origin và destination để lấy chính xác place_id để đi kiểm tra trong db
      oriToCheck = await GeocodingGoogleMapProvider.getPlaceIdFromCoords(data.oriCoor.latitude, data.oriCoor.longitude)
    }

    if (data.typeDes === 'place_id') {
      desToCheck = data.desPlaceId
    } else if (data.typeDes === 'address') {
      // geocoding 2 thằng origin và destination để lấy chính xác place_id để đi kiểm tra trong db
      const geocodingDes = GeocodingGoogleMapProvider.getPlaceIdFromAddress(data.oriAddress)
      desToCheck = geocodingDes.place_id
    } else if (data.typeDes === 'coordinate') {
      // geocoding 2 thằng origin và destination để lấy chính xác place_id để đi kiểm tra trong db
      desToCheck = await GeocodingGoogleMapProvider.getPlaceIdFromCoords(data.desCoor.latitude, data.desCoor.longitude)
    }

    console.log('oriToCheck', oriToCheck)
    console.log('desToCheck', desToCheck)
    // Kiểm tra trong database xem có geocoded_waypoints có hai đứa này không
    let checkWaypointsDb = await DirectionModel.findOriDesPlaceId(oriToCheck, desToCheck)
    console.log('🚀 ~ file: direction.service.js:72 ~ getRouteDirection ~ checkWaypointsDb:', checkWaypointsDb)

    const indexOfWay = checkWaypointsDb.findIndex(way => way.transport === data.modeGCP)
    // nếu indexOfWay = -1 là tìm không thấy
    if (checkWaypointsDb.length !== 0 && indexOfWay !== -1) {
      console.log('Lấy trong DB')
      console.log('🚀 ~ file: direction.service.js:83 ~ getRouteDirection ~ indexOfWay:', indexOfWay)

      console.log('🚀 vaof ~ indexOfWay:')

      // Nếu có thì lấy về luôn. À quên đối với GCP còn phải encode points
      // Muốn decode thì sẽ tiếp cận từ routes(là mảng -> số đường đi từ A -> B)
      if (checkWaypointsDb[indexOfWay].callFrom === 'GCP') {
        checkWaypointsDb[indexOfWay].data.routes.map(route => {
          const legs = route.legs
          if (legs) {
            legs.map(leg => {
              // xử lý thằng duration và staticDuration tách s ra chuyển về number
              leg.duration = Number(leg.duration.split('s')[0])
              leg.staticDuration = Number(leg.staticDuration.split('s')[0])

              const steps = leg.steps
              if (steps) {
                steps.map(step => {
                  // xử lý thằng staticDuration tách s ra chuyển về number
                  step.staticDuration = Number(step.staticDuration.split('s')[0])

                  const points = polyline.decode(step.polyline.encodedPolyline)
                  const pointsToUpdate = []
                  points.map(point => pointsToUpdate.push({ latitude: point[0], longitude: point[1] }))
                  step.polyline = pointsToUpdate
                })
              }
            })
          }
          // Xử lý decode polyline
          const points = polyline.decode(route.polyline.encodedPolyline)
          const pointsToUpdate = []
          points.map(point => pointsToUpdate.push({ latitude: point[0], longitude: point[1] }))
          route.polyline = pointsToUpdate
          // xử lý thằng duration và staticDuration tách s ra chuyển về number
          route.duration = Number(route.duration.split('s')[0])
          route.staticDuration = Number(route.staticDuration.split('s')[0])
        })
      }

      result = {
        data: checkWaypointsDb[indexOfWay].data,
        callFrom: checkWaypointsDb[indexOfWay].callFrom,
        oriPlaceId: oriToCheck ? oriToCheck : null,
        desPlaceId: desToCheck ? desToCheck : null
      }
      console.log('🚀 ~ file: direction.service.js:125 ~ getRouteDirection ~ result:', result)

    } else {
    // Nếu không có thì phải gọi thằng GCP direction
      console.log('Call API')

      let drirection
      let body = {
        origin: oriToCheck ? { placeId: oriToCheck } : { latitude: data.oriCoor.latitude, longitude: data.oriCoor.longitude },
        destination: desToCheck ? { placeId: desToCheck } : { latitude: data.desCoor.latitude, longitude: data.desCoor.longitude },
        mode: data.modeGCP,
        routeModifiers: data.routeModifiers,
        languageCode: data.languageCode
      }

      if (!body.routeModifiers) {
        delete body.routeModifiers
      }

      let directionTranformYet
      drirection = await RoutesGoogleMapProvider.getComputeRoutesGCP(body)


      if (!drirection.error) {
        // Nếu thằng drirection trả về không có routes nghĩa là không tìm thấy
        if (!drirection.routes || drirection.routes.length === 0) {
          return {
            error: 'This route is not supported or not found!'
          }
        }
        // Biến đổi dữ liệu trả về
        directionTranformYet = cloneDeep(drirection)
        drirection.routes.map(route => {
          const legs = route.legs
          if (legs) {
            legs.map(leg => {
              // xử lý thằng duration và staticDuration tách s ra chuyển về number
              leg.duration = Number(leg.duration.split('s')[0])
              leg.staticDuration = Number(leg.staticDuration.split('s')[0])

              const steps = leg.steps
              if (steps) {
                steps.map(step => {
                  // xử lý thằng staticDuration tách s ra chuyển về number
                  step.staticDuration = Number(step.staticDuration.split('s')[0])

                  const points = polyline.decode(step.polyline.encodedPolyline)
                  const pointsToUpdate = []
                  points.map(point => pointsToUpdate.push({ latitude: point[0], longitude: point[1] }))
                  step.polyline = pointsToUpdate
                })
              }
            })
          }
          // Xử lý decode polyline
          const points = polyline.decode(route.polyline.encodedPolyline)
          const pointsToUpdate = []
          points.map(point => pointsToUpdate.push({ latitude: point[0], longitude: point[1] }))
          route.polyline = pointsToUpdate
          // xử lý thằng duration và staticDuration tách s ra chuyển về number
          route.duration = Number(route.duration.split('s')[0])
          route.staticDuration = Number(route.staticDuration.split('s')[0])
        })
        result = {
          data: drirection,
          callFrom: 'GCP',
          transport: data.modeGCP,
          oriPlaceId: oriToCheck ? oriToCheck : null,
          desPlaceId: desToCheck ? desToCheck : null
        }
      }
      // else {
      // // data có dạng:
      // // data = {
      // //   start: [18.21834812848, 67.2194214],
      // //   end: [19.21834812848, 68.2194214],
      // //   profile: 'driving-car'
      // // }
      //   const resultORS = await OpenRouteServiceProvider.getDirectionsORS({
      //     start: [data.oriCoor.longitude, data.oriCoor.latitude],
      //     end: [data.desCoor.longitude, data.desCoor.latitude],
      //     profile: data.modeORS,
      //     api_key: env.ORS_API_KEY1
      //   })

      //   directionTranformYet = cloneDeep(resultORS)
      //   result = {
      //     data: resultORS,
      //     callFrom: 'ORS',
      //     transport: data.modeORS
      //   }
      // }

      // // lưu vào backgoundjob
      // // Bước 1: Khởi tạo một hàng đợi để cập nhật comment của nhiều card
      // const dataToSave = {
      //   callFrom: result.callFrom,
      //   transport: result.transport,
      //   data: directionTranformYet,
      //   geocoded_waypoints: [oriToCheck, desToCheck]
      // }

      // dataToSave
      // let updatedDirectionQueue = RedisQueueProvider.generateQueue('updatedDirectionQueue')
      // // Bước 2: Định nghĩa ra những việc cần làm trong tiến trình hàng đợi
      // updatedDirectionQueue.process(async (job, done) => {
      //   try {
      //   // job.data ở đây chính là dataToSave được truyền vào từ bước 4
      //     const directionUpdated = await DirectionModel.createNew(job.data)
      //     done(null, directionUpdated)
      //   } catch (error) {
      //     done(new Error('Error from updatedDirectionQueue.process'))
      //   }
      // })
      // // B3: Check completed hoặc failed, tùy trường hợp yêu cầu mà cần cái event này, để bắn thông báo khi job chạy xong chẳng hạn
      // // Nhiều event khác: https://github.com/OptimalBits/bull/blob/HEAD/REFERENCE.md#events
      // updatedDirectionQueue.on('completed', (job, result) => {
      // // Bắn kết quả về Slack
      //   SendMessageToSlack.sendToSlack(`Job với id là: ${job.id} và tên job: *${job.queue.name}* đã *xong* và kết quả là: ${result}`)
      // })

      // updatedDirectionQueue.on('failed', (job, error) => {
      // // Bắn lỗi về Slack hoặc Telegram ...
      //   SendMessageToSlack.sendToSlack(`Notification: Job với id là ${job.id} và tên job là *${job.queue.name}* đã bị *lỗi* \n\n ${error}`)
      // })

      // // Bước 4: bước quan trọng cuối cùng: Thêm vào vào đợi Redis để xử lý
      // updatedDirectionQueue.add(dataToSave, {
      //   attempts: 2, // số lần thử lại nếu lỗi
      //   backoff: 5000 //khoảng thời gian delay giữa các lần thử lại job
      // })
    }

    // dữ liẹu trả về theo dạng:
    // data: {
    //   data: kết quả tương ứng
    //   callFrom: 'ORS' || 'GCP'
    // }

    console.log('🚀 ~ file: direction.service.js:210 ~ getRouteDirection ~ result:', result)
    return result
  } catch (error) {
    // console.log(error)
    throw new Error(error)
  }
}

const getChatGptItinerary = async (data) => {
  console.log('🚀 ~ file: direction.service.js:214 ~ getRouteDirection ~ data:', data)
  try {
    const result = await LangChainProvider.getMessage(data.textInput)
    return result
  } catch (error) {
    // console.log(error)
    throw new Error(error)
  }
}

export const DirectionService = {
  getRouteDirection,
  getChatGptItinerary
}
