import React, {useState,useEffect} from 'react'
import PlayerCard from './Components/PlayerCard'
import DecisionBar from './Components/DecisionBar'
import Card from './Components/Card'
import SitDownButton from './Components/SitDownButton'
import SitOutButton from './Components/SitOutButton'
import SitInButton from './Components/SitInButton'
import CheckboxBar from './Components/CheckboxBar'
import Log from './Components/Log'
import Stack from './Components/Stack'

function Game(props){
    const [players,setPlayers] = useState({})
    const [activeNotSatOutPlayers,setActiveNotSatOutPlayers] = useState([])
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
    const [currentPlayer,setCurrentPlayer]=useState({socketId:2})
    const [log,setLog]=useState([])
    const [inGame,setInGame]=useState(false)
    const [timer,setTimer]=useState({
        countdown:15,
        maxTime:15
    })


    useEffect(()=>{
        props.socket.on('nameAndStack', (data)=>{
            setPlayers(data.players)
            setPot(data.pot)
            setCurrentBet(data.currentBet)
            setActiveNotSatOutPlayers(data.activeNotSatOutPlayers)
            setKey(Math.random())
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
            props.socket.emit('update', props.lobbyId)
        })

        props.socket.on('sitDownButton', (data)=>{
            setIsSitDown(data)
        })

        props.socket.on('inGame',(data)=>{
            setInGame(data)
        })

        props.socket.on('revealList', (data)=>{
            setRevealList(data)
        })

        props.socket.on('bustOut', (data)=>{
            props.socket.emit('bustOut', data)
        })

        props.socket.on('timer',(data)=>{
            setTimer({
                countdown:data.countDown,
                maxTime:data.maxTime
            })
            setCurrentPlayer(data.player)
        })

        props.socket.on('winnerLog',(data)=>{
            setLog(data)
        })
    },[])
    const playerElements =  Object.values(players).map(player => {
                                console.log(activeNotSatOutPlayers)
                                console.log(player)
                                console.log(activeNotSatOutPlayers.some(p=>p.socketId === player.socketId))
                                if (players[props.socket.id] === player && activeNotSatOutPlayers.some(p=>p.socketId === player.socketId)){
                                    return(
                                        <PlayerCard 
                                            seat={player.seat}
                                            tableSeats={player.tableSeats}
                                            name={player.name} 
                                            socketId = {player.socketId} 
                                            stack={player.stack} 
                                            cards={player.cards} 
                                            bets={player.bets} 
                                            maxTime={timer.maxTime}
                                            countdown={timer.countdown}
                                            currentPlayer={currentPlayer}
                                        />
                                    )
                                } else if (revealList.map(revealPlayer => revealPlayer.socketId).includes(player.socketId)){
                                    return(
                                        <PlayerCard 
                                            seat={player.seat}
                                            tableSeats={player.tableSeats}
                                            name={player.name} 
                                            socketId = {player.socketId} 
                                            stack = {player.stack} 
                                            cards={player.cards} 
                                            bets={player.bets}
                                            maxTime={timer.maxTime}
                                            countdown={timer.countdown}
                                            currentPlayer={currentPlayer}
                                        />)
                                }else if (activeNotSatOutPlayers.some(p=>p.socketId === player.socketId)){
                                    return(
                                        <PlayerCard 
                                            seat={player.seat}
                                            tableSeats={player.tableSeats}
                                            name={player.name} 
                                            socketId = {player.socketId} 
                                            stack = {player.stack} 
                                            cards={[{rank:0,suit:0},{rank:0,suit:0}]} 
                                            bets={player.bets}
                                            maxTime={timer.maxTime}
                                            countdown={timer.countdown}
                                            currentPlayer={currentPlayer}
                                        />
                                    )
                                }else{
                                    return(<PlayerCard 
                                        seat={player.seat}
                                        tableSeats={player.tableSeats}
                                        name={player.name} 
                                        socketId = {player.socketId} 
                                        stack = {player.stack} 
                                        cards={[{rank:-1,suit:-1},{rank:-1,suit:-1}]} 
                                        bets={player.bets}
                                        maxTime={timer.maxTime}
                                        countdown={timer.countdown}
                                        currentPlayer={currentPlayer}
                                    />)
                                }
                            })

    const communityElements = communityCards.map(card => <Card rank={card.rank} suit={card.suit}/>)
    
    const logElements = log.map(data => <Log winnerLog={data.winnerLog} communityCards={data.communityCards}/>)

    return(
        <div id='screen'>
            <div className='log'>
                {logElements}
            </div>
            <div id='play-area'>
                <div id='game-div' style={{position:'relative'}}>
                    <div id='table-outer'>
                        <div id='table-inner'>
                            <p><strong>Pot:</strong></p>
                            <Stack chips={Number(pot)}/>
                            <div id='community-cards'>
                                {communityElements}
                            </div>
                        </div>
                    </div>
                    {playerElements}
                </div>
                <div className='decision-checkbox-bar'>
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
                                playerCurrentBet={playerCurrentBet}
                                lobbyId={props.lobbyId}/>:
                                
                            activeNotSatOutPlayers.map(player => player.socketId).includes(props.socket.id)?
                                <CheckboxBar 
                                    socket={props.socket}
                                    currentBet={currentBet}
                                    players={players}
                                    lobbyId={props.lobbyId}
                                    key={key}
                                />:
                                null
                    }
                </div>
                <div className='sit-button'>
                    {isSitDown? <SitDownButton socket={props.socket} setIsSitDown={setIsSitDown} lobbyId={props.lobbyId}/>:null}
                    {inGame? 
                        isSitOut?
                            <SitOutButton socket={props.socket} setIsSitOut={setIsSitOut} lobbyId={props.lobbyId}/>
                            :<SitInButton socket={props.socket} setIsSitOut={setIsSitOut} lobbyId={props.lobbyId}/>
                        :null}
                </div>
            </div>
        </div>
    )
}

export default Game