import React, {useState} from 'react'
import "./style.css"

function SettingsForm(props){
    const [startingStack, setStartingStack] = useState(0.0)
    const [blinds,setBlinds] = useState(0)
    const [seats,setSeats] = useState(6)
    const [lobbyName,setLobbyName] = useState("")
    const [timer,setTimer] = useState(0)
    const [antes,setAntes] = useState(0)
    const [blindsPercentage,setBlindsPercentage]=useState(0)
    const [blindsIncreaseTimer,setBlindsIncreaseTimer]=useState(0)

    function handleSubmit(e){
        e.preventDefault()
        props.socket.emit('changePageState',{lobbyId:props.lobbyId,page:'game'})
        props.socket.emit('newGame',{
            startingStack:Number(startingStack),
            blinds:Number(blinds),
            seats:Number(seats),
            lobbyName:lobbyName,
            antes:Number(antes),
            blindsPercentage:Number(blindsPercentage)/100,
            blindsIncreaseTimer:Number(blindsIncreaseTimer),
            timer:Number(timer),
            lobbyId:props.lobbyId
            }
        )
        console.log('submitted Form')
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
                            <input type="checkbox"
                            id="ante-switch"
                            />
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

                    <label for="raise-blinds-switch">Raise Blinds:</label>
                        <label className="switch">
                            <input type="checkbox" id="raise-blinds-switch"/>
                            <span className="slider round"></span>
                    </label>

                    <div className="raise-blinds">
                        <p>Raise blind by </p> 
                        <input
                        type="number"
                        size="3"
                        onChange={(event)=>setBlindsPercentage(event.target.value)}
                        />
                        <p>% every</p>
                        <input
                        type="number"
                        size="3"
                        onChange={(event)=>setBlindsIncreaseTimer(event.target.value)}
                        />
                        <p>hands.</p>
                    </div>
                    <div className='timer'>
                        <p>Turn Timer:</p>

                        <input 
                        type="radio"
                        id="15-seconds"
                        name='timer'
                        onClick={()=>setTimer(15)}
                        />
                        <label for="15-seconds" onClick={()=>setTimer(15)}>15 Seconds</label>

                        <input 
                        type="radio"
                        id="30-seconds"
                        name='timer'
                        onClick={()=>setTimer(30)}
                        />
                        <label for="30-seconds" onClick={()=>setTimer(30)}>30 Seconds</label>
                        
                        <input 
                        type="radio"
                        id="120-seconds"
                        name='timer'
                        onClick={()=>setTimer(120)}
                        />
                        <label for="120-seconds" onClick={()=>setTimer(120)}>2 Minutes</label>
                    </div>

                    <button>Start</button>
                </form>
            </div>
        )
    }

export default SettingsForm