import React, {useState,useEffect} from 'react'

export default function CheckboxBar(props){
    const [isCheckFold,setIsCheckFold] = useState(false)
    const [isCallAny,setIsCallAny] = useState(false)
    let playerBet = 0
    const color = {false:"#24A5F5",true:'red'}

    if (Object.values(props.players).length > 0 && Object.keys(props.players).includes(props.socket.id)){
        playerBet = props.players[props.socket.id].bets
    }
    
    function handleCheckFold(){
        setIsCheckFold(!isCheckFold)
        setIsCallAny(false)
    }
    
    function handleCallAny(){
        setIsCallAny(!isCallAny)
        setIsCheckFold(false)
    }

    useEffect(()=>{
        props.socket.emit('checkFold',{lobbyId:props.lobbyId,value:isCheckFold})
    },[isCheckFold])
    useEffect(()=>{
        props.socket.emit('callAny',{lobbyId:props.lobbyId,value:isCallAny})
    },[isCallAny])

    return(
        <div className='checkbox-bar'>
            <button
                onClick={handleCheckFold}
                className='checkbox-button'
                style={{backgroundColor:color[isCheckFold]}}
            >
                {props.currentBet > playerBet? 'Fold':'Check/Fold'}
            </button>
            <button
                onClick={()=>(handleCallAny())}
                className='checkbox-button'
                style={{backgroundColor:color[isCallAny]}}
            >
                Call Any
            </button>
        </div>
    )

}