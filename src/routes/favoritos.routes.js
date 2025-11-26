import express from "express";
import { criarFavorito, excluirFavorito, listarFavoritos } from "../controllers/favoritos.controller.js"
import { listarFavoritosPorUsuario } from "../controllers/favoritos.controller.js";

const router = express.Router();


router.get("/usuario/:id", listarFavoritosPorUsuario);
router.get('/', listarFavoritos);
router.post('/', criarFavorito);
router.delete('/', excluirFavorito);

export default router;