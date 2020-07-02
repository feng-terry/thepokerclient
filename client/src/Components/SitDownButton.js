import React,{useState} from 'react'

function SitDownButton (props){
    const [name,setName] = useState("")

    function handleNameChange(event){
        setName(event.target.value)
    }
    
    function handleSubmit(event){
        event.preventDefault()
        props.setIsSitDownn(false)
        props.socket.emit('sitDownn', {
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
                <button>Sit Down</button>
        </form>
    )
}

export default SitDownButton