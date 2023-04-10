import { findNearest, getDistance } from 'geolib'
import { OpenRouteServiceProvider } from 'providers/OpenRouteServiceProvider'
import { env } from 'config/environtment'

export const trackingUserLocationCurrent = (io, socket, socketIdMap) => {
  socket.on('c_tracking_user_location_current', async (data) => {
    // data có dạng:
    // data = {
    //   currentUserId: xxxxxxxxx,
    //   location: {
    //     longitude: xxxxxxxxxxxxx,
    //     latitude: xxxxxxxxxxxxx
    //   },
    //   destination: {
    //     longitude: xxxxxxxxxxxxx,
    //     latitude: xxxxxxxxxxxxx
    //   },
    //   coorArrDirection: [
    //     xxxxxxxxx
    //   ],
    //  profile: 'driving'
    // }

    // Xử lý data
    const { latitude, longitude } = data.location
    const coorNearest = findNearest({ latitude, longitude }, data.coorArrDirection)
    console.log('current coorArrDirection:', data.coorArrDirection.length)

    let coorArrDirection
    let isCallNewApi
    console.log('distance getDistance(data.location, coorNearest)', getDistance(data.location, coorNearest))
    if (getDistance(data.location, coorNearest) <= 50) {
      // Nếu duowis 50m thì bỏ mấy ông nội đi qua xong r
      const indexCoorNearest = data.coorArrDirection.findIndex(i => i.latitude === coorNearest.latitude && i.longitude === coorNearest.longitude)
      console.log('🚀 ~ file: directionSocket.js:21 ~ socket.on ~ index:', indexCoorNearest)
      coorArrDirection = data.coorArrDirection.slice(indexCoorNearest)
      isCallNewApi = false
      console.log('after coorArrDirection:', coorArrDirection.length)
    } else {
      // Nếu trên 50m thì gọi luôn api chứ tính mẹ gì nữa
      console.log('Call new api:')
      coorArrDirection = await OpenRouteServiceProvider.getDirectionsORS({
        start: [data.location.longitude, data.location.latitude],
        end: [data.destination.longitude, data.destination.latitude],
        profile: data.profile,
        api_key: env.ORS_API_KEY1
      })
      isCallNewApi = true
    }


    // socket.broadcast.emit:
    // Emit ngược lại một sự kiện có tên là "s_user_invited_to_board" về cho mọi client khác
    // (ngoại trừ chính thằng user gửi lên)

    // socket.emit
    // Emit với tất cả máy khách luôn cả thằng mới gửi
    // socket.emit('s_tracking_user_location_current', data)

    console.log('socketIdMap[data.currentUserId]: ', socketIdMap)
    io.to(socketIdMap[data.currentUserId]).emit('s_tracking_user_location_current', {
      isCallNewApi: isCallNewApi,
      coorArrDirection: coorArrDirection
    })
  })
}
