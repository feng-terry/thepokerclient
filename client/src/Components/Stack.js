import React from 'react'
import Chip from './Chip'

export default function Stack(props){
    let chips = []
    let ctr = -1

    function chipsDenom(chips){
        let result = {thousand:0,fiveHundred:0,hundred:0,twentyFive:0,five:0,one:0}
        while (chips > 0){
            if (chips - 1000 >=0){
                chips -=1000
                result['thousand']+=1
            }else if (chips - 500 >= 0){
                chips-=500
                result['fiveHundred']+=1
            }else if (chips - 100 >= 0){
                chips-=100
                result['hundred']+=1
            }else if (chips - 25 >= 0){
                chips-=25
                result['twentyFive']+=1
            }else if (chips - 5 >= 0){
                chips-=5
                result['five']+=1
            }else if (chips - 1 >= 0){
                chips-=1
                result['one']+=1
            }
        }
        return result
    }

    let denom = chipsDenom(props.chips)

    for (const size of ['thousand','fiveHundred','hundred','twentyFive','five','one']){
        for (let i = 0; i < denom[size]; i++){
            ctr++
            chips.unshift(<Chip value={size} zIndex={ctr}/>)
        }
    }

    

    return(
        <div className='stack'>
            {chips}
            {props.chips>0?
                <p id='chip-text'>{props.chips}</p>
                :null
            }
        </div>
    )
}