import React,{useState} from 'react'

function SitDownButton (props){
    const [name,setName] = useState("")

    function handleNameChange(event){
        setName(event.target.value)
    }
    
    function handleSubmit(event){
        event.preventDefault()
        props.setIsSitDown(false)
        props.socket.emit('sitDown', {
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
                value={name}
                className='sit-input'/>
                <button className='decision-button'>Sit Down</button>
        </form>
    )
}

export default SitDownButton