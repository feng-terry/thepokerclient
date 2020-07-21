import React from 'react'
import Header from './Header'
import CreateGame from './CreateGame'
import {useEffect} from 'react'

export default function Home(props){
    return(
        <div>
            <Header className='app-header'/>
            <CreateGame socket={props.socket}/>
            <p>{props.data}</p>
        </div>
    )
}