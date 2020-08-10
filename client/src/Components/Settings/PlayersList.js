import React, {useEffect,useState} from 'react'
import Player from './Player'
import NameForm from './NameForm';


function PlayersList(props){
    const [players,setPlayers] = useState([])

    useEffect(() => {
        props.socket.on("newName", data => {
            setPlayers(data);
        });
      }, []);
    const playerElements = Object.values(players).map(player => <Player playerName = {player.name}/>)

    return(
        <div className='settings-area' id='players-list'>
            <h1 className='settings-title'>Players</h1>
            <NameForm className = 'app-form' socket = {props.socket} lobbyId={props.lobbyId}/>
            {playerElements}
        </div>
    )
}

export default PlayersList