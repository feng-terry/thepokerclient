import React, { Component } from 'react';
import socketIOClient from "socket.io-client"
import './App.css';
import Header from './Components/Header'
import Form from './Components/Form'
import SettingsForm from './Components/Settings/SettingsForm'
import DecisionBar from './Components/DecisionBar';
import PlayersList from './Components/Settings/PlayersList';
import CreateGame from './Components/CreateGame';
import Game from './Game';

const socket = socketIOClient("http://localhost:3000")


class App extends Component {
state = {
    data: null,
    page:'homePage',
  };

  componentDidMount() {
      // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));

    socket.on('pageState', data => {
      this.setState({page:data})
    })
  }
    // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  render() {
    if (this.state.page === 'homePage'){
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
              <Game/>
            </div>)
    }
  }
}

export default App;