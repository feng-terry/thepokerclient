import React, {useState,useEffect} from 'react'
import PlayerCard from './Components/PlayerCard'
import DecisionBar from './Components/DecisionBar'
import Card from './Components/Card'

function Game(props){
    const [players,setPlayers] = useState([])
    const [cards,setCards]=useState([])
    const [communityCards,setCommunityCards]=useState([])
    const [isTurn,setIsTurn]=useState()
    const [actions,setActions]=useState({   fold:false,
                                            check:false,
                                            call:false,
                                            bet:false,
                                            raise:false})
    const [stack,setStack]=useState(0)
    const [bigBlind,setBigBlind]=useState(0)
    const [currentBet,setCurrentBet]=useState(0)

    useEffect(()=>{
        props.socket.on('nameAndStack', (data)=>{
            setPlayers(data)
        })

        props.socket.on('dealCards', data => {
            setCards(data)
        })

        props.socket.on('communityCards', data => {
            setCommunityCards(data)
        })

        props.socket.on('turn', data => {
            setIsTurn(data.isTurn)    
            setActions(data.actions)   
            setStack(data.stack)  
            setBigBlind(data.bigBlind)  
            setCurrentBet(data.currentBet)
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

    const communityElements = communityCards.map(card => <Card rank={card.rank} suit={card.suit}/>)
       
    return(
        <div>
            <p>{playerElements}</p>
            {console.log(isTurn)}
            {console.log(actions)}
            {isTurn? <DecisionBar 
                        socket={props.socket} 
                        fold={actions.fold} 
                        check={actions.check} 
                        call={actions.call} 
                        bet={actions.bet} 
                        raise={actions.raise} 
                        stack={stack} 
                        bigBlind={bigBlind}
                        currentBet={currentBet}/>:null}
            <p>{communityElements}</p>
        </div>
    )
}

export default Game