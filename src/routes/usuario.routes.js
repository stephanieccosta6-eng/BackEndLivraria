import { 
    criarUsuario,
    listaUsuario,
    obterUsuario,
    atulizaUsuario,
    deletarUsuario } from "../controllers/usuario.controllers.js";

import express from "express";

const router = express.Router();

router.get("/",listaUsuario);
router.post("/",criarUsuario);
router.get("/:id", obterUsuario );
router.put("/:id", atulizaUsuario);
router.delete("/:id", deletarUsuario);

export default router;

