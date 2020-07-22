const table = require('./modules/table')
const player = require('./modules/player')
const express = require('express')
const http = require("http")
const socket = require('socket.io')
const app = express()
const port = process.env.PORT || 5000
let rooms = {}
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
  rooms[id] = {players:{},spectators:[],table:new table.Table(io),lobbyLeader:''}
  res.send({lobbyId:id})
})

app.use(express.static('/client/public'))

let Table = new table.Table(io)

io.on('connection',(socket) =>{
  socket.on('consolelog',()=>{
  console.log('working')
  })

  const playerId = socket.id
  spectators.push(playerId) 

  console.log('made socket connection', socket.id)

  io.emit('pageState',pageState)
  setTimeout((function() {io.emit('newName',players)}), 375)

  if (pageState === 'gamePage'){
    for (const id of spectators){
      setTimeout(function(){io.to(id).emit('sitDownButton')},500)
    }
    setTimeout(function(){io.emit('nameAndStack', {players:players,pot:Table.getPot(),currentBet:Table.getCurrentBet(),activeNotSatOutPlayers:Table.getActiveNotSatOutPlayers()})},500)
  }

  socket.on('newRoom',(data)=>{
    rooms[data.lobbyId].lobbyLeader = socket.id
    console.log(rooms)
  })

  socket.on('newGame',(data)=>{
      Table.setSettings(data)
      
      for (const player of Object.values(players)){
        player.addStack(Table.startingStack)
        Table.addPlayer(player)
      }
      
      io.emit('nameAndStack', {players:players,pot:Table.getPot(),currentBet:Table.getCurrentBet(),activeNotSatOutPlayers:Table.getActiveNotSatOutPlayers()})
      Table.newHand();
      

    } 
  )

  socket.on('newName',function(data){
    players[socket.id]=new player.Player(data.playerName,socket.id)
    spectators.splice(spectators.indexOf(socket.id),1)
    io.emit('newName',players)
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
    console.log('disconnected', socket.id)
    Table.removePlayer(players[playerId])
    delete players[playerId]
    
    io.emit('newName',players)
    io.emit('nameAndStack', {players:players,pot:Table.getPot(),currentBet:Table.getCurrentBet(),activeNotSatOutPlayers:Table.getActiveNotSatOutPlayers()})
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
    io.emit('nameAndStack', {players:players,pot:Table.getPot(),currentBet:Table.getCurrentBet(),activeNotSatOutPlayers:Table.getActiveNotSatOutPlayers()})
  })

  socket.on('check', ()=>{
    if (socket.id === Table.currentPlayer.getSocketId()){
      Table.check()
    }
    io.emit('nameAndStack', {players:players,pot:Table.getPot(),currentBet:Table.getCurrentBet(),activeNotSatOutPlayers:Table.getActiveNotSatOutPlayers()})
  })

  socket.on('call', ()=>{
    if (socket.id === Table.currentPlayer.getSocketId()){
      Table.call()
    }
    
    io.emit('nameAndStack', {players:players,pot:Table.getPot(),currentBet:Table.getCurrentBet(),activeNotSatOutPlayers:Table.getActiveNotSatOutPlayers()})
  })

  socket.on('bet',(betValue)=>{
    if (socket.id === Table.currentPlayer.getSocketId()){
      Table.bet(betValue)
    }
    io.emit('nameAndStack', {players:players,pot:Table.getPot(),currentBet:Table.getCurrentBet(),activeNotSatOutPlayers:Table.getActiveNotSatOutPlayers()})
  })

  socket.on('raise',(raiseValue)=>{
    if (socket.id === Table.currentPlayer.getSocketId()){
      Table.raise(raiseValue)
    }
    io.emit('nameAndStack', {players:players,pot:Table.getPot(),currentBet:Table.getCurrentBet(),activeNotSatOutPlayers:Table.getActiveNotSatOutPlayers()})
  })

  socket.on('update', ()=>{
    io.emit('nameAndStack', {players:players,pot:Table.getPot(),currentBet:Table.getCurrentBet(),activeNotSatOutPlayers:Table.getActiveNotSatOutPlayers()})
  })

  socket.on('checkFold', (data) =>{
    players[socket.id].setCheckFold(data)
  })

  socket.on('callAny', (data) =>{
    players[socket.id].setCallAny(data)
  })
}
)



