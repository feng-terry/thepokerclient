import React, {useState,useEffect} from 'react'
import Header from './Components/Header'
import PlayersList from './Components/Settings/PlayersList'
import SettingsForm from './Components/Settings/SettingsForm'
import Game from './Game'
import LockedSettingsForm from './Components/Settings/LockedSettingsForm'



export default function Temp(props){ 
    const [pageState,setPageState] = useState('settings')
    const [lobbyLeaderSocketId,setLobbyLeaderSocketId] = useState()

    useEffect(()=>{
        props.socket.emit('changePageState',{lobbyId:props.lobbyId})

        props.socket.on('pageState',(data)=>{
            setPageState(data)
        })

        props.socket.on('lobbyLeader',(data)=>{
            setLobbyLeaderSocketId(data)
        })
    },[])
    
    if (pageState === 'settings'){
        return(
            <div>
                <Header className='app-header'/>
                <div className='settings-box'>
                    {(lobbyLeaderSocketId === props.socket.id)? 
                        <SettingsForm socket= {props.socket} lobbyId={props.lobbyId}/>
                        :<LockedSettingsForm socket={props.socket} lobbyId={props.lobbyId}/>
                    }
                    <PlayersList socket = {props.socket} lobbyId={props.lobbyId}/>
                </div>
                <div className='lobby-link'>
                    <p id='lobby-id'>http://localhost:3000/id/{props.lobbyId}</p>
                </div>
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