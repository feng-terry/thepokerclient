const table = require('./modules/table')
const player = require('./modules/player')
const express = require('express')
const http = require("http")
const socket = require('socket.io')
const app = express()
const port = process.env.PORT || 5000
let players = {}
let pageState = 'homePage'


// console.log that your server is up and running
const server = app.listen(port, () => console.log(`Listening on port ${port}`))

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' })
})

app.use(express.static('/client/public'))

const io = socket(server)

let Table = new table.Table(io)

io.on('connection',(socket) =>{
  const playerId = socket.id
  console.log('made socket connection', socket.id)
  io.emit('pageState',pageState)
  setTimeout((function() {io.emit('newName',players)}), 375)

  
  socket.on('newGame',(data)=>{
      Table.setSettings(data)
      
      for (const player of Object.values(players)){
        player.addStack(Table.startingStack)
        Table.addPlayer(player)
      }
      
      io.emit('nameAndStack', [players,Table.getPot()])
      
      Table.newHand();
      

    } 
  )

  socket.on('newName',function(data){
    players[socket.id]=new player.Player(data.playerName,socket.id)
    io.emit('newName',players)
  })

  socket.on('disconnect', () =>{
    console.log('disconnected', socket.id)
    Table.removePlayer(players[playerId])
    delete players[playerId]
    
    io.emit('newName',players)
    io.emit('nameAndStack', [players,Table.getPot()])
    // handle disconnect  
  })

  socket.on('changePageState',(data)=>{
    pageState = data
    io.emit('pageState',pageState)
    io.emit('newName',players)
  })

  socket.on('fold', ()=>{
    if (socket.id === Table.currentPlayer.getSocketId()){
      Table.fold()
    }
    io.emit('nameAndStack', [players,Table.getPot()])
  })

  socket.on('check', ()=>{
    if (socket.id === Table.currentPlayer.getSocketId()){
      Table.check()
    }
    io.emit('nameAndStack', [players,Table.getPot()])
  })

  socket.on('call', ()=>{
    if (socket.id === Table.currentPlayer.getSocketId()){
      Table.call()
    }
    
    io.emit('nameAndStack', [players,Table.getPot()])
  })

  socket.on('bet',(betValue)=>{
    if (socket.id === Table.currentPlayer.getSocketId()){
      Table.bet(betValue)
    }
    io.emit('nameAndStack', [players,Table.getPot()])
  })

  socket.on('raise',(raiseValue)=>{
    if (socket.id === Table.currentPlayer.getSocketId()){
      Table.raise(raiseValue)
    }
    io.emit('nameAndStack', [players,Table.getPot()])
  })

  socket.on('update', ()=>{
    io.emit('nameAndStack', [players,Table.getPot()])
  })
}
)



