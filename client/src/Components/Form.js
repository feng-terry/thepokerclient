import React, {useState} from 'react'

function Form (){
    const [name,setName] = useState("")

    function handleNameChange(event){
        setName(event.target.value)
    }

    function handleSubmit(event){
        event.preventDefault()
        console.log(name)
        

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