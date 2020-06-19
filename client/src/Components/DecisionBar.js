import React, {useState} from 'react'

function DecisionBar(props){

    function handleFold(){
        props.socket.emit('fold')
    }

    return(
        <div className="decision-bar">
            <button 
                className = "decision-button"
                onClick={()=>(handleFold())}
            >
                Fold
            </button>
            <button
                className = 'decision-button'>
                Check/Call
            </button> 
            <form>
                <input type="range" min="0" max="50"/>
                <button>Bet/Raise</button>
            </form>  
            




        </div>
    )
}

export default DecisionBar