import { Router } from "express";
import {
  actualizarHorario,
  crearHorarios,
  eliminarHorario,
  listarHorarios,
  agregarFechaHorario,
  eliminarFechaHorario
} from "../controllers/horarioControllers.js";
import { validarToken } from "../middlewares/validateJWT.js";

const router = Router();

router.get('/', listarHorarios);
router.post('/:id/agregar-fecha', agregarFechaHorario);

// Admin Routes
router.post('/', validarToken, crearHorarios);
router.put('/:id', validarToken, actualizarHorario);
router.delete('/:id', validarToken, eliminarHorario);

// Fecha Horario
router.post('/:horaID/eliminar-fecha', validarToken, eliminarFechaHorario);
export default router;