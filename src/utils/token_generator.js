import jwt from "jsonwebtoken";
const SECRET = "bulirnodeapplication"
// PAYLOAD usar o id do usuario
export function tokenGenerator(userId){
  const token = jwt.sign({userId}, SECRET , {expiresIn:300})
  return token
}

export function verifyTokenJWT(req, res, next){
  const meuToken = req.headers["x-access-token"]
  jwt.verify(meuToken, SECRET,(err, decoded)=>{
    if(err) return res.json("invalid token, faça login novamente")
      req.userId = decoded.userId
      next()
  })
}