import React from 'react'
import Header from './Header'
import CreateGame from './CreateGame'
import {useEffect} from 'react'
import JoinGame from './JoinGame'
import Logo from '../Images/Logo_blue.png'

export default function Home(props){

    useEffect(()=>{
        props.setLobbyId('')
    },[])

    return(
        <div>
            <div className='header-div'>
                <img className='logo' src={Logo} width="140px" height = '140px'></img>
                <Header className='app-header'/>
            </div>
            <div className='homepage-button-box'>
                <CreateGame socket={props.socket} setLobbyId = {props.setLobbyId}/>
                <JoinGame socket={props.socket} setLobbyId = {props.setLobbyId}/>
            </div>
        </div>
    )
}