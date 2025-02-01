import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
const START_SERVER = () => {
  const app = express()

  //Xử lý CORS
  app.use(cors(corsOptions))

  //Enable req.body json data
  app.use(express.json())

  app.use('/v1', APIs_V1)

  //Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`3.Hello ${env.AUTHOR}, Backend server is running at host:${env.APP_HOST} and Post:${env.APP_PORT}`)
  })
  //Thực hiện các tác vụ cleanUp trước khi dừng Server
  exitHook(() => {
    console.log('4. Đang ngắt kết nối tới MongoDB Cloud Atlas...')
    CLOSE_DB().then(() => {
      console.log('5. Đã ngắt kết nối tới MongoDB Cloud Atlas')
      process.exit()
    })
  })
}
//Chỉ khi kết nối tới Database thành công thì mới có Start Server Backend lên
//Immediately-invoked / Anonymous Async Function (IIFE)
(async () => {
  try {
    console.log('1.Connecting to Mongodb....')
    await CONNECT_DB()
    console.log('2.Connected to MongoDB')
    //Khởi động Backend khi connected database
    START_SERVER()
  }
  catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
//Chỉ kết nối tới Database thành công thì mới Start Server backend -end lên
// console.log('1.Connecting to Mongodb....')
// CONNECT_DB()
//   .then(() => console.log('2.Connected to MongoDB'))
//   .then(() => START_SERVER() )
//   .catch( error => {
//     console.error(error)
//     process.exit(0)
//   })