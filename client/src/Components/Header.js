import React from "react"
import { Link } from 'react-router-dom';
function Header(){
    
    return(
        <header>
            <h1>Beachball Poker</h1>
            <Link to="/">
                <p>home</p>
            </Link>
        </header>
    )
}

export default Header