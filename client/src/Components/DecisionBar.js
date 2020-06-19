import React, {useState} from 'react'

function DecisionBar(props){

    function handleFold(){
        console.log('frontend fold')
        props.socket.emit('fold')
    }

    function handleCheck(){
        props.socket.emit('check')
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

            <form>
                <input type="range" min="0" max="50"/>
                <button>Bet/Raise</button>
            </form>  
            




        </div>
    )
}

export default DecisionBar