import "./style.css"
import { useState } from "react"
import { BASE_URL } from "../../utils/requests"
import Input from "../../components/Input"
import Mensagem from "../../components/Message"
import Cadastre from "../Cadastre"
import * as yup from "yup"
import Logo from "../../assets/img/logo.png"

const Login = ({ logon }) => {
  const [newUser, setNewUser] = useState(false)
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [carregando, setCarregando] = useState("")
  const [mensagem, setMensagem] = useState("")
  const handleName = (event) => {
    setName(event.target.value)
  }

  const handlePassword = (event) => {
    setPassword(event.target.value)
  }

  const logar = () => {
    var retornoJson = { ok: false, why: "", login: "" }

    if (!(validate())) return

    setCarregando("Aguarde efetuando o login...")
    setMensagem("")

    var axios = require('axios');
    var data = JSON.stringify({
      "name": name,
      "password": password
    });
   
    var config = {
      method: 'post',
      url: BASE_URL + '/login',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios(config)
    .then((response) => { 
      retornoJson = JSON.parse(JSON.stringify(response.data))
    })
    .catch((response) => {  
      try
      {
        retornoJson = JSON.parse(JSON.stringify(response.response.data))

        if (retornoJson.why === "Not found data!") retornoJson = JSON.parse("{ \"ok\": false, \"why\": \"Login inválido\" }")
        else retornoJson = JSON.parse("{ \"ok\": false, \"why\": \"Não foi possível encontrar o usuário. ("+ retornoJson.why +")\"}")        
      }
      catch
      {
        retornoJson = JSON.parse("{ \"ok\": false, \"why\": \"Não foi possível encontrar o usuário . (Sem conexão API)\"}")        
      }
    })
    .finally(() => {
      if (retornoJson.ok) {
        var jsonUser = "{ \"NAME\": \""+ name +"\", \"PASSWORD\": \""+ password +"\" }"
        logon(JSON.parse(jsonUser))
      }
      else {
        setMensagem(retornoJson.why)
      }

      setCarregando("")
    })
    ///
  }
  const retorno = () => {
    setCarregando("")
    setMensagem("")

    setName("")
    setPassword("")

    setNewUser(false)
  }
  function validate() {
    const user = { name: name, password: password }

    let schema = yup.object().shape({
      name: yup.string("É necessário informar o nome!").required("É necessário informar o nome!"),
      password: yup.string("É necessário informar a senha!").required("É necessário informar a senha!")
    })

    try {
      schema.validate(user)
      return true
    } catch (err) {
      setMensagem(err.errors)
      return false
    }
  }    
    
  return(
    <div id="login-wrapper">
      <div id="login-main">

        { !newUser &&
          <div id="login-container">
              <div className="login-margem-left-15">
                <br/>
                <img id="login-logo" src={Logo} alt="Logo" />
              </div>
              <br/>
              <div className="login-input">
                  <Input
                    type="text"
                    name="name_login"
                    placeholder="Nome"
                    value={name}
                    maxLength={80}
                    disabled={false}
                    required={true}
                    className="input-masked-white"
                    onChange={handleName} />
              </div>
              <div className="login-input login-margem-top-10">
                  <Input
                    type="password"
                    name="password_login"
                    placeholder="Senha"
                    value={password}
                    maxLength={10}
                    disabled={false}
                    required={true}
                    className="input-masked-white"
                    onChange={handlePassword} />
              </div>
              { carregando && 
                  <div className="login-mensagem">
                    <br/><Mensagem type={2} message={carregando} className="message-div-white" />
                  </div> 
              }

              { mensagem && 
                  <div className="login-mensagem">
                    <br/><Mensagem type={3} message={mensagem} className="message-div-white" />
                  </div> 
              }

              <div className="login-botao login-margem-top-10" onClick={logar}>
                <div><b>Entrar</b></div>
              </div>

              <div id="login-novo">
                <label onClick={() => setNewUser(true)}>Não possui cadastro? Criar conta.</label>
              </div>

              <br/>
          </div>
        }
        { newUser &&
          <Cadastre
            novo={true}
            retornar={() => retorno()}
            logoff={retorno} 
            usuario={{ NAME: undefined, PASSWORD: undefined }}  />
        }
      </div>
    </div>
  )
}
export default Login