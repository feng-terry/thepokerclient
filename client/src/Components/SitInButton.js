import React,{useState} from 'react'

function SitInButton (props){
    const [name,setName] = useState("")

    function handleNameChange(event){
        setName(event.target.value)
    }
    
    function handleSubmit(event){
        event.preventDefault()
        props.setIsSitIn(false)
        props.socket.emit('sitIn', {
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
                <button>Sit In</button>
        </form>
    )
}

export default SitInButton