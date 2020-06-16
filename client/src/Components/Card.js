import React from 'react'

export default function Card(props){
    if (props.rank === 0){
        return (
            <div className='cardBack'>
                <h4>Card Back</h4>
            </div>
        )
    }

    return (
        <div className = 'card'>
            <h4>{props.rank}{props.suit}</h4>
        </div>
    )
}