import {
    criarAvaliacao,
    listarAvaliacoes,
    buscarAvaliacao,
    atualizarAvaliacao,
    deletarAvaliacao,
} from "../controllers/avaliacoes.controller.js";

import express from "express";

const routes = express.Router();
routes.get("/", listarAvaliacoes)
routes.post("/", criarAvaliacao)
routes.get("/:id", buscarAvaliacao)
routes.put("/:id", atualizarAvaliacao)
routes.delete("/:id", deletarAvaliacao)

export default routes;
