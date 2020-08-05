import React, {useState} from 'react'

function NameForm (props){
    const [name,setName] = useState("")

    function handleNameChange(event){
        setName(event.target.value)
    }
    
    function handleSubmit(event){
        event.preventDefault()
        props.socket.emit('newName', {
            lobbyId:props.lobbyId,
            playerName:name
        })
    }

    return(
        <form onSubmit={handleSubmit}>
            <input 
                type='text' 
                placeholder='Enter Your Name'
                onChange={handleNameChange}
                value={name}/>
                <button>Enter</button>
        </form>
    )
}

export default NameForm