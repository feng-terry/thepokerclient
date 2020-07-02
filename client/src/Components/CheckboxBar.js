import React, {useState} from 'react'

export default function CheckboxBar(props){
    const [isCheckFold,setIsCheckFold] = useState(false)
    let playerBet = 0

    console.log(props.players)

    if (Object.values(props.players).length > 0){
        playerBet = props.players[props.socket.id].bets
    }

    console.log('tableBet:',props.currentBet)
    console.log('playerBet:',playerBet)

    return(
        <div>
            {props.currentBet > playerBet? 
                    <div><label for='fold'>Fold</label><input 
                    id='fold' 
                    type='checkbox'
                    onChange={()=>{setIsCheckFold(!isCheckFold)}}
                    value={isCheckFold}/></div>:

                    <div><label for='check-fold'>Check/Fold</label><input 
                    id='check-fold' 
                    type='checkbox' 
                    onChange={()=>{setIsCheckFold(!isCheckFold)}}
                    value={isCheckFold}/></div>
            }

            <label for='call=any'>Call Any</label>
            <input id='call-any' type='checkbox'/>
        </div>
    )

}