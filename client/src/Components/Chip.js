import React from 'react'
import redChip from "../Chips/redChip.png"
import blueChip from "../Chips/blueChip.png"
import yellowChip from "../Chips/yellowChip.png"
import greenChip from "../Chips/greenChip.png"
import blackChip from "../Chips/blackChip.png"
import purpleChip from "../Chips/purpleChip.png"

export default function Chip(props){
    console.log(props.value)
    switch(props.value){
        case 'thousand':
            return(
                <div className='chip' style={{zIndex:props.zIndex}}>
                    <img src={blackChip} width='20px'></img>
                </div>
            )
        case 'fiveHundred':
            return(
                <div className='chip' style={{zIndex:props.zIndex}}>
                    <img src={purpleChip} width='20px'></img>
                </div>
            )
        case 'hundred':
            return(
                <div className='chip' style={{zIndex:props.zIndex}}>
                    <img src={greenChip} width='20px'></img>
                </div>
            )
        case 'twentyFive':
            return(
                <div className='chip' style={{zIndex:props.zIndex}}>
                    <img src={yellowChip} width='20px'></img>
                </div>
            )
        case 'five':
            return(
                <div className='chip' style={{zIndex:props.zIndex}}>
                    <img src={redChip} width='20px'></img>
                </div>
            )
        case 'one':
            return(
                <div className='chip' style={{zIndex:props.zIndex}}>
                    <img src={blueChip} width='20px'></img>
                </div>
            )
    }
}