import React from 'react'

export default function WinnerCard(props){
    const suits={D:"♦",C:"♣",H:'♥',S:'♠'}
    const rank={2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9',10:'10',11:'J',12:'Q',13:'K',14:'A'}
    const color={D:'red',C:'black',H:'red',S:'black'}

    return(
        <div className='log-text' id='winner-card'>
            <p>{props.name} (
                <span style={{color:color[props.cards[0].suit]}}>{rank[props.cards[0].rank]}{suits[props.cards[0].suit]}</span>
                <span style={{color:color[props.cards[1].suit]}}>{rank[props.cards[1].rank]}{suits[props.cards[1].suit]}</span>
                ) won {props.chips} chips with {props.hand}
            </p>
        </div>
    )
}