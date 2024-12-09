
const MONGODB_URI ='mongodb://localhost:27017/'

const DATABASE_NAME ='trello-hoanganh-mern-stack'

import { MongoClient } from 'mongodb'

//Khởi tạo một đối tượng trelloDatabseInstance ban đầu là null vì chưa connect
let trelloDatabaseInstance = null

//Khởi tạo một đối tượng  mongoClientInstance để connect tới MongoBD
const mongoClientInstance = new MongoClient(MONGODB_URI, {
  //Lư ý : cái Server API có từ phiên bản MONGODB 5.0.0 trở lên , có thể không cần dùng nó , nếu dùng nó là
  // chúng ta sẽ chỉ định 1 cái Stable API Version cả Mongodb
  // serverApi:{
  //   version:ServerApiVersion.v1,
  //   strict:true,
  //   deprecationErrors:true
  // }
})

//Kết nối Database
export const CONNECT_DB = async () => {
  //Gọi kết nối tới MongoDB Atlas với URI đã khai báo trong thân cả clientInstance
  await mongoClientInstance.connect()
  //Kết nối thành công thì lấy ra database theo tên và gán ngược nó lại vào trelloDatabaseInstance ở trên
  trelloDatabaseInstance =mongoClientInstance.db(DATABASE_NAME)
}

// Function GET_DB có nhiệm vụ export ra cái trello Database Instance sau khi đã connect thành công
//tới MongoDB để chúng ta sử dụng nhiều nơi khác nhau trong code
//Lưu ý phải đảm bảo chỉ luôn gọi GET_DB này sau khi đã kết nối thành công tới Mongodb
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must Connect to Database first!')
  return trelloDatabaseInstance
}

//Dóng kết nổi Database
export const CLOSE_DB = async () =>{
  await mongoClientInstance.close()
}