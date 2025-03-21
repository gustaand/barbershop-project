import { Router } from "express";
import {
  actualizarHorario,
  crearHorarios,
  eliminarHorario,
  listarHorarios,
  agregarFechaHorario
} from "../controllers/horarioControllers.js";
import { validarToken } from "../middlewares/validateJWT.js";

const router = Router();

router.get('/', listarHorarios);
router.put('/:id/agregar-fecha', agregarFechaHorario);

// Admin Routes
router.post('/', validarToken, crearHorarios);
router.put('/:id', validarToken, actualizarHorario);
router.delete('/:id', validarToken, eliminarHorario);

export default router;