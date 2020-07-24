const table = require('./modules/table')
const player = require('./modules/player')
const express = require('express')
const http = require("http")
const socket = require('socket.io')
const app = express()
const port = process.env.PORT || 5000
let rooms = {}
let playerRoom = {}
let players = {}
let spectators = []
let pageState = 'homePage'


// console.log that your server is up and running
const server = app.listen(port, () => console.log(`Listening on port ${port}`))
const io = socket(server)

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' })
})

app.get('/generateLobbyId', (req,res) => {
  const id = (Math.random()+1).toString(36).slice(2,18)
  rooms[id] = {players:{},spectators:[],table:new table.Table(io,id),lobbyLeader:''}
  res.send({lobbyId:id})
})

app.use(express.static('/client/public'))

let Table = new table.Table(io)

//Helper Functions
function emitNewName(lobbyId){
  const emitTo = Object.keys(rooms[lobbyId].players).concat(rooms[lobbyId].spectators)
  for (const id of emitTo){
    io.to(id).emit('newName',rooms[lobbyId].players)
  }
}

function emitNameAndStack(lobbyId){
  console.log(Object.keys(rooms))
  console.log(rooms)
  console.log(lobbyId)
  const emitTo = Object.keys(rooms[lobbyId].players).concat(rooms[lobbyId].spectators)
  for (const id of emitTo){
    io.to(id).emit('nameAndStack', {
      players:rooms[lobbyId].players,
      pot:rooms[lobbyId].table.getPot(),
      currentBet:rooms[lobbyId].table.getCurrentBet(),
      activeNotSatOutPlayers:rooms[lobbyId].table.getActiveNotSatOutPlayers()})
  }
}

function emitPageState(lobbyId,page){
  const emitTo = Object.keys(rooms[lobbyId].players).concat(rooms[lobbyId].spectators)
  for (const id of emitTo){
    io.to(id).emit('pageState',page)
  }
}
////////////////////////////

io.on('connection',(socket) =>{
  socket.on('consolelog',()=>{
  console.log('working')
  })

  const playerId = socket.id
  spectators.push(playerId) 

  console.log('made socket connection', socket.id)

  io.emit('pageState',pageState)
  
  if (pageState === 'gamePage'){
    for (const id of spectators){
      setTimeout(function(){io.to(id).emit('sitDownButton')},500)
    }
    setTimeout(function(){io.emit('nameAndStack', {players:players,pot:Table.getPot(),currentBet:Table.getCurrentBet(),activeNotSatOutPlayers:Table.getActiveNotSatOutPlayers()})},500)
  }

  socket.on('addSpectator',(data)=>{
    if (Object.keys(rooms).includes(data.lobbyId)){
      rooms[data.lobbyId].spectators.push(socket.id)
      rooms[data.lobbyId].table.addSpectator(socket.id)
      playerRoom[socket.id] = data.lobbyId
      console.log('addSpectatr',data.lobbyId)
      io.to(socket.id).emit('updateLobbyId',data.lobbyId)
      emitNewName(data.lobbyId)
    }
  })

  socket.on('newRoom',(data)=>{
    rooms[data.lobbyId].lobbyLeader = socket.id
    rooms[data.lobbyId].spectators.push(socket.id)
    playerRoom[socket.id] = data.lobbyId
    console.log('newRoom',data.lobbyId)
    io.to(socket.id).emit('updateLobbyId',data.lobbyId)
  })

  socket.on('newGame',(data)=>{
      rooms[data.lobbyId].table.setSettings(data)
      
      for (const player of Object.values(rooms[data.lobbyId].players)){
        player.addStack(rooms[data.lobbyId].table.startingStack)
        rooms[data.lobbyId].table.addPlayer(player)
      }
      
      emitNameAndStack(data.lobbyId)
      rooms[data.lobbyId].table.newHand();
    } 
  )

  socket.on('newName',function(data){
    rooms[data.lobbyId].players[socket.id] = new player.Player(data.playerName,socket.id)
    rooms[data.lobbyId].spectators.splice(rooms[data.lobbyId].spectators.indexOf(socket.id),1)
    rooms[data.lobbyId].table.removeSpectator(socket.id)
    emitNewName(data.lobbyId)
  })

  socket.on('sitDown',(data)=>{
    players[socket.id] = new player.Player(data.playerName,socket.id)
    spectators.splice(spectators.indexOf(socket.id),1)
    Table.addHoldPlayer(players[socket.id])

    if (Table.getStage() === 'prehand' && Table.getPlayers().concat(Table.sitInList.concat(Table.holdPlayers)).length >= 2){
      Table.newHand()
    }
    io.emit('nameAndStack', {players:players,pot:Table.getPot(),currentBet:Table.getCurrentBet(),activeNotSatOutPlayers:Table.getActiveNotSatOutPlayers()})
  })

  socket.on('sitOut', ()=>{
    Table.sitOut(players[socket.id])
  })

  socket.on('sitIn', ()=>{
    Table.sitIn(players[socket.id])
    
    if (Table.getStage() === 'prehand' && Table.getPlayers().concat(Table.sitInList.concat(Table.holdPlayers)).length >= 2){
      Table.newHand()
    }
    io.emit('nameAndStack', {players:players,pot:Table.getPot(),currentBet:Table.getCurrentBet(),activeNotSatOutPlayers:Table.getActiveNotSatOutPlayers()})
  })

  socket.on('bustOut', (data)=>{
    spectators.push(data)
    delete players[data]
    for (const id of spectators){
      setTimeout(function(){io.to(id).emit('sitDownButton')},500)
    }
  })

  socket.on('disconnect', () =>{
    const lobbyId = playerRoom[socket.id]

    if(lobbyId != undefined){
      console.log('disconnected', socket.id)
      Table.removePlayer(rooms[lobbyId].players[socket.id])   
      delete rooms[lobbyId].players[socket.id]
      delete playerRoom[socket.id]
      
      emitNewName(lobbyId)
      emitNameAndStack(lobbyId)
    }
    // handle disconnect  
  })

  socket.on('changePageState',(data)=>{
    emitPageState(data.lobbyId,data.page)
    emitNewName(data.lobbyId)
  })

  socket.on('fold', (data)=>{
    if (socket.id === rooms[data.lobbyId].table.currentPlayer.getSocketId()){
      rooms[data.lobbyId].table.fold()
    }
    emitNameAndStack(data.lobbyId)
  })

  socket.on('check', (data)=>{
    if (socket.id === rooms[data.lobbyId].table.currentPlayer.getSocketId()){
      rooms[data.lobbyId].table.check()
    }
    emitNameAndStack(data.lobbyId)
  })

  socket.on('call', (data)=>{
    if (socket.id === rooms[data.lobbyId].table.currentPlayer.getSocketId()){
      rooms[data.lobbyId].table.call()
    }
    
    emitNameAndStack(data.lobbyId)
  })

  socket.on('bet',(data)=>{
    if (socket.id === rooms[data.lobbyId].table.currentPlayer.getSocketId()){
      rooms[data.lobbyId].table.bet(data.betValue)
    }
    emitNameAndStack(data.lobbyId)
  })

  socket.on('raise',(data)=>{
    if (socket.id === rooms[data.lobbyId].table.currentPlayer.getSocketId()){
      rooms[data.lobbyId].table.raise(data.raiseValue)
    }
    emitNameAndStack(data.lobbyId)
  })

  socket.on('update', (lobbyId)=>{
    console.log('update')
    console.log('socketId of update:', socket.id)
    emitNameAndStack(lobbyId)
  })

  socket.on('checkFold', (data) =>{
    players[socket.id].setCheckFold(data)
  })

  socket.on('callAny', (data) =>{
    players[socket.id].setCallAny(data)
  })
}
)



