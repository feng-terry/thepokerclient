import React from 'react'

function CreateGame(props){
    
    function handleClick(e){
        e.preventDefault()
        props.socket.emit('changePageState','settingsPage')
    }

    return (
        <button onClick = {handleClick}>Create Game</button>
    )
}

export default CreateGame