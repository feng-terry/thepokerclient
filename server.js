const express = require('express');
const http = require("http")
const socket = require('socket.io')
const app = express();
const port = process.env.PORT || 5000;
let players = {}
let pageState = 'homePage'
let gameSettings;

// console.log that your server is up and running
const server = app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.use(express.static('/client/public'))

const io = socket(server)

io.on('connection',(socket) =>{
  console.log('made socket connection', socket.id)
  io.emit('pageState',pageState)
  setTimeout((function() {io.emit('newName',players)}), 375);
  
  socket.on('newName',function(data){
    players[socket.id]=data.playerName
    io.emit('newName',players)
  })

  socket.on('disconnect', () =>{
    console.log('disconnected', socket.id)
    const playerId = socket.id
    delete players[playerId]
    console.log(players)
    io.emit('newName',players)
    // handle disconnect  
  })

  socket.on('changePageState',(data)=>{
    pageState = data
    io.emit('pageState',pageState)
    io.emit('newName',players)
  })

  socket.on('gameSettings', (data)=>{
    gameSettings = data
  })
}
)


