import React from 'react'
import Card from './Card'
import Timer from './Timer'

export default function PlayerCard(props){
    
    const cardList = props.cards.map(card => <Card rank={card.rank} suit={card.suit}/>)

    return (
        <div className = 'player-card'>
            <div id='player-cards'>
                {cardList}
            </div>
            <div className='player-info'>
                <h6>{props.name}</h6>
                <p>Stack:{props.stack}</p>
                <p>Bets:{props.bets}</p>
            </div>
            <div className='player-timer'>
                {props.socketId === props.currentPlayer.socketId?
                <div>
                    <Timer width={12} percent={(props.countdown-1)/props.maxTime}/>
                </div>
                    :null}
            </div>
        </div>
    )
}