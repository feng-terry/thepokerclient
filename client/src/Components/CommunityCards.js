import React from 'react'

export default function CommunityCards(props){
    return(
        <div>
            {props.communityCards[0].rank}{props.communityCards[0].suit}
            {props.communityCards[1].rank}{props.communityCards[1].suit}
            {props.communityCards[2].rank}{props.communityCards[2].suit}
            {props.communityCards[3].rank}{props.communityCards[3].suit}
            {props.communityCards[4].rank}{props.communityCards[4].suit}
        </div>
    )
}