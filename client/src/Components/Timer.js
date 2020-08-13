import React, {useState, useEffect} from 'react'

export default function Timer(props){
    const [value, setValue] = useState(props.percent * props.width)

    useEffect(()=>{
        setValue(props.percent*props.width)
    },[props.percent])
    return(
        <div className="progress-div" style={{width: `${props.width}rem`}}>
           <div style={{width: `${value}rem`}}className="progress"/>
        </div>
    )
}