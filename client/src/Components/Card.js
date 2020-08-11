import React from 'react'
import beegYoshi from '../Cards/5C.png'

export default function Card(props){
    if (props.rank === 0){
        return (
            <div className='cardBack'>
                <img src={beegYoshi} width='100px' height='140px'></img>
            </div>
        )
    }

    return (
        <div className = 'card'>
            <h4>{props.rank}{props.suit}</h4>
        </div>
    )
}