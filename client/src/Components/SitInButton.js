import React,{useState} from 'react'

function SitInButton(props){
    function handleSubmit(event){
        event.preventDefault()
        props.setIsSitOut(true)
        props.socket.emit('sitIn',{lobbyId:props.lobbyId})
    }
    return(
        <form onSubmit={handleSubmit}>
                <button className='decision-button'>Sit In</button>
        </form>
    )
}
export default SitInButton