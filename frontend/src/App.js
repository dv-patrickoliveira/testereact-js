import "./App.css";
import { useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./containers/Login"
import Cadastre from  "./containers/Cadastre"

function App() {
  const [autenticado, setAutenticado] = useState(false)
  const [usuario, setUsuario] = useState({ NAME: "", PASSWORD: "" }) 

  const logon = (usuario) => {
    navigate("/")

    setAutenticado(true)
    setUsuario(usuario)    
  }

  const logoff = () => {
    setAutenticado(false)
    setUsuario({})
  }

  const navigate = useNavigate()

  return (
    <>
      { !autenticado &&
        <>        
          <Login logon={logon} logoff={logoff} setUsuario={setUsuario} />
        </>
      }    

      { autenticado &&
        <Routes>
          <Route path="/" element={<Cadastre novo={false} usuario={usuario} logoff={logoff} />} />
          <Route path="*" element={<Cadastre novo={false} usuario={usuario} logoff={logoff} />} />
        </Routes>
      }
    </>
  )
}

export default App;