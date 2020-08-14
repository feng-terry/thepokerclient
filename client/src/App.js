import React, {useState,useEffect} from 'react';
import socketIOClient from "socket.io-client"
import {Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './Components/Home'
import Temp from './Temp'
import WaitingScreen from './Components/WaitingScreen'

const socket = socketIOClient("http://localhost:3000")

function App(){
  const [data,setData] = useState(null)
  const [lobbyId,setLobbyId] = useState(null)

  useEffect(()=>{
    // Call our fetch function below once the component mounts
    callBackendAPI()
      .then(res => setData(res.express))
      .catch(err => console.log(err));

    socket.on('updateLobbyId', data=>{
      setLobbyId(data)
    })
  },[])

    // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  let callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };


    return(
      <main>
        <Switch>
          <Route path="/" render={(routeProps)=><Home data={data} socket={socket} setLobbyId = {setLobbyId} {...routeProps}/>} exact/>
          <Route path="/game" render={(routeProps)=><Temp socket={socket} lobbyId = {lobbyId} {...routeProps}/>}/>
          <Route path='/id' render = {(routeProps)=><WaitingScreen socket={socket} lobbyId = {lobbyId} setLobbyId = {setLobbyId} {...routeProps}/>}/>
        </Switch>
      </main>
    )
    /*if (this.state.page === 'homePage'){
      return(<div>
                <Header className='app-header'/>
                <CreateGame socket = {socket}/>
                <p className="App-intro">{this.state.data}</p>
            </div>)
    } else if (this.state.page === 'settingsPage'){
      return(<div>
                <Header className='app-header'/>
                <Form className = 'app-form' socket = {socket}/>
                <PlayersList socket = {socket}/>
                <SettingsForm socket= {socket}/>
                <p className="App-intro">{this.state.data}</p>
            </div>)
    } else if (this.state.page === 'gamePage'){
      return(<div>
              <Game socket={socket}/>
            </div>)
    }*/
  }


export default App;