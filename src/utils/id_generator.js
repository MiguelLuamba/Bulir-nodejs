import { promises as fs } from "fs";
import { randomUUID } from "crypto";

import {contratoDatabasePath, serviceDataBasePath, userDataBasePath} from "../utils/globalvar.js"



// GERAR ID DOS CLIENTES
export async function generateUserId() {
  let userId = randomUUID();
  
  try {
    const data = await fs.readFile(userDataBasePath, "utf-8");
    let clientes = JSON.parse(data);
    let verify = clientes.some(e => e.id === userId);

    if (verify) {
      return generateUserId();
    }

    return userId; 
  } catch (err) {
    console.error("Error: " + err);
    throw err; 
  }
}

// GERAR ID DOS SERVIÇOS
export async function generateServiceId() {
  let serviceId = randomUUID();
  
  try {
    const data = await fs.readFile(serviceDataBasePath, "utf-8");
    let servicos = JSON.parse(data);
    let verify = servicos.some(e => e.id === serviceId);

    if (verify) {
      return generateServiceId();
    }

    return serviceId;
  } catch (err) {
    console.error("Error: " + err);
    throw err; 
  }
}

// GERAR ID DOS CONTRATOS
export async function generateContratoID() {
  let contratoID = randomUUID();
  
  try {
    const data = await fs.readFile(contratoDatabasePath, "utf-8");
    let contratos = JSON.parse(data);
    let verify = contratos.some(e => e.id === contratoID);

    if (verify) {
      return generateContratoID();
    }

    return contratoID;
  } catch (err) {
    console.error("Error: " + err);
    throw err; 
  }
}