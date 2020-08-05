import React from 'react'

export default function WinnerCard(props){
    return(
        <div>
            <p>{props.name} won {props.chips} chips with {props.hand}</p>
            <br></br>
            <p>{props.cards[0].rank}{props.cards[0].suit}
            {props.cards[1].rank}{props.cards[1].suit}</p>
        </div>
    )
}