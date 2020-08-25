import React from 'react'
import ReactDOM, { render } from 'react-dom'
import SettingsForm from './Form.js'

function App(){
    render(
        <SettingsForm/>
    )
}

ReactDOM.render(<App/>,getElementByID("root"))