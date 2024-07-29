import fs from "fs"
import { Router } from "express"
import { verifyTokenJWT } from "../utils/token_generator.js";
import { generateContratoID } from "../utils/id_generator.js"
import { decrementUserCredit } from "../utils/creditsUserChange.js"
import {contratoDatabasePath, serviceDataBasePath, userDataBasePath} from "../utils/globalvar.js"


const router = Router()




//LISTAR TODOS SERVICOS
router.get("/listar-servicos" ,verifyTokenJWT ,(req, res)=>{
  fs.readFile(serviceDataBasePath,"utf8",(err, data)=>{
    if(err) return res.status(401).json({message:"ERROR"})
      let todosServicos = JSON.parse(data)
      res.json(todosServicos)
  })
})

// CONTRATAR SERVICOS
router.post("/contratar",verifyTokenJWT , async (req, res)=>{
  const { clientID, serviceID } = req.body
  
  if(!clientID || !serviceID) return res.status(300).json({message:"DADOS INCOMPLETOS"})

  const novoContrato = {
    id: await generateContratoID(),
    id_cliente: clientID,
    id_servico: serviceID
  }

  fs.readFile(userDataBasePath,"utf8",(err, data)=>{
    if(err) return res.status(401).json({message:"ERROR"})
      let users = JSON.parse(data)
      let verifyUser = users.some(e => e.id === clientID)
      fs.readFile(serviceDataBasePath,"utf8",async (err, data)=>{
        if(err) return res.status(401).json({message:"ERROR"})
          let services = JSON.parse(data)
          let verifyService = services.some(e => e.id === serviceID)
          if(verifyService && verifyUser){
            // VERIFICAR SALDO DO USUARIO E EDITAR
            const isCreditUpdating = await decrementUserCredit(clientID, serviceID)
            if(isCreditUpdating === "SALDO INSUFICIENTE"){
              return res.status(401).json({message:"SALDO INSUFICIENTE"})
            }else if(isCreditUpdating === "ERROR"){
              return res.status(401).json({message:"TENTE MAIS TARDE, ERRO INTERNO"})
            }else if(isCreditUpdating === "SUCESSO"){
              fs.readFile(contratoDatabasePath,"utf8",(err, data)=>{
                if(err) return res.status(401).json({message:"ERROR"})
                
                let contratos = JSON.parse(data)
                contratos.push(novoContrato)
                fs.writeFile(contratoDatabasePath,JSON.stringify(contratos),(err)=>{
                  if(err) return res.json("Erro ao contratar")
                    return res.json("SUCESSO AO CONTRATAR")
                })
              })
            }
          }else{
            return res.json("SERVICO ou CLIENTE INVALIDO")
          }
      }) 
  })
})


export default router;