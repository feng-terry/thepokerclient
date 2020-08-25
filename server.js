const table = require('./modules/table')
const player = require('./modules/player')
const express = require('express')
const path = require('path')
const http = require("http")
const socket = require('socket.io')
const app = express()
const port = process.env.PORT || 5000
let rooms = {}
let playerRoom = {}


// console.log that your server is up and running
const server = app.listen(port, () => console.log(`Listening on port ${port}`))
const io = socket(server)

//Express
const root = require('path').join(__dirname, 'client', 'build')
app.use(express.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})

app.use(cors());
//app.use('/static', express.static(path.join(__dirname, 'client/build')))

app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' })
})

app.get('/generateLobbyId', (req,res) => {
  const id = (Math.random()+1).toString(36).slice(2,18)
  rooms[id] = {players:{},spectators:[],table:new table.Table(io,id),lobbyLeader:'',pageState:'settings'}
  res.send({lobbyId:id})
})

app.get('/id/:id', (req, res) => {
  if (Object.keys(rooms).includes(req.params.id)){
    res.send({lobbyId:req.params.id,inRoom:true})
  }   
})

app.get('/checkMinPlayers/:id', (req, res) => {
  res.send((Object.keys(rooms[req.params.id].players)).length > 1)
})

app.get('/checkLobbyId/:id', (req, res) => {
  res.send((Object.keys(rooms).includes(req.params.id)))
})

/*app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});*/

//Helper Functions
function emitNewName(lobbyId){
  const emitTo = Object.keys(rooms[lobbyId].players).concat(rooms[lobbyId].spectators)
  for (const id of emitTo){
    io.to(id).emit('newName',rooms[lobbyId].players)
  }
}

function emitNameAndStack(lobbyId){
  rooms[lobbyId].spectators = Array.from(new Set(rooms[lobbyId].spectators))
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

function emitSitDownButton(lobbyId){
  const avaiableSeats = rooms[lobbyId].table.hasSeats()
  for (const id of rooms[lobbyId].spectators){
    setTimeout(function(){io.to(id).emit('sitDownButton',avaiableSeats)},500)
  } 
}

function emitInGame(lobbyId){
  const emitTo = Object.keys(rooms[lobbyId].players).concat(rooms[lobbyId].spectators)
  for (const id of emitTo){
    io.to(id).emit('inGame',rooms[lobbyId].table.inGame(rooms[lobbyId].players[id]))
  }
}

function emitLobbyLeader(lobbyId){
  const emitTo = Object.keys(rooms[lobbyId].players).concat(rooms[lobbyId].spectators)
  for (const id of emitTo){
    io.to(id).emit('lobbyLeader',rooms[lobbyId].lobbyLeader)
  }
}

function emitLockedSettings(lobbyId,data){
  const emitTo = Object.keys(rooms[lobbyId].players).concat(rooms[lobbyId].spectators)
  for (const id of emitTo){
    io.to(id).emit('lockedSettings',data)
  }
}

function deleteEmptyLobbies(){
  for (const lobbyId in rooms){
    if (Object.keys(rooms[lobbyId].players).concat(rooms[lobbyId].spectators).length <= 0){
      delete rooms[lobbyId]
    }
  }
}

////////////////////////////

io.on('connection',(socket) =>{
  console.log('made socket connection', socket.id)
  
  socket.on('addSpectator',(data)=>{
    if (Object.keys(rooms).includes(data.lobbyId)){
      rooms[data.lobbyId].spectators.push(socket.id)
      rooms[data.lobbyId].table.addSpectator(socket.id)
      playerRoom[socket.id] = data.lobbyId
      emitLobbyLeader(data.lobbyId)
      io.to(socket.id).emit('updateLobbyId',data.lobbyId)
      emitNewName(data.lobbyId)

      if (rooms[data.lobbyId].pageState === 'game' && rooms[data.lobbyId].table.hasSeats()){
        setTimeout(()=>{io.to(socket.id).emit('sitDownButton',true)},1000)
      }
    }
  })

  socket.on('newRoom',(data)=>{
    rooms[data.lobbyId].lobbyLeader = socket.id
    rooms[data.lobbyId].spectators.push(socket.id)
    playerRoom[socket.id] = data.lobbyId
    emitLobbyLeader(data.lobbyId)
    io.to(socket.id).emit('updateLobbyId',data.lobbyId)
  })

  socket.on('newGame',(data)=>{
      rooms[data.lobbyId].table.setSettings(data)
      for (const player of Object.values(rooms[data.lobbyId].players)){
        player.addStack(rooms[data.lobbyId].table.startingStack)
        rooms[data.lobbyId].table.addPlayer(player)
      }
      emitInGame(data.lobbyId)
      emitNameAndStack(data.lobbyId)
      rooms[data.lobbyId].table.newHand();
    } 
  )

  socket.on('newName',function(data){
    if (Object.keys(rooms).includes(data.lobbyId)){
      rooms[data.lobbyId].players[socket.id] = new player.Player(data.playerName,socket.id)
      rooms[data.lobbyId].spectators.splice(rooms[data.lobbyId].spectators.indexOf(socket.id),1)
      rooms[data.lobbyId].table.removeSpectator(socket.id)
      emitNewName(data.lobbyId)
    }
  })

  socket.on('sitDown',(data)=>{
    rooms[data.lobbyId].players[socket.id] = new player.Player(data.playerName,socket.id)
    rooms[data.lobbyId].spectators.splice(rooms[data.lobbyId].spectators.indexOf(socket.id),1)
    rooms[data.lobbyId].table.removeSpectator(socket.id)
    rooms[data.lobbyId].table.addHoldPlayer(rooms[data.lobbyId].players[socket.id])

    if (rooms[data.lobbyId].table.getStage() === 'prehand' && rooms[data.lobbyId].table.getPlayers().concat(rooms[data.lobbyId].table.sitInList.concat(rooms[data.lobbyId].table.holdPlayers)).length >= 2){
      rooms[data.lobbyId].table.newHand()
    }
    emitInGame(data.lobbyId)
    emitSitDownButton(data.lobbyId) //Takes away the sit down button
    emitNameAndStack(data.lobbyId)
  })

  socket.on('sitOut', (data)=>{
    console.log('in the listener')
    rooms[data.lobbyId].table.sitOut(rooms[data.lobbyId].players[socket.id])
  })

  socket.on('sitIn', (data)=>{
    rooms[data.lobbyId].table.sitIn(rooms[data.lobbyId].players[socket.id])
    
    if (rooms[data.lobbyId].table.getStage() === 'prehand' && rooms[data.lobbyId].table.getPlayers().concat(rooms[data.lobbyId].table.sitInList.concat(rooms[data.lobbyId].table.holdPlayers)).length >= 2){
      rooms[data.lobbyId].table.newHand()
    }
    emitNameAndStack(data.lobbyId)
  })

  socket.on('bustOut', (data)=>{
    rooms[data.lobbyId].spectators.push(data.socketId)
    rooms[data.lobbyId].table.spectators.push(data.socketId)
    delete rooms[data.lobbyId].players[data.socketId]
    emitInGame(data.lobbyId)
    emitSitDownButton(data.lobbyId)
  })

  socket.on('disconnect', () =>{
    const lobbyId = playerRoom[socket.id]

    if(Object.keys(rooms).includes(lobbyId)){
      console.log('disconnected', socket.id)
      rooms[lobbyId].table.removePlayer(rooms[lobbyId].players[socket.id])   
      delete rooms[lobbyId].players[socket.id]
      delete playerRoom[socket.id]

      emitInGame(lobbyId)
      emitSitDownButton(lobbyId)
      emitNewName(lobbyId)
      emitNameAndStack(lobbyId)
      deleteEmptyLobbies()
    }
    // handle disconnect  
  })

  socket.on('changePageState',(data)=>{
    if (Object.keys(rooms).includes(data.lobbyId)){
      if (data.page != undefined){
        rooms[data.lobbyId].pageState = data.page
      }
      emitPageState(data.lobbyId,rooms[data.lobbyId].pageState)
      emitNewName(data.lobbyId)
      setTimeout(()=>{emitNameAndStack(data.lobbyId)},500)
    }
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
    if (Object.keys(rooms).includes(lobbyId)){
      emitNameAndStack(lobbyId)
    }
  })

  socket.on('checkFold', (data) =>{
    rooms[data.lobbyId].players[socket.id].setCheckFold(data.value)
  })

  socket.on('callAny', (data) =>{
    rooms[data.lobbyId].players[socket.id].setCallAny(data.value)
  })

  socket.on('lockedSettings',(data)=>{
    if (Object.keys(rooms).includes(data.lobbyId)){
      emitLockedSettings(data.lobbyId,data)

    }
  })
}
)



