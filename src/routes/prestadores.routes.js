import fs from "fs"
import { Router } from "express"
import { generateServiceId } from "./../utils/id_generator.js"
import { verifyTokenJWT } from "./../utils/token_generator.js"
import {contratoDatabasePath, serviceDataBasePath, userDataBasePath} from "../utils/globalvar.js"


const router = Router()



router.post("/novo-servico",verifyTokenJWT,(req, res)=>{
  const { idPrestador, titulo, descricao, preco } = req.body
  if(!idPrestador || !titulo || !descricao || !preco) return res.json("Dados incompletos")
  
  fs.readFile(userDataBasePath,"utf8",(err, data)=>{
    if(err) return res.status(401).json({message:"ERROR"})
      const users = JSON.parse(data)
      let verifyUser = users.some(e => e.id === idPrestador && e.tipoUsuario === "prestador")
      // VERIFICAR SE O USUARIO E UM PRESTADOR DE SERVICO
      if(verifyUser){
        fs.readFile(serviceDataBasePath,"utf8", async (err, data)=>{
          if(err) res.status(401).json({message:"ERROR"})
            let servicos = JSON.parse(data)
            let novoServico = {
              id: await generateServiceId(),
              userId: idPrestador,
              titulo,
              descricao,
              preco
            }
            servicos.push(novoServico)
            fs.writeFile(serviceDataBasePath,JSON.stringify(servicos),(err)=>{
              if(err) return res.status(401).json({message:"ERROR"})
                return res.json("SUCESS TO ADD NEW SERVICE")
            })
        })
      }else{
        res.json("Apenas prestadores de serviço podem cadastrar novos serviços")
      }
  })
})

export default router;