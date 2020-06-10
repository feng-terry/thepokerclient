import React, { Component } from 'react';
import './App.css';
import Header from './Components/Header'
import Form from './Components/Form'
import SettingsForm from './Components/Settings/SettingsForm'
import DecisionBar from './Components/DecisionBar';


class App extends Component {
state = {
    data: null
  };

  componentDidMount() {
      // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));
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
    return (
      <div>
        <Header className='app-header'/>
        <Form className = 'app-form'/>
        <SettingsForm/>
        <DecisionBar/>
        <p className="App-intro">{this.state.data}</p>
    </div>
    );
  }
}

export default App;