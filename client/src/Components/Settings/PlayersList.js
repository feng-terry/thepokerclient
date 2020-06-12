import React, {useEffect,useState} from 'react'
import socketIOClient from 'socket.io-client'
import Player from './Player'

function PlayersList(){
    const [players,setPlayers] = useState([])

    useEffect(() => {
        console.log(2)
        const socket = socketIOClient('http://localhost:3000');
        socket.on("newName", data => {
            setPlayers(data);
        });
      }, []);

    const playerElements = Object.values(players).map(player => <Player playerName = {player}/>)

    return(
        <div id="playersListBox">
            <p>{playerElements}</p>
        </div>
    )
}

export default PlayersList