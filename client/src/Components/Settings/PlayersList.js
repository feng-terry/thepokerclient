import React, {useEffect,useState} from 'react'
import socketIOClient from 'socket.io-client'

function PlayersList(){
    const [players,setPlayers] = useState([])

    useEffect(() => {
        const socket = socketIOClient('http://localhost:3000');
        socket.on("newName", data => {
            setPlayers(data.name);
        });
      }, []);



    return(
        <div id="playersListBox">
            <p>{players}</p>
        </div>
    )
}

export default PlayersList