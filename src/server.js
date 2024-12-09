import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'


const START_SERVER = () => {
  const app = express()

  const hostname = 'localhost'
  const port = 8017

  app.get('/', async (req, res) => {
    console.log(await GET_DB().listCollections().toArray())
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`3.Hello Hoang Anh, Backend server is running at host:${hostname} and Post:${port}`)
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