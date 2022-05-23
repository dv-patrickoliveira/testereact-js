import "./style.css"
import React from "react"

const Message = ({message, className}) => {
  return(
    <div id={className}>
      {message}
    </div>
  )
}
    
export default Message