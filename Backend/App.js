const express = require('express');
const bodyParser=require("body-parser")
const cors=require("cors")
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = express();
const PORT = 4000;
const createproject=require('./Request/SpinContanier')
const RegisterUser=require('./Request/RegisterUser')

dotenv.config();
app.use(express.json());
app.use(bodyParser.json())
app.use(cors())
connectDB()
// redis server Config
const Redis = require("ioredis");
const redisUri = "redis://default:AVNS_kh_5YK7aZgwHEwlMqFX@redis-1f810bc2-vercelclone.a.aivencloud.com:25619"
const subscriber = new Redis(redisUri);

app.use('/Project',createproject)
app.use('/user',RegisterUser)





async function initRedisSubscribe() {
  console.log('Subscribed to logs....')
  subscriber.psubscribe('logs:*')
  subscriber.on('pmessage', (pattern, channel, message) => {
      io.to(channel).emit('message', message)
  })
}


initRedisSubscribe()

const server=app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// io.listen(9002, () => console.log('Socket Server 9002'))
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on('connection', socket => {
  console.log("connected to socket")
  socket.on('subscribe', channel => {
    // console.log(channel)
      socket.join(channel)
      socket.emit('message', `Joined ${channel}`)
  })
})
