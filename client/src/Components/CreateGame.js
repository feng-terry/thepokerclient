import React from 'react'
import { Link } from 'react-router-dom';

function CreateGame(props){
    let generateLobbyId = async ()=>{
        const response = await fetch('/generateLobbyId')
        const body = await response.json()

        props.socket.emit('newRoom',{lobbyId:body.lobbyId})

        if (response.status !== 200) {
            throw Error(body.message) 
          }
        return body;
    }
    
    function handleClick(){
        generateLobbyId()
            .then(res => props.setLobbyId(res.lobbyId))
            .catch(err => console.log(err))

    }
    return (
        <Link to="/game">
            <button onClick = {handleClick}>Create Game</button>
        </Link>
    )
}

export default CreateGame