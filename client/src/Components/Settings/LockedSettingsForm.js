import React,{useEffect,useState} from 'react'

export default function LockedSettingsForm(props){
    const [startingStack, setStartingStack] = useState(0.0)
    const [blinds,setBlinds] = useState(0)
    const [seats,setSeats] = useState(6)
    const [lobbyName,setLobbyName] = useState("")
    const [timer,setTimer] = useState(0)
    const [antes,setAntes] = useState(0)
    const [blindsPercentage,setBlindsPercentage]=useState(0)
    const [blindsIncreaseTimer,setBlindsIncreaseTimer]=useState(0)

    useEffect(()=>{
        props.socket.on('lockedSettings',data=>{
            setStartingStack(data.startingStack)
            setBlinds(data.blinds)
            setSeats(data.seats)
            setLobbyName(data.lobbyName)
            setTimer(data.timer)
            setAntes(data.antes)
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
            <p>Antes: {antes}</p>
            <p>Timer: {timer} seconds</p>
            <p>Blinds will increase by {blindsPercentage}% every {blindsIncreaseTimer} turns</p>
        </div>
        
    )

}