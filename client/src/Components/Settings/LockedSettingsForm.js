import React,{useEffect,useState} from 'react'

export default function LockedSettingsForm(props){
    const [startingStack, setStartingStack] = useState(0.0)
    const [blinds,setBlinds] = useState(0)
    const [seats,setSeats] = useState(6)
    const [lobbyName,setLobbyName] = useState("")
    const [timer,setTimer] = useState(0)
    const [anteSwitch,setAnteSwitch] = useState(false)
    const [antes,setAntes] = useState(0)
    const [blindsSwitch,setBlindsSwitch]=useState(false)
    const [blindsPercentage,setBlindsPercentage]=useState(0)
    const [blindsIncreaseTimer,setBlindsIncreaseTimer]=useState(0)

    useEffect(()=>{
        props.socket.on('lockedSettings',data=>{
            setStartingStack(data.startingStack)
            setBlinds(data.blinds)
            setSeats(data.seats)
            setLobbyName(data.lobbyName)
            setTimer(data.timer)
            setAnteSwitch(data.anteSwitch)
            setAntes(data.antes)
            setBlindsSwitch(data.blindsSwitch)
            setBlindsPercentage(data.blindsPercentage)
            setBlindsIncreaseTimer(data.blindsIncreaseTimer)
        })
    },[])

    return(
        <div>
            <p>Lobby Name: {lobbyName}</p>
            <p>Starting Stack: {startingStack}</p>
            <p>Blinds: {blinds}</p>
            <p>Seats: {seats}</p>
            <p>Antes: {
            (anteSwitch)?antes:0
            }</p>
            <p>Timer: {timer} seconds</p>
            {(blindsSwitch)?
            <p>Blinds will increase by {blindsPercentage}% every {blindsIncreaseTimer} turns</p>
            :<p>Blinds will not increase</p>
            }   
        </div>
        
    )

}