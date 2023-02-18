import { MapModel } from '*/models/map.model'

import { PlacesSearchProvider } from '../providers/PlacesSearchProvider'
import { SendMessageToSlack } from '../providers/SendMessageToSlack'
import { RedisQueueProvider } from '*/providers/RedisQueueProvider'

import { MapApiStatus } from '../utilities/constants'


const getPlacesTextSearch = async (data) => {
  // data theo dạng {
  // query: string,
  // location: {
  // lat: number,
  // lng: number
  // }
  // }
  try {

    const result = await PlacesSearchProvider.getPlacesTextSearchAPI(data)

    let places
    if (result?.status === 'OK')
      places = result.results
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
      // Phuong:  Bước 1: Khởi tạo một hàng đợi để tạo nhiều places (dự kiến 20 results cho mỗi page)
      let createPlacesQueue = RedisQueueProvider.generateQueue('createPlacesQueue')
      // Phuong:  Bước 2: Định nghĩa ra những việc cần làm trong tiến trình hàng đợi
      createPlacesQueue.process(async (job, done) => {
        try {
          // Phuong:  job.data ở đây chính là places được truyền vào từ bước 4
          // let placesToCreate = []

          job.data.map(async (place, index) => {
            await PlacesSearchProvider.getPlaceDetailsAPI({
              place_id: place.place_id
            }).then(async result => {
              let data = result.result
              // const pitures = result.result.photos
              // if (pitures) {
              //   let photos = []
              //   await pitures.map(async photo => {
              //     await PlacesSearchProvider.getPlacePhotosAPI({
              //       photo_reference: photo.photo_reference
              //     }).then((photoBinary) => {
              //       photos.push(photoBinary)
              //     })
              //   })
              //   data.photos = photos
              // }
              // console.log('🚀 ~ file: map.service.js:51 ~ job.data.map ~ result', result)

              console.log(`🚀createPlacesQueue.process ~ result ${index}`, result)
              // placesToCreate.push(result)
              await MapModel.createNew(data)
            })
          })

          // console.log('🚀 ~ file: map.service.js:46 ~ createPlacesQueue.process ~ placesToCreate', placesToCreate)
          // const placesCreated = await MapModel.createManyPlaces(placesToCreate)
          // done(null, placesCreated)
          done(null, 'Successfully created')
        } catch (error) {
          done(new Error('Error from createPlacesQueue.process'))
        }
      })
      // Phuong: B3: Check completed hoặc failed, tùy trường hợp yêu cầu mà cần cái event này, để bắn thông báo khi job chạy xong chẳng hạn
      // Phuong: Nhiều event khác: https:// Phuong: github.com/OptimalBits/bull/blob/HEAD/REFERENCE.md#events
      createPlacesQueue.on('completed', (job, result) => {
        // Phuong  Bắn kết quả về Slack
        SendMessageToSlack.sendToSlack(`Job với id là: ${job.id} và tên job: *${job.queue.name}* đã *xong* và kết quả là: ${result}`)
      })

      createPlacesQueue.on('failed', (job, error) => {
        // Phuong: Bắn lỗi về Slack hoặc Telegram ...
        SendMessageToSlack.sendToSlack(`Notification: Job với id là ${job.id} và tên job là *${job.queue.name}* đã bị *lỗi* \n\n ${error}`)
      })

      // Phuong: Bước 4: bước quan trọng cuối cùng: Thêm vào vào đợi Redis để xử lý
      createPlacesQueue.add(places, {
        attempts: 1, // Phuong: số lần thử lại nếu lỗi
        backoff: 5000 // Phuong: khoảng thời gian delay giữa các lần thử lại job
      })
    }

    return places
  } catch (error) {
    throw new Error(error)
  }
}

export const MapService = {
  getPlacesTextSearch
}
