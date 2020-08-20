import React from 'react'

export default function CommunityCards(props){
    const suits={D:"♦",C:"♣",H:'♥',S:'♠'}
    const rank={2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9',10:'10',11:'J',12:'Q',13:'K',14:'A'}
    const color={D:'red',C:'black',H:'red',S:'black'}

    return(
        <div className='log-text'>
            <span style={{color:color[props.communityCards[0].suit]}}>{rank[props.communityCards[0].rank]}{suits[props.communityCards[0].suit]}</span>
            <span style={{color:color[props.communityCards[1].suit]}}>{rank[props.communityCards[1].rank]}{suits[props.communityCards[1].suit]}</span>
            <span style={{color:color[props.communityCards[2].suit]}}>{rank[props.communityCards[2].rank]}{suits[props.communityCards[2].suit]}</span>
            <span style={{color:color[props.communityCards[3].suit]}}>{rank[props.communityCards[3].rank]}{suits[props.communityCards[3].suit]}</span>
            <span style={{color:color[props.communityCards[4].suit]}}>{rank[props.communityCards[4].rank]}{suits[props.communityCards[4].suit]}</span>
        </div>
    )
}