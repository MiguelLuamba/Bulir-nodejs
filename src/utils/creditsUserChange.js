import { promises as fs } from "fs";
import {contratoDatabasePath, serviceDataBasePath, userDataBasePath} from "../utils/globalvar.js"


export async function decrementUserCredit(userId, idServico) {
  let finalData = "";

  let saldo = 0;
  let preco = 0;
  let idPrestador = "";
  const usuarios = JSON.parse(await fs.readFile(userDataBasePath, "utf8"));
  const servicos = JSON.parse(await fs.readFile(serviceDataBasePath, "utf8"));

  for (const iterator of usuarios) {
    if (iterator.id === userId) {
      saldo = iterator.saldo;
      break;
    }
  }
  for (const iterator of servicos) {
    if (iterator.id === idServico) {
      preco = iterator.preco;
      idPrestador = iterator.userId;
      break;
    }
  }

  if (saldo < preco) return "SALDO INSUFICIENTE";
  let newUserCredit = Number(saldo) - Number(preco);
  let userDataUpdating = usuarios.map(e => {
    if (e.id === userId) {
      e.saldo = newUserCredit;
    } else if (e.id === idPrestador) {
      e.saldo = Number(e.saldo) + Number(preco);
    }
    return e;
  });

  try {
    await fs.writeFile(userDataBasePath, JSON.stringify(userDataUpdating));
    finalData = "SUCESSO";
  } catch (err) {
    finalData = "ERROR";
  }

  return finalData;
}
