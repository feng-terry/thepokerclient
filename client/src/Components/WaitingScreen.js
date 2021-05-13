import React,{useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import Main from '../Main'

export default function WaitingScreen(props){
    const location = useLocation()
    const [inRoom,setInRoom] = useState(false)

    useEffect(()=>{
        console.log(location.pathname)
        callRoomIdApi()
            .then(res => {
                props.setLobbyId(res.lobbyId)
                setInRoom(res.inRoom)
            })
            .catch(err => console.log(err))
    },[])

    let callRoomIdApi = async () => {
        const response = await fetch("/backend" + location.pathname.substring(1));
        const body = await response.json();

        props.socket.emit('addSpectator', {lobbyId:body.lobbyId})
    
        if (response.status !== 200) {
          throw Error(body.message) 
        }
        return body;
      };

    return(
        <div style={{height:'100%'}}>
            {inRoom? <Main socket={props.socket} lobbyId={props.lobbyId}/>:<p>Loading</p>}
        </div>
    )
}