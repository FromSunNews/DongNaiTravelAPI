import express from 'express'
import { connectDB } from '*/config/mongodb'
import { env } from '*/config/environtment'
import { apiV1 } from '*/routes/v1'
import cors from 'cors'
import socketIo from 'socket.io'
import http from 'http'
import { trackingUserLocationCurrent } from './sockets/directionSocket'
import polyline from '@mapbox/polyline'

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
  app.use(express.json())

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
      // chuỗi tọa độ trong trường points của Google Directions API
      const encodedPoints = 'm{`aAmbyiSaA~@{B`CsGlHwB~ByC|CiA~@{@l@sErCsOxIen@j]qIzE{FxCoBdAqAf@o@Zq@b@wAbA}A`AoEfC[LQDgBbAwGtDiLnGaKrF}HpEeB~@oHfEeEzBwEpCyG`EqR~LcF~Cg_@|U}NjJim@x_@KMoK`HuCfB{CjBuEtCiDvByC`B`@VNP?L^fAd@zAP~@LpDDf@DZTj@l@p@n@b@t@`@nB`A~CzAtBbAzChCrAvAhF|FrCbD`@j@~CjGtBjEhB`DdEpIbC`GtBtEVr@T~@b@tCVxBhAvH~@lG\\~Br@vCnAfEnBdG|AzFbCrHd@xAnBtGr@tBEf@o@lIe@hEmBtTQvAMdBkAfPO|C[nDmAjQi@fHQ`Da@bFY`Cc@nDe@fEq@xF[pDShBShAwAbMyBfRaA|IM`AoAnKoAvLmEh`@yBlR]zCUhAC?E@IFCN@PBDIpBu@bGmAbL[lDEnADjANnA^nAnB~DxB~DPNR`@vCdFbBbDpBvD^h@tA~AfEhE~A|AdDpDrEzEdCfC|GpGhNnLnGvFdBtA~HzGv@p@|HtGpBbB|@~@v@p@tGpFzJlIzExD`JdI~BhBfHrGfAz@|JnIdK`J`BnA`J|HnAjAvC|CnFbGnMrNzDjEhAnApDxDl@n@|BpBjCjBbC|AFNdCbBjEbCtJzEzFbDzDfCfAv@tCjBbC`BzGxE`Al@fAr@hBnAfAv@`Ar@ZLPLvB|AxClB`HtEv@?jA?`If@lBN\\Fz@^r@j@nKhLnb@zd@jNpOrN|O`b@ne@pIxJPr@Cv@Sj@Qx@a@nCaAxEWrAg@nCe@zBuBbFWd@mAbCu@|AYp@fJfChEjArPzErMxDzNdE`Bd@bAb@h@XtDdDlIdIdNrMzCvCvEtE|FrF`DtCrCnCfDbD`A`AdAdAb@\\vCpCr@r@xCvCtGfGjBfBxCzC`EpFnCtDbHrJhP|ThOtSvUv[xShYlIfLzFfIlJjMrEfGvL`Q~TrZvI|LhCjD|KfOzc@hm@lRlWnEjGtNxRtIlLhCpDv@|AdArAzBxC|LhPnGpIhFhHjE~FpHbKrArBrAvCl@jAfDtHjBfE~@`Cv@pBzCbGhBvDn@zAh@t@jDbFRXfCrDnA`BpBlCpD`Ft@dA|AlBlApA|ArArA~@jGnDrDvBlBhAhBrA~@|@zCrDhBtBrJ`LjC`DhApBh@vATzANzE`@pVNfIPhILbHBdFRvKd@pUXrPRrK`Ade@^vQVnPXlOZhUZfPLzEt@`a@l@rYLhIHhHFzBHlDRbJLrHdA|i@L~H'

      // giải mã chuỗi tọa độ
      const decodedPoints = polyline.decode(encodedPoints)

      // in ra tọa độ được giải mã
      console.log(decodedPoints.length)
      // lưu socket ID của tài khoản đăng nhập vào biến socketIdMap
      socketIdMap[accountId] = socket.id
    })

    // hàm xử lý thay đổi vị trí
    trackingUserLocationCurrent(io, socket, socketIdMap)

    socket.on('disconnect', () => {
      console.log('🚀 ~ file: server.js:59 ~ socket.on ~ socketIdMap:', socketIdMap)
      console.log('Client disconnected: ', socket.id)
    })

  })

  server.listen(process.env.PORT || env.APP_PORT, () => {
    console.log(`Hello I'm DongNaiTravelAPI, I'm running at port: ${process.env.PORT || env.APP_PORT}/`)
  })
}
