import React, {useState,useEffect} from 'react'

export default function CheckboxBar(props){
    const [isCheckFold,setIsCheckFold] = useState(false)
    const [isCallAny,setIsCallAny] = useState(false)
    let playerBet = 0

    if (Object.values(props.players).length > 0 && Object.keys(props.players).includes(props.socket.id)){
        playerBet = props.players[props.socket.id].bets
    }
    
    function handleCheckFold(){
        setIsCheckFold(!isCheckFold)
        props.socket.emit('checkFold',{lobbyId:props.lobbyId,value:!isCheckFold})
        
        setIsCallAny(false)
        props.socket.emit('callAny',{lobbyId:props.lobbyId,value:false})
    }
    
    function handleCallAny(){
        setIsCallAny(!isCallAny)
        props.socket.emit('callAny',{lobbyId:props.lobbyId,value:!isCallAny})

        setIsCheckFold(false)
        props.socket.emit('checkFold',{lobbyId:props.lobbyId,value:false})
    }

    return(
        <div className='checkbox-bar'>
            <label for='fold'>{props.currentBet > playerBet? 'Fold':'Check/Fold'}</label>
            <input 
                id='fold' 
                type='checkbox'
                onClick={handleCheckFold}
                checked={isCheckFold}
            />

            <label for='call-any'>Call Any</label>
            <input 
                id='call-any' 
                type='checkbox'
                onClick={()=>(handleCallAny())}
                checked={isCallAny}
            />
        </div>
    )

}