import React, {useEffect,useState} from 'react'
import Player from './Player'

function PlayersList(props){
    const [players,setPlayers] = useState([])

    useEffect(() => {
        props.socket.on("newName", data => {
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