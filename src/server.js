import express from 'express'
import { connectDB } from 'config/mongodb'
import { env } from 'config/environtment'
import { apiV1 } from 'routes/v1'
import cors from 'cors'
import socketIo from 'socket.io'
import http from 'http'
import { trackingUserLocationCurrent } from 'sockets/directionSocket'
import { createTravelItinerary } from 'sockets/itinerarySocket'

connectDB()
  .then(() => console.log('Connected successfully to database server!'))
  .then(() => bootServer())
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

const bootServer = () => {
  // Phuong: sử dụng express
  const app = express()

  // Phuong: Fix cái vụ Cache from disk của ExpressJS
  // đối với client là Mobile thì không cấu hình này cũng đc
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  // Phuong: sử dụng cors cho web thôi còn mobile không có cũng đc
  app.use(cors())

  // Enable req.body data
  // Xử lý lỗi PayloadTooLargeError: request entity too large
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ limit: '50mb' }))

  // Phuong: cấu hình cho api chia ra cho ngọn
  app.use('/v1', apiV1)
  // for real-time

  const socketIdMap = {}

  const server = http.createServer(app)
  const io = socketIo(server)
  io.on('connection', (socket) => {
    socket.join(socket.id)
    // lắng nghe sự kiện khi vào trang home của tài khoản
    // accoundId là _id của user đối với người đã đăng nhập
    //, còn đói với người mà chưa đăng nhập thì sẽ tạo id ngẫu nhiên để nhận biết
    socket.on('c_user_login', (accountId) => {
      console.log('Client Connected', accountId)

      // lưu socket ID của tài khoản đăng nhập vào biến socketIdMap
      socketIdMap[accountId] = socket.id
    })

    // hàm xử lý thay đổi vị trí
    trackingUserLocationCurrent(io, socket, socketIdMap)

    // Hàm xử lý tạo lịch trình cho user
    createTravelItinerary(io, socket, socketIdMap)

    socket.on('disconnect', () => {
      console.log('🚀 ~ file: server.js:59 ~ socket.on ~ socketIdMap:', socketIdMap)
      console.log('Client disconnected: ', socket.id)
    })

  })

  server.listen(process.env.PORT || env.APP_PORT, () => {
    console.log(`Hello I'm DongNaiTravelAPI, I'm running at port: ${process.env.PORT || env.APP_PORT}/`)
  })
}
