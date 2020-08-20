import React, {useState,useEffect} from 'react'
import Header from './Components/Header'
import PlayersList from './Components/Settings/PlayersList'
import SettingsForm from './Components/Settings/SettingsForm'
import Game from './Game'
import LockedSettingsForm from './Components/Settings/LockedSettingsForm'
import Logo from './Images/Logo_blue.png'



export default function Main(props){ 
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
                <div className = 'header-div'>
                    <img className='logo' src={Logo} width="140px" height = '140px'></img>
                    <Header className='app-header'/>
                </div>
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
            <Game socket={props.socket} lobbyId={props.lobbyId}/>
        )
    }else{
        return(
            <p>Uh oh</p>
        )
    }
}