import express from 'express'

const app = express()

const localhost ='localhost'
const port = 8017

app.get('/',function(req,res){
  res.send('<h1>Hello World NodeJs HoangAnh</h1>')
})
app.listen(port , localhost , () =>{
  console.log(`Hello Hoang Anh , I am running server http://${localhost}:${port}/  `)
})