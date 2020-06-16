import React, {useState,useEffect} from 'react'
import PlayerCard from './Components/PlayerCard'

function Game(props){
    const [players,setPlayers] = useState([])
    const [cards,setCards]=useState([])

    useEffect(()=>{
        props.socket.on('nameAndStack', (data)=>{
            setPlayers(data)
        })

        props.socket.on('dealCards', data => {
            setCards(data)
        })

    },[])

    const playerElements =  Object.values(players).map(player => {
                                if (players[props.socket.id] === player){
                                    return(
                                        <PlayerCard name={player.name} stack = {player.stack} cards={cards} />
                                    )
                                } else{
                                    return(
                                        <PlayerCard name={player.name} stack = {player.stack} cards={[{rank:0,suit:0},{rank:0,suit:0}]} />
                                    )
                                }
                            })
       
    return(
        <p>{playerElements}</p>
    )
}

export default Game