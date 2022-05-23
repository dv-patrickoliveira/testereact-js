import "./style.css"
import { useState, useEffect } from "react"
import { BASE_URL } from "../../utils/requests"
import Input from "../../components/Input"
import Mensagem from "../../components/Message"
import * as yup from "yup"

const Cadastre = ({ novo, usuario, retornar, logoff }) => {
  const [novoUsuario, setNovoUsuario] = useState(novo)
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  const [carregando, setCarregando] = useState("")    
  const [mensagem, setMensagem] = useState("")      

  useEffect(() => {
    if (usuario.NAME !== undefined) setName(usuario.NAME)
    if (usuario.PASSWORD !== undefined) setPassword(usuario.PASSWORD)
  }, [usuario])

  const handleName = (event) => {
    setName(event.target.value)
  }    

  const handlePassword = (event) => {
    setPassword(event.target.value)
  }

  const salvar = () => {
    var retornoJson = []

    if (!(validate())) return

    if (novo) setCarregando("Aguarde incluindo o usuário...")
    else setCarregando("Aguarde alterando o usuário...")

    setMensagem("")

    var axios = require('axios');
    var data = JSON.stringify({
      "name": name,
      "password": password
    });
    var config = {
      method: 'post',
      url: BASE_URL + '/user/cadaster',
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

        if (retornoJson.why === "User already exists") retornoJson = JSON.parse("{ \"ok\": false, \"why\": \"Não foi possível salvar o usuário. (Usuário já existe)\" }")
        else retornoJson = JSON.parse("{ \"ok\": false, \"why\": \"Não foi possível salvar o usuário. ("+ retornoJson.why +")\"}")        
      }
      catch
      {
        retornoJson = JSON.parse("{ \"ok\": false, \"why\": \"Não foi possível salvar o usuário. (Sem conexão API)\"}")        
      }
    })
    .finally(() => {
      if (retornoJson.ok) {      
        setNovoUsuario(false)       
        setMensagem("Usuário cadastrado com sucesso!")
      }
      else setMensagem(retornoJson.why)

      setCarregando("")
    })
    ///
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
    <div id="cadastre-wrapper-app">
      <div id="cadastre-logo">
        
      </div>

      <div id="cadastre-wrapper-login">
        <div id="cadastre-container">
          
          <span className="login-form-title"> CRIAR CONTA </span>
          <br/>
          <div id="cadastre-traco">
              <hr id="cadastre-traco-conteudo"/>
          </div>
          <br/>

          <div className="cadastre-input">
            <Input
              type="text"
              name="name_login"
              placeholder="Nome"
              value={name}
              maxLength={80}
              disabled={false}
              required={true}
              onChange={handleName} />
          </div>
          <div className="cadastre-input cadastre-margin-top-10">
            <Input
              type="text"
              name="password_login"
              placeholder="Senha"
              value={password}
              maxLength={10}
              disabled={false}
              required={true}
              onChange={handlePassword} />
          </div>
          { carregando &&
              <div className="cadastre-mensagem">
                  <br/>
                  <Mensagem type={2} message={carregando} className="message-div-blue" />
                  <br/>
              </div> 
          }

          { mensagem && 
              <div className="cadastre-mensagem">
                  <br/>
                  <Mensagem type={1} message={mensagem} className="message-div-blue" />
                  <br/>
              </div> 
          }

          { !carregando && !mensagem && <br/> }
          
          <div id="cadastre-btn">
                                     
              { novoUsuario &&
                <>
                  <div className="cadastre-btn-salvar">
                    <div className="cadastre-botao" onClick={retornar}>
                      <div><b>VOLTAR</b></div>
                    </div>                
                  </div>

                  <div className="cadastre-botao" onClick={salvar}>
                    <div><b>CONFIRMAR</b></div>
                  </div>
                </>
              }

              { !novoUsuario &&
                  <div className="cadastre-btn-salvar">
                    <div className="cadastre-botao" onClick={logoff}>
                      <div><b>LOGOFF</b></div>
                    </div>
                  </div>
              }
            </div>
            <div className="text-center">
          <span className="txt1">Já possui conta? </span>
          <a className="txt2" href="/login">
            Acessar com Email e Senha.
          </a>
        </div>
          </div>
      </div>
      <div id="cadastre-footer" />
    </div>
  )
}
    
export default Cadastre