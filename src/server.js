import express from 'express'
import { connectDB } from '*/config/mongodb'
import { env } from '*/config/environtment'
import { apiV1 } from '*/routes/v1'
import cors from 'cors'

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

  app.listen(process.env.PORT || env.APP_PORT, () => {
    console.log(`Hello I'm DongNaiTravelAPI, I'm running at port: ${process.env.PORT || env.APP_PORT}/`)
  })
}
