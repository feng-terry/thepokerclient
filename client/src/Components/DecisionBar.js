import React, {useState} from 'react'

function DecisionBar(props){
    const [betValue,setBetValue]=useState(Math.min(props.bigBlind,props.stack))
    const [raiseValue,setRaiseValue]=useState(Math.min(2*props.currentBet,props.stack))

    function handleFold(){
        props.socket.emit('fold')
    }

    function handleCheck(){
        props.socket.emit('check')
    }

    function handleBet(e){
        e.preventDefault()
        props.socket.emit('bet',betValue)
    }

    function handleRaise(e){
        e.preventDefault()
        props.socket.emit('raise',raiseValue)
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

            {props.call? <button 
                className = "decision-button"
                >Call</button>:null}

            {props.bet? 
                <form onSubmit={handleBet}>
                    <input type='number' value={betValue} onChange={handleBetChange} min={Math.min(props.bigBlind,props.stack)} max={props.stack}/>
                    <input type='range' value={betValue} onChange={handleBetChange}  min={Math.min(props.bigBlind,props.stack)} max={props.stack}/>
                    <button>Bet</button>
                </form>:null}    

            {props.raise? 
                <form onSubmit={handleRaise}>
                    <input type='number' value={raiseValue} onChange={handleRaiseChange} min={Math.min(2*props.currentBet,props.stack)} max={props.stack}/>
                    <input type='range' value={raiseValue} onChange={handleRaiseChange}  min={Math.min(2*props.currentBet,props.stack)} max={props.stack}/>
                    <button>Raise</button>
                </form>:null} 




        </div>
    )
}

export default DecisionBar