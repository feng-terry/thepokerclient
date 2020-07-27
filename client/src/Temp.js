import React, {useState,useEffect} from 'react'
import Header from './Components/Header'
import NameForm from './Components/NameForm'
import PlayersList from './Components/Settings/PlayersList'
import SettingsForm from './Components/Settings/SettingsForm'
import Game from './Game'



export default function Temp(props){ 
    const [pageState,setPageState] = useState('settings')

    useEffect(()=>{
        props.socket.on('pageState',(data)=>{
            setPageState(data)
        })
    },[])

    
    if (pageState === 'settings'){
        return(
            <div>
                <Header className='app-header'/>
                <NameForm className = 'app-form' socket = {props.socket} lobbyId={props.lobbyId}/>
                <PlayersList socket = {props.socket}/>
                <p>Lobby Id:{props.lobbyId}</p>
                <SettingsForm socket= {props.socket} lobbyId={props.lobbyId}/>
            </div>
        )
    } else if (pageState === 'game'){
        return(
            <div>
                <Game socket={props.socket} lobbyId={props.lobbyId}/>
            </div>
        )
    }else{
        return(
            <p>Uh oh</p>
        )
    }
}