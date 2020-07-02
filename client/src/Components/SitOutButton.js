import React,{useState} from 'react'

function SitOutButton(props){
    function handleSubmit(event){
        event.preventDefault()
        props.setIsSitOut(false)
        props.socket.emit('sitOut')
    }
    return(
        <form onSubmit={handleSubmit}>
                <button>Sit Out</button>
        </form>
    )
}
export default SitOutButton