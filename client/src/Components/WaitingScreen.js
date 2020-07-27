import React,{useEffect} from 'react'
import { useLocation } from 'react-router-dom'

export default function WaitingScreen(props){
    const location = useLocation()

    useEffect(()=>{
        console.log(location.pathname)
        fetch(location.pathname)
    },[])

    return(
        <p>Loading</p>
    )
}