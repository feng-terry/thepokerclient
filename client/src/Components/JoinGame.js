import React,{useState} from 'react'
import { Link } from 'react-router-dom';

function JoinGame(props){
    const [id,setId]=useState()    

    function handleClick(){
        console.log(id)
        props.setLobbyId(id)
    }

    return (
        <form>
            <input 
                type='text' 
                placeholder='Enter Lobby Id' 
                value={id} 
                onChange={(e)=>{setId(e.target.value)}}
            />
            <Link to="/game">
                <button onClick ={handleClick}>Join Game</button>
            </Link>
        </form>
    )
}

export default JoinGame