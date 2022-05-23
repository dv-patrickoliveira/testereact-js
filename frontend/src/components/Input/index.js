import "./style.css"
import React from "react"

const Input = ({type, name, placeholder, value, maxLength, disabled, required, onChange}) => {
  return(
    <>
      { !disabled &&
          <div className="input-div">
            <input
              type={type}
              name={name}
              placeholder={placeholder}
              value={value}
              maxLength={maxLength} 
              required={required}
              className={"input-white"}
              onChange={onChange} />
            </div>
      }

      { disabled &&
          <div className="input-div">
            <input
              type={type}
              name={name}
              placeholder={placeholder}
              value={value}
              maxLength={maxLength} 
              disabled
              required={required}
              className={"input-white"}
              onChange={onChange} />
          </div>
      }
    </>
  )
}
    
export default Input