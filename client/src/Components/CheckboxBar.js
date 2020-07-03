import React, {useState,useEffect} from 'react'

export default function CheckboxBar(props){
    const [isCheckFold,setIsCheckFold] = useState(false)
    const [isCallAny,setIsCallAny] = useState(false)
    let playerBet = 0

    if (Object.values(props.players).length > 0){
        playerBet = props.players[props.socket.id].bets
    }

    function handleCheckFold(){
        setIsCheckFold(!isCheckFold)
        props.socket.emit('checkFold',!isCheckFold)
    }

    function handleCallAny(){
        setIsCallAny(!isCallAny)
        props.socket.emit('callAny',!isCallAny)
    }

    return(
        <div>
            {props.currentBet > playerBet? 
                    <div><label for='fold'>Fold</label><input 
                    id='fold' 
                    type='checkbox'
                    onClick={handleCheckFold}
                    checked={isCheckFold}/></div>:

                    <div><label for='check-fold'>Check/Fold</label><input 
                    id='check-fold' 
                    type='checkbox' 
                    onClick={()=>(handleCheckFold())}
                    checked={isCheckFold}/></div>
            }

            <label for='call-any'>Call Any</label>
            <input 
            id='call-any' 
            type='checkbox'
            onClick={()=>(handleCallAny())}
            checked={isCallAny}/>
        </div>
    )

}