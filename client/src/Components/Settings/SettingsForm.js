import React, {useState,useEffect} from 'react'
import "./style.css"

function SettingsForm(props){
    const [startingStack, setStartingStack] = useState(0.0)
    const [blinds,setBlinds] = useState(0)
    const [seats,setSeats] = useState(6)
    const [lobbyName,setLobbyName] = useState("")
    const [timer,setTimer] = useState(0)
    const [anteSwitch,setAnteSwitch]=useState(false)
    const [antes,setAntes] = useState(0)
    const [blindsSwitch, setBlindsSwitch]=useState(false)
    const [blindsPercentage,setBlindsPercentage]=useState(0)
    const [blindsIncreaseTimer,setBlindsIncreaseTimer]=useState(0)
    const [canStart,setCanStart] = useState(false)

    

    let checkMinPlayers = async ()=>{
        const response = await fetch('/checkMinPlayers/' + props.lobbyId)
        const body = await response.json()
        
        if (response.status !== 200) {
            throw Error(body.message) 
          }
        return body;
    }

    function handleSubmit(e){
        e.preventDefault()
        checkMinPlayers()
            .then(res => setCanStart(res))
            .catch(err => console.log(err))
    }

    useEffect(()=>{
        if(canStart){
            props.socket.emit('changePageState',{lobbyId:props.lobbyId,page:'game'})
            props.socket.emit('newGame',{
                startingStack:Number(startingStack),
                blinds:Number(blinds),
                seats:Number(seats),
                lobbyName:lobbyName,
                anteSwitch:anteSwitch,
                antes:Number(antes),
                blindsSwitch:blindsSwitch,
                blindsPercentage:Number(blindsPercentage)/100,
                blindsIncreaseTimer:Number(blindsIncreaseTimer),
                timer:Number(timer),
                lobbyId:props.lobbyId
                }
            )
        }
    },[canStart])

    useEffect(()=>{
        emitSettings()
    },[
        lobbyName,
        startingStack,
        blinds,
        seats,
        anteSwitch,
        antes,
        blindsSwitch,
        blindsPercentage,
        blindsIncreaseTimer,
        timer
    ])

    function emitSettings(){
        props.socket.emit('lockedSettings',
        {
            lobbyName:lobbyName,
            startingStack:startingStack,
            blinds:blinds,
            seats:seats,
            anteSwitch:anteSwitch,
            antes:antes,
            blindsSwitch,
            blindsPercentage:blindsPercentage,
            blindsIncreaseTimer:blindsIncreaseTimer,
            timer:timer,
            lobbyId:props.lobbyId
        })
    }

    return(
        <div className="settings-area">
            <h1 className='settings-title'>Settings</h1>
            <form onSubmit={handleSubmit}>
                
                <label for="lobbyname">Lobby name:</label>
                <input 
                id="lobbyname" 
                type="text" 
                onChange={(e)=>setLobbyName(e.target.value)}
                value={lobbyName}
                className='settings-input'/>
                <br/>

                <label for="startingStack">Starting stack:</label>
                <input 
                id="startingStack" 
                type="number" 
                onChange={(event) => setStartingStack(event.target.value)}
                value={startingStack}
                className='settings-input'/>
                <br/>

                <label for="blinds">Big blind:</label>
                <input 
                id="blinds" 
                type="number" 
                onChange={(event) => setBlinds(event.target.value)}
                value = {blinds}
                className='settings-input'
                />
                <br></br>
                <p id='note'><em>Note: Small blind is always half of big blind.</em></p>

                <div id="ante-block">
                    <label for="ante-switch">Antes:</label>
                    <label className="switch">
                        <input 
                        type="checkbox"
                        id="ante-switch"
                        onChange={()=>setAnteSwitch(!anteSwitch)}
                        />
                        <span className="slider round"></span>
                    </label>   
                </div>
                
                <label for="antes">Set Antes:</label>
                    <input 
                    id="antes" 
                    type="number" 
                    value={antes}
                    onChange={(event) => setAntes(event.target.value)}
                    className='settings-input'
                    />
                <br/>
                <br/>
                <div>
                    <label id="seats-text">Set Seats:</label>

                    <input 
                    type="radio"
                    id="two-seats"
                    name="seats"
                    onClick={()=>setSeats(2)}
                    />
                    <label for="two-seats" onClick={()=>setSeats(2)}>2</label>

                    <input 
                    type="radio"
                    id="six-seats"
                    name="seats"
                    onClick={()=>setSeats(6)}
                    />
                    <label for="six-seats" onClick={()=>setSeats(6)}>6</label>
                    
                    <input 
                    type="radio"
                    id="nine-seats"
                    name="seats"
                    onClick={()=>setSeats(9)}
                    />
                    <label for="nine-seats" onClick={()=>setSeats(9)}>9</label>
                </div>

                <label for="raise-blinds-switch">Raise Blinds:</label>
                    <label className="switch">
                        <input 
                        type="checkbox"
                        id="raise-blinds-switch"
                        onChange={()=>setBlindsSwitch(!blindsSwitch)}/>
                        <span className="slider round"></span>
                </label>
                <br/>              
                <span className="raise-blinds">
                    <label htmlFor='raise-blinds-number'>Raise blind by</label> 
                    <input
                    type="number"
                    size="3"
                    onChange={(event)=>setBlindsPercentage(event.target.value)}
                    id='raise-blinds-number'
                    className='settings-input'
                    />
                    <label htmlFor='raise-blinds-turns'>% every</label>
                    <input
                    type="number"
                    size="3"
                    onChange={(event)=>setBlindsIncreaseTimer(event.target.value)}
                    id='raise-blinds-turns'
                    className='settings-input'
                    />
                    <label>hands.</label>
                </span>

                <div className='timer'>
                    <label>Turn Timer:</label>

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

                <button className='settings-button' id='start-button'>Start</button>
            </form>
        </div>
    )
}

export default SettingsForm