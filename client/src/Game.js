import React, {useState,useEffect} from 'react'
import PlayerCard from './Components/PlayerCard'
import DecisionBar from './Components/DecisionBar'
import Card from './Components/Card'
import SitDownButton from './Components/SitDownButton'
import SitOutButton from './Components/SitOutButton'
import SitInButton from './Components/SitInButton'
import CheckboxBar from './Components/CheckboxBar'

function Game(props){
    const [players,setPlayers] = useState({})
    const [activeNotSatOutPlayers,setActiveNotSatOutPlayers] = useState([])
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
    const [playerCurrentBet,setPlayerCurrentBet]=useState(0)
    const [pot,setPot]=useState(0)
    const [isSitDown,setIsSitDown]=useState(false)
    const [isSitOut,setIsSitOut]=useState(true)
    const [key,setKey]=useState(Math.random())
    const [revealList,setRevealList]=useState([])

    useEffect(()=>{
        props.socket.on('nameAndStack', (data)=>{
            setPlayers(data.players)
            setPot(data.pot)
            setCurrentBet(data.currentBet)
            setActiveNotSatOutPlayers(data.activeNotSatOutPlayers)
            setKey(Math.random())
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
            setPlayerCurrentBet(data.playerCurrentBet)
        })

        props.socket.on('update',() => {
            props.socket.emit('update')
        })

        props.socket.on('sitDownButton', ()=>{
            setIsSitDown(true)
        })

        props.socket.on('revealList', (data)=>{
            setRevealList(data)
        })
    },[])

    console.log(revealList)
    const playerElements =  Object.values(players).map(player => {
                                if (players[props.socket.id] === player){
                                    return(
                                        <PlayerCard name={player.name} stack = {player.stack} cards={cards} bets={player.bets}/>
                                    )
                                } else if (revealList.map(revealPlayer => revealPlayer.socketId).includes(player.socketId)){
                                    console.log("Player:",player)
                                    return(<PlayerCard name={player.name} stack = {player.stack} cards={player.cards} bets={player.bets}/>)
                                } else{
                                    return(
                                        <PlayerCard name={player.name} stack = {player.stack} cards={[{rank:0,suit:0},{rank:0,suit:0}]} bets={player.bets}/>
                                    )
                                }
                            })

    const communityElements = communityCards.map(card => <Card rank={card.rank} suit={card.suit}/>)
       
    return(
        <div>
            <p>{playerElements}</p>
            {(isTurn && activeNotSatOutPlayers.length>0)? 
                    <DecisionBar 
                        socket={props.socket} 
                        fold={actions.fold} 
                        check={actions.check} 
                        call={actions.call} 
                        bet={actions.bet} 
                        raise={actions.raise} 
                        stack={stack} 
                        bigBlind={bigBlind}
                        currentBet={currentBet}
                        playerCurrentBet={playerCurrentBet}/>:
                        
                    activeNotSatOutPlayers.map(player => player.socketId).includes(props.socket.id)?  
                        <CheckboxBar 
                                socket={props.socket}
                                currentBet={currentBet}
                                players={players}
                                key={key}
                                />:
                        null
            }
            <p>{communityElements}</p>
            <p>Pot:{pot}</p>
            {isSitDown? <SitDownButton socket={props.socket} setIsSitDown={setIsSitDown}/>:
             isSitOut? <SitOutButton socket={props.socket} setIsSitOut={setIsSitOut}/>:<SitInButton socket={props.socket} setIsSitOut={setIsSitOut}/>}
            
        </div>
    )
}

export default Game