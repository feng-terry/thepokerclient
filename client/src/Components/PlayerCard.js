import React from 'react'
import Card from './Card'

export default function PlayerCard(props){
    
    const cardList = props.cards.map(card => <Card rank={card.rank} suit={card.suit}/>)

    return (
        <div className = 'player-card'>
            <p>{cardList}</p>
            <h6>{props.name}</h6>
            <p>Stack:{props.stack}</p>
            <p>Bets:{props.bets}</p>
        </div>
    )
}