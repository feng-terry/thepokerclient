import React, {useState} from 'react'
import "./style.css"

function SettingsForm(props){
    const [startingStack, setStartingStack] = useState(0.0)
    const [blinds,setBlinds] = useState(0)
    const [seats,setSeats] = useState(6)
    const [lobbyName,setLobbyName] = useState("")
    const [antes,setAntes] = useState(0)

    function handleSubmit(e){
        e.preventDefault()
        props.socket.emit('changePageState','gamePage')
        props.socket.emit('newGame',{
            startingStack:Number(startingStack),
            blinds:Number(blinds),
            seats:Number(seats),
            lobbyName:lobbyName,
            antes:Number(antes)
            }
        )
    }


        return(
            <div id="settings">
                <h1>Settings</h1>
                <form onSubmit={handleSubmit}>
                    
                    <label for="lobbyname">Lobby name: </label>
                    <input 
                    id="lobbyname" 
                    type="text" 
                    onChange={(event) => setLobbyName(event.target.value)}
                    value={lobbyName}/>
                    <br/>

                    <label for="startingStack">Starting stack:</label>
                    <input 
                    id="startingStack" 
                    type="number" 
                    onChange={(event) => setStartingStack(event.target.value)}
                    value={startingStack}/>
                    <br/>

                    <label for="blinds">Big blind: </label>
                    <input 
                    id="blinds" 
                    type="number" 
                    onChange={(event) => setBlinds(event.target.value)}
                    value = {blinds}
                    />
                    <p><em>Note: Small blind is always half of big blind.</em></p>

                    <div id="ante-block">
                        <label for="ante-switch">Antes:</label>
                        <label className="switch">
                            <input type="checkbox" id="ante-switch"/>
                            <span className="slider round"></span>
                        </label>
                    
                        
                    </div>
                    <label for="antes">Set Antes: </label>
                        <input 
                        id="antes" 
                        type="number" 
                        value={antes}
                        onChange={(event) => setAntes(event.target.value)}
                        />
                    <br/>
                    <br/>
                    <div>
                        <p id="seats-text">Set Seats:</p>

                        <input 
                        type="radio"
                        id="two-seats"
                        name="seats"
                        />
                        <label for="two-seats" onClick={()=>setSeats(2)}>2</label>

                        <input 
                        type="radio"
                        id="six-seats"
                        name="seats"
                        />
                        <label for="six-seats" onClick={()=>setSeats(6)}>6</label>
                        
                        <input 
                        type="radio"
                        id="nine-seats"
                        name="seats"
                        />
                        <label for="nine-seats" onClick={()=>setSeats(9)}>9</label>
                    </div>
                    <br/>
                    <button>Start</button>
                </form>
            </div>
        )
    }

export default SettingsForm