import React, {useState} from 'react'

function DecisionBar(props){
    const [betValue,setBetValue]=useState(Math.min(props.bigBlind,props.stack))
    const [raiseValue,setRaiseValue]=useState(Math.min(2*props.currentBet - props.playerCurrentBet,props.stack))

    function handleFold(){
        props.socket.emit('fold',{lobbyId:props.lobbyId})
    }

    function handleCheck(){
        props.socket.emit('check',{lobbyId:props.lobbyId})
    }

    function handleCall(){
        props.socket.emit('call',{lobbyId:props.lobbyId})
    }

    function handleBet(e){
        e.preventDefault()
        props.socket.emit('bet',{lobbyId:props.lobbyId,betValue:betValue})
    }

    function handleRaise(e){
        e.preventDefault()
        props.socket.emit('raise',{lobbyId:props.lobbyId,raiseValue:raiseValue})
    }

    function handleAllIn(){
        props.socket.emit('raise',{lobbyId:props.lobbyId,raiseValue:props.stack})
    }

    function handleBetChange(e){
        setBetValue(e.target.value)
    }

    function handleRaiseChange(e){
        setRaiseValue(e.target.value)
    }

    return(
        <div className="decision-bar">

            {props.fold? <button 
                className = "decision-button"
                onClick={()=>(handleFold())}>Fold</button>:null}


            {props.check? <button 
                className = "decision-button"
                onClick={()=>(handleCheck())}>Check</button>:null}

            {props.call? 
                props.currentBet >= props.stack + props.playerCurrentBet? 
                    null:
                    <button 
                        className = "decision-button"
                        onClick={()=>handleCall()}>Call
                    </button>:
                null}

            {props.bet? 
                <form onSubmit={handleBet}>
                    <input type='number' value={betValue} onChange={handleBetChange} min={Math.min(props.bigBlind,props.stack)} max={props.stack}/>
                    <input type='range' value={betValue} onChange={handleBetChange}  min={Math.min(props.bigBlind,props.stack)} max={props.stack}/>
                    <button>Bet</button>
                </form>:null}    

            {props.raise?
                props.currentBet >= props.stack + props.playerCurrentBet || 2*props.currentBet - props.playerCurrentBet >= props.stack?     
                    <button
                        className='decision-button'
                        onClick={handleAllIn}
                    >All In</button>
                    
                    :<form onSubmit={handleRaise}>
                        <input type='number' value={raiseValue} onChange={handleRaiseChange} min={Math.min(2*props.currentBet - props.playerCurrentBet,props.stack)} max={props.stack}/>
                        <input type='range' value={raiseValue} onChange={handleRaiseChange}  min={Math.min(2*props.currentBet - props.playerCurrentBet,props.stack)} max={props.stack}/>
                        <button>Raise</button>
                    </form>
                :null} 




        </div>
    )
}

export default DecisionBar