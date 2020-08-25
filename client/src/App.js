import React, {useState,useEffect} from 'react';
import socketIOClient from "socket.io-client"
import {Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './Components/Home'
import Main from './Main'
import WaitingScreen from './Components/WaitingScreen'

const socket = socketIOClient("http://localhost:3000")

function App(){
  const [data,setData] = useState(null)
  const [lobbyId,setLobbyId] = useState(null)

  useEffect(()=>{
    socket.on('updateLobbyId', data=>{
      setLobbyId(data)
    })
  },[])

    return(
      <main>
        <Switch>
          <Route path="/" render={(routeProps)=><Home socket={socket} setLobbyId = {setLobbyId} {...routeProps}/>} exact/>
          <Route path="/game" render={(routeProps)=><Main socket={socket} lobbyId = {lobbyId} {...routeProps}/>}/>
          <Route path='/id' render = {(routeProps)=><WaitingScreen socket={socket} lobbyId = {lobbyId} setLobbyId = {setLobbyId} {...routeProps}/>}/>
        </Switch>
      </main>
    )
  }


export default App;