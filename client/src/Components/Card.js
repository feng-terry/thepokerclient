import React from 'react'
import poop from './beegbeegyoshi.png'
import DA from "../Cards/AD.png"
import CA from "../Cards/AC.png"
import HA from "../Cards/AH.png"
import SA from "../Cards/AS.png"
import D2 from "../Cards/2D.png"
import C2 from "../Cards/2C.png"
import H2 from "../Cards/2H.png"
import S2 from "../Cards/2S.png"
import D3 from "../Cards/3D.png"
import C3 from "../Cards/3C.png"
import H3 from "../Cards/3H.png"
import S3 from "../Cards/3S.png"
import D4 from "../Cards/4D.png"
import C4 from "../Cards/4C.png"
import H4 from "../Cards/4H.png"
import S4 from "../Cards/4S.png"
import D5 from "../Cards/5D.png"
import C5 from "../Cards/5C.png"
import H5 from "../Cards/5H.png"
import S5 from "../Cards/5S.png"
import D6 from "../Cards/6D.png"
import C6 from "../Cards/6C.png"
import H6 from "../Cards/6H.png"
import S6 from "../Cards/6S.png"
import D7 from "../Cards/7D.png"
import C7 from "../Cards/7C.png"
import H7 from "../Cards/7H.png"
import S7 from "../Cards/7S.png"
import D8 from "../Cards/8D.png"
import C8 from "../Cards/8C.png"
import H8 from "../Cards/8H.png"
import S8 from "../Cards/8S.png"
import D9 from "../Cards/9D.png"
import C9 from "../Cards/9C.png"
import H9 from "../Cards/9H.png"
import S9 from "../Cards/9S.png"
import D10 from "../Cards/10D.png"
import C10 from "../Cards/10C.png"
import H10 from "../Cards/10H.png"
import S10 from "../Cards/10S.png"
import DJ from "../Cards/JD.png"
import CJ from "../Cards/JC.png"
import HJ from "../Cards/JH.png"
import SJ from "../Cards/JS.png"
import DQ from "../Cards/QD.png"
import CQ from "../Cards/QC.png"
import HQ from "../Cards/QH.png"
import SQ from "../Cards/QS.png"
import DK from "../Cards/KD.png"
import CK from "../Cards/KC.png"
import HK from "../Cards/KH.png"
import SK from "../Cards/KS.png"
const images = {
    '14D':DA,
    '14C':CA,
    '14H':HA,
    '14S':SA,
    '2D':D2,
    '2C':C2,
    '2H':H2,
    '2S':S2,
    '3D':D3,
    '3C':C3,
    '3H':H3,
    '3S':S3,
    '4D':D4,
    '4C':C4,
    '4H':H4,
    '4S':S4,
    '5D':D5,
    '5C':C5,
    '5H':H5,
    '5S':S5,
    '6D':D6,
    '6C':C6,
    '6H':H6,
    '6S':S6,
    '7D':D7,
    '7C':C7,
    '7H':H7,
    '7S':S7,
    '8D':D8,
    '8C':C8,
    '8H':H8,
    '8S':S8,
    '9D':D9,
    '9C':C9,
    '9H':H9,
    '9S':S9,
    '10D':D10,
    '10C':C10,
    '10H':H10,
    '10S':S10,
    '11D':DJ,
    '11C':CJ,
    '11H':HJ,
    '11S':SJ,
    '12D':DQ,
    '12C':CQ,
    '12H':HQ,
    '12S':SQ,
    '13D':DK,
    '13C':CK,
    '13H':HK,
    '13S':SK
}

export default function Card(props){
    if (props.rank === 0){
        return (
            <div className='cardBack'>
                <img src={poop} width='60px' height='84px'></img>
            </div>
        )
    }

    return (
        <div className = 'card'>
            <img src={images[String(props.rank)+String(props.suit)]} width='60px' height='84px'></img>
        </div>
    )
}