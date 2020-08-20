import React,{useState, useEffect} from 'react'
import { Link } from 'react-router-dom';

function JoinGame(props){
    const [id,setId]=useState()   
    const [validLobby,setValidLobby] = useState(false)
    const [errorMessage,setErrorMessage]=useState(false) 

    function handleClick(){
        props.setLobbyId(id)
        props.socket.emit('addSpectator',{lobbyId:id})
    }

    function handleInvalidClick(e){
        e.preventDefault()
        setErrorMessage(true)
    }

    function handleChange(e){
        setId(e.target.value)
    }

    useEffect(()=>{
        checkLobbyId()
            .then(res => setValidLobby(res))
            .catch(err => console.log(err))
    },[id])

    useEffect(()=>{
        if (validLobby){
            setErrorMessage(false)
        }
    },[validLobby])

    let checkLobbyId = async ()=>{
        const response = await fetch('/checkLobbyId/' + id)
        const body = await response.json()

        if (response.status !== 200){
            throw Error(body.message)
        }
        return body;
    }

    return (
        <form className = 'join-game'>
            <div className='button-container-div'>
                <input 
                    type='text' 
                    placeholder='Enter Lobby Id' 
                    value={id} 
                    onChange={handleChange}
                    className='homepage-input'
                />
            </div>
            {validLobby?
                <div className='button-container-div'>
                    <Link to="/game">
                        <button className='homepage-button' onClick ={handleClick}>Join Game</button>
                    </Link>
                </div>
                :<div className='button-container-div'>
                    <button className='homepage-button' onClick={handleInvalidClick}>Join Game</button>
                </div>}
            {errorMessage? <p id='invalid-lobby'>Invalid Lobby Id</p>:null}

        </form>
    )

}

export default JoinGame