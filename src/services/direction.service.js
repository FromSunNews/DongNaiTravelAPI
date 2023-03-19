import { DirectionModel } from '*/models/direction.model'

import { PlacesSearchProvider } from '../providers/PlacesSearchProvider'
import { SendMessageToSlack } from '../providers/SendMessageToSlack'
import { RedisQueueProvider } from '*/providers/RedisQueueProvider'

import { FilterConstants, MapApiStatus } from '../utilities/constants'
import axios from 'axios'
import { env } from '*/config/environtment'
import { Buffer } from 'buffer'
import { cloneDeep, result, sortBy } from 'lodash'
import { filterRadiusProminenceOrNearBy, sortByRatingHighToLow, sortByRatingLowToHigh, sortByStarHighToLow, sortByStarLowToHigh } from '../utilities/function'
import { OpenRouteServiceProvider } from '../providers/OpenRouteServiceProvider'
import polyline from '@mapbox/polyline'
import { GeocodingGoogleMapProvider } from '../providers/GeocodingGoogleMapProvider'
import { DirectionGoogleMapProvider } from '../providers/DirectionGoogleMapProvider'
import { ChatGptProvider } from '../providers/ChatGptProvider'

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
      oriToCheck = await GeocodingGoogleMapProvider.getPlaceIdFromAddress(data.oriAddress)
    } else if (data.typeOri === 'coordinate') {
      // geocoding 2 thằng origin và destination để lấy chính xác place_id để đi kiểm tra trong db
      oriToCheck = await GeocodingGoogleMapProvider.getPlaceIdFromCoords(data.oriCoor.latitude, data.oriCoor.longitude)
    }

    if (data.typeDes === 'place_id') {
      desToCheck = data.desPlaceId
    } else if (data.typeDes === 'address') {
      // geocoding 2 thằng origin và destination để lấy chính xác place_id để đi kiểm tra trong db
      desToCheck = await GeocodingGoogleMapProvider.getPlaceIdFromAddress(data.desAddress)
    } else if (data.typeDes === 'coordinate') {
      // geocoding 2 thằng origin và destination để lấy chính xác place_id để đi kiểm tra trong db
      desToCheck = await GeocodingGoogleMapProvider.getPlaceIdFromCoords(data.desCoor.latitude, data.desCoor.longitude)
    }

    console.log('oriToCheck', oriToCheck)
    console.log('desToCheck', desToCheck)
    // Kiểm tra trong database xem có geocoded_waypoints có hai đứa này không
    let checkWaypointsDb = await DirectionModel.findOriDesPlaceId(oriToCheck, desToCheck)
    console.log('🚀 ~ file: direction.service.js:72 ~ getRouteDirection ~ checkWaypointsDb:', checkWaypointsDb)

    if (checkWaypointsDb.length !== 0) {
    // Nếu có thì lấy về luôn. À quên đối với GCP còn phải encode points
    // Muốn decode thì sẽ tiếp cận từ routes(là mảng -> số đường đi từ A -> B)
      if (checkWaypointsDb[0].callFrom === 'GCP') {
        checkWaypointsDb[0].data.routes.map(route => {
          const legs = route.legs
          if (legs) {
            legs.map(leg => {
              const steps = leg.steps
              if (steps) {
                steps.map(step => {
                  const points = polyline.decode(step.polyline.points)
                  const pointsToUpdate = []
                  points.map(point => pointsToUpdate.push({ latitude: point[0], longitude: point[1] }))
                  step.polyline.points = pointsToUpdate
                })
              }
            })
          }
          const points = polyline.decode(route.overview_polyline.points)
          const pointsToUpdate = []
          points.map(point => pointsToUpdate.push({ latitude: point[0], longitude: point[1] }))
          route.overview_polyline.points = pointsToUpdate
        })
      }

      result = {
        data: checkWaypointsDb[0].data,
        callFrom: checkWaypointsDb[0].callFrom
      }
    } else {
    // Nếu không có thì phải gọi thằng GCP direction

      let drirection
      let directionTranformYet
      drirection = await DirectionGoogleMapProvider.getRouteDirectionAPI({
        origin: oriToCheck ? `place_id:${oriToCheck}` : `${data.oriCoor.latitude},${data.oriCoor.longitude}`,
        destination: desToCheck ? `place_id:${desToCheck}` : `${data.desCoor.latitude},${data.desCoor.longitude}`,
        mode: data.modeGCP
      })

      // Nếu thằng GCP trả về lỗi thì phải gọi ORS
      if (drirection.status === 'OK') {
      // Biến đổi dữ liệu trả về
        directionTranformYet = cloneDeep(drirection)
        drirection.routes.map(route => {
          const legs = route.legs
          if (legs) {
            legs.map(leg => {
              const steps = leg.steps
              if (steps) {
                steps.map(step => {
                  const points = polyline.decode(step.polyline.points)
                  const pointsToUpdate = []
                  points.map(point => pointsToUpdate.push({ latitude: point[0], longitude: point[1] }))
                  step.polyline.points = pointsToUpdate
                })
              }
            })
          }
          const points = polyline.decode(route.overview_polyline.points)
          const pointsToUpdate = []
          points.map(point => pointsToUpdate.push({ latitude: point[0], longitude: point[1] }))
          route.overview_polyline.points = pointsToUpdate
        })
        result = {
          data: drirection,
          callFrom: 'GCP',
          transport: data.modeGCP
        }
      } else {
      // data có dạng:
      // data = {
      //   start: [18.21834812848, 67.2194214],
      //   end: [19.21834812848, 68.2194214],
      //   profile: 'driving-car'
      // }
        const resultORS = await OpenRouteServiceProvider.getDirectionsORS({
          start: [data.oriCoor.longitude, data.oriCoor.latitude],
          end: [data.desCoor.longitude, data.desCoor.latitude],
          profile: data.modeORS,
          api_key: env.ORS_API_KEY1
        })

        directionTranformYet = cloneDeep(resultORS)
        result = {
          data: resultORS,
          callFrom: 'ORS',
          transport: data.modeORS
        }
      }
      // lưu vào backgoundjob
      // Bước 1: Khởi tạo một hàng đợi để cập nhật comment của nhiều card
      const dataToSave = {
        ...result,
        data: directionTranformYet,
        geocoded_waypoints: [oriToCheck, desToCheck]
      }
      let updatedDirectionQueue = RedisQueueProvider.generateQueue('updatedDirectionQueue')
      // Bước 2: Định nghĩa ra những việc cần làm trong tiến trình hàng đợi
      updatedDirectionQueue.process(async (job, done) => {
        try {
        // job.data ở đây chính là dataToSave được truyền vào từ bước 4
          const directionUpdated = await DirectionModel.createNew(job.data)
          done(null, directionUpdated)
        } catch (error) {
          done(new Error('Error from updatedDirectionQueue.process'))
        }
      })
      // B3: Check completed hoặc failed, tùy trường hợp yêu cầu mà cần cái event này, để bắn thông báo khi job chạy xong chẳng hạn
      // Nhiều event khác: https://github.com/OptimalBits/bull/blob/HEAD/REFERENCE.md#events
      updatedDirectionQueue.on('completed', (job, result) => {
      // Bắn kết quả về Slack
        SendMessageToSlack.sendToSlack(`Job với id là: ${job.id} và tên job: *${job.queue.name}* đã *xong* và kết quả là: ${result}`)
      })

      updatedDirectionQueue.on('failed', (job, error) => {
      // Bắn lỗi về Slack hoặc Telegram ...
        SendMessageToSlack.sendToSlack(`Notification: Job với id là ${job.id} và tên job là *${job.queue.name}* đã bị *lỗi* \n\n ${error}`)
      })

      // Bước 4: bước quan trọng cuối cùng: Thêm vào vào đợi Redis để xử lý
      updatedDirectionQueue.add(dataToSave, {
        attempts: 2, // số lần thử lại nếu lỗi
        backoff: 5000 //khoảng thời gian delay giữa các lần thử lại job
      })
    }

    // dữ liẹu trả về theo dạng:
    // data: {
    //   data: kết quả tương ứng
    //   callFrom: 'ORS' || 'GCP'
    // }

    console.log('🚀 ~ file: direction.service.js:210 ~ getRouteDirection ~ result:', result.callFrom)
    return result
  } catch (error) {
    // console.log(error)
    throw new Error(error)
  }
}

const getChatGptItinerary = async (data) => {
  console.log('🚀 ~ file: direction.service.js:214 ~ getRouteDirection ~ data:', data)
  try {
    const result = await ChatGptProvider.handleItineraryRequest(data.textInput)
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
