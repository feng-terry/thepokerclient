const express = require('express');
const http = require("http")
const socket = require('socket.io')
const app = express();
const port = process.env.PORT || 5000;
let players = {}

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
  io.emit('newName',players)
    
  socket.on('newName',function(data){
    players[socket.id]=data.playerName
    io.emit('newName',players)
  })

  socket.on('disconnect', (socket) =>{
    console.log('disconnected')
    const playerId = socket.id
    delete players[playerId]
    io.emit('newName',players)
    // handle disconnect  
  })
}
)


