import React, {useState,useEffect} from 'react'
import Header from './Components/Header'
import Form from './Components/Form'
import PlayersList from './Components/Settings/PlayersList'
import SettingsForm from './Components/Settings/SettingsForm'



export default function Temp(props){ 
    useEffect(()=>{

    },[])

    return(
        <div>
            <Header className='app-header'/>
            <Form className = 'app-form' socket = {props.socket}/>
            <PlayersList socket = {props.socket}/>
            <SettingsForm socket= {props.socket}/>
            <p>Lobby Id:{props.lobbyId}</p>
        </div>
    )
}