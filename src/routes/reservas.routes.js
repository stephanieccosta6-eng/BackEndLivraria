import express from "express";
import { criarReserva, excluirReserva, listarReservas, devolverReserva } from "../controllers/reservas.controller.js"

const router = express.Router();

router.get('/', listarReservas);
router.post('/', criarReserva);
router.delete('/:id',excluirReserva);
router.put("/:id", devolverReserva);

export default router;