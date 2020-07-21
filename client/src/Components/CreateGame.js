import React from 'react'
import { Link } from 'react-router-dom';

function CreateGame(props){
    
    function handleClick(){
        props.socket.emit('consolelog')
        console.log(props)
    }
    return (
        <Link to="/game">
            <button onClick = {handleClick}>Create Game</button>
        </Link>
    )
}

export default CreateGame