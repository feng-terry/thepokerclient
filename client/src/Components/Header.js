import React from "react"
import { Link } from 'react-router-dom';
function Header(){
    
    return(
            <div className='logo' style = {{display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
                <Link to="/" style={{display: 'inline-block'}}>
                    <div className='logo-header'>
                        <h1>Poker</h1>
                    </div>
                </Link>
            </div>
    )
}

export default Header