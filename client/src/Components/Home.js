import React from 'react'
import Header from './Header'
import CreateGame from './CreateGame'
import {useEffect} from 'react'
import JoinGame from './JoinGame'

export default function Home(props){
    return(
        <div>
            <Header className='app-header'/>
            <CreateGame socket={props.socket} setLobbyId = {props.setLobbyId}/>
            <JoinGame socket={props.socket} setLobbyId = {props.setLobbyId}/>
            <p>{props.data}</p>
        </div>
    )
}