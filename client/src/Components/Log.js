import React, { useEffect,useState } from 'react'
import WinnerCard from './WinnerCard'
import CommunityCards from './CommunityCards'

function Log(props){
    //[winners] component of winners
    const winners = Object.values(props.winnerLog).map((player)=>
        <WinnerCard
        name={player.name}
        cards={player.cards}
        chips={player.chips}
        hand={player.hand}
    />)
    return(
        <div>
            <CommunityCards communityCards={props.communityCards}/>
            {winners}
        </div>
    )
}

export default Log