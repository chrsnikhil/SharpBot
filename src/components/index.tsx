import React from "react"
import ReactDOM from "react-dom/client"
import Popup from "./popup"

const root = document.createElement("div")
root.className = "container"
document.body.appendChild(root)
const rootElement = ReactDOM.createRoot(root)
rootElement.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
)

