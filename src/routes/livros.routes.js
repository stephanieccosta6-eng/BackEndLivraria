import express from "express";
const router = express.Router();
import { listarLivro, criarLivro, buscarLivro, atualizarLivro, excluirLivro } from "../controllers/livros.controller.js"
router.get("/", listarLivro);
router.post("/", criarLivro);
router.get("/:id", buscarLivro);
router.put("/:id", atualizarLivro);
router.delete("/:id", excluirLivro);

export default router;
