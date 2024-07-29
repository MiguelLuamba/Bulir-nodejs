import fs from "fs"
import { Router } from "express"
import { generateServiceId, generateUserId } from "../utils/id_generator.js"
import { tokenGenerator, verifyTokenJWT } from "../utils/token_generator.js"
import {contratoDatabasePath, serviceDataBasePath, userDataBasePath} from "../utils/globalvar.js"



const router = Router()
// CADASTRO DE USUARIOS CLIENTES OU PRESTADORES DE SERVICOS
router.post("/cadastro",async (req, res)=>{
  // RECEBER DADOS DO CORPO DA REQUISCAO
  const { fullname, nif, email, senha, tipoUsuario, servicos } = req.body
  // OBJECTO QUE GUARDA OS DADOS DO NOVO USUARIO
  const novoCliente = {
    id: await generateUserId(),
    nome: fullname,
    nif, 
    email, 
    senha,
    saldo:"200000",
    tipoUsuario:tipoUsuario.toLowerCase()
  }
  if(!fullname || !nif || !email || !senha || !tipoUsuario) return res.json("Dados incompletos")
  // VERIFICAR SE O USUARIO NAO EXISTE NA BD
  if(tipoUsuario.toLowerCase() === "cliente"){
    fs.readFile(userDataBasePath,"utf8",(err, data)=>{
      if (err) return res.json("ERRO-1: FS SERVER")
  
      const meusClientes = JSON.parse(data)
      //console.log(meusClientes)
      let emailExists = meusClientes.some(e => e.email === email && e.email !== undefined)
      let nifExists = meusClientes.some(e => e.nif === nif && e.nif !== undefined)
  
      if(emailExists || nifExists) return res.json({message:"EMAIl e/ou SENHA JA EXISTENTES, TENTE OUTRO"})
      
      meusClientes.push(novoCliente)
      fs.writeFile(userDataBasePath,JSON.stringify(meusClientes),(err)=>{
        if(err) return res.json({message:"Erro ao sobrescrever"})
          res.json({message:"SUCESS TO SAVE"})
      }) 
    })
  }else if(tipoUsuario.toLowerCase() === "prestador"){
    if(!servicos) return res.json("Prestadores de serviços precisam cadastrar pelo menos 1 serviço")
    fs.readFile(userDataBasePath,"utf8", async (err, data)=>{
      if (err) return res.json("ERRO-1: FS SERVER")
  
      const meusClientes = JSON.parse(data)
      let emailExists = meusClientes.some(e => e.email === email && e.email !== undefined)
      let nifExists = meusClientes.some(e => e.nif === nif && e.nif !== undefined)
  
      if(emailExists || nifExists) return res.json({message:"USUARIO EXISTENTE"})
      meusClientes.push(novoCliente)
      fs.writeFile(userDataBasePath,JSON.stringify(meusClientes),(err)=>{
        if(err) return res.json({message:"Erro ao sobrescrever"})
          fs.readFile(serviceDataBasePath,async (err, dataService)=>{
            if(err) return res.json("error")
              let atuaisServicos = JSON.parse(dataService)
              let novoServico = {
                id: await generateServiceId(),
                userId: novoCliente.id,
                titulo: servicos.titulo,
                descricao: servicos.descricao,
                preco: servicos.preco
              }
              atuaisServicos.push(novoServico)
              fs.writeFile(serviceDataBasePath,JSON.stringify(atuaisServicos),(err)=>{
                if(err) return res.json("Erro ao cadastrar novo Servico")
                  res.json("SUCESS TO SIGN IN NEW EMPLOYEE")
              })
          })
      })
    })
  }else{
    return res.json("Usuario deve ser cliente ou prestador")
  }

})
// LOGIN DE USUARIOS
router.post("/login", async (req, res)=>{
  const { email, senha } = req.body
  if(!email || !senha) return res.json("EMAIL e/ou SENHA INVALIDOS")
    fs.readFile(userDataBasePath,"utf8",(err, data)=>{
      if(err) return res.json("ERROR TO READ FILE")
        const userDatas = JSON.parse(data)
        let usuarioLogado
        for (const iterator of userDatas) {
          if (iterator.email === email && iterator.senha === senha){
            usuarioLogado = iterator
            // adicionar o token JWT no login do usuario
            usuarioLogado.token = tokenGenerator()
            res.json(usuarioLogado)
            break;
          }
        }
        if(!usuarioLogado) return res.json("EMAIL E/OU SENHA INCORRETOS")
    })
})
//LISTAR TODOS USUARIOS
router.get("/todos",verifyTokenJWT ,(req, res)=>{
  fs.readFile(userDataBasePath,"utf8", (err, data)=>{
    if(err) return res.json("Erro ao trazer todos usuarios")
      res.json(JSON.parse(data))
  })
})

export default router;