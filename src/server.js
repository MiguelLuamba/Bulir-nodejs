import userRoutes from "./routes/user.routes.js"
import express, { json, urlencoded } from "express"
import clientRoutes from "./routes/clientes.routes.js"
import prestadoresRoutes from "./routes/prestadores.routes.js"

const app = express()

app.use(json())
app.use(urlencoded({ extended: true }));
app.use("/users", userRoutes)
app.use("/clientes",clientRoutes)
app.use("/prestadores",prestadoresRoutes)



app.listen(4646,(err)=>{
  if(err) return console.log("Error on server starer")
    console.log("Server is running on http://localhost:4646")
})
