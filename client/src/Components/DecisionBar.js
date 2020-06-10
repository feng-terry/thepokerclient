import React, {useState} from 'react'

function DecisionBar(){
    const [check,setCheck] = useState(false)
    const [fold,setFold] = useState(false)
    const [call,setCall] = useState(false)
    const [bet,setBet] = useState(0)

    function handleFold(){
        setFold(!fold)
        console.log(fold)
    }

    return(
        <div className="decision-bar">
            <button 
                className = "decision-button"
                onClick={()=>(handleFold())}
            >
                Fold
            </button>   
            




        </div>
    )
}

export default DecisionBar