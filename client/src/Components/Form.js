import React, {useState} from 'react'
import socketIOClient from 'socket.io-client'
const socket = socketIOClient("http://localhost:5000")

function Form (){
    const [name,setName] = useState("")

    function handleNameChange(event){
        setName(event.target.value)
    }

    function handleSubmit(event){
        event.preventDefault()
        socket.emit('newName', {
            name:name
        })
    }

    return(
        <form onSubmit={handleSubmit}>
            <input 
                type='text' 
                placeholder='Enter Your Name'
                onChange={handleNameChange}
                value={name}/>
                <button>Create Game</button>
        </form>
    )
}

export default Form