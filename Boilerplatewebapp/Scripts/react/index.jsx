import React from "react"
import ReactDOM from "react-dom"

export default class Example extends React.Component {

    render() {
        return (
            <div>

                Hello world !
            </div>
            )
    }
}

const root = document.getElementById("root")
ReactDOM.render(<Example />, root)