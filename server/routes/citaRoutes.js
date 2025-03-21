import { Router } from 'express';
import {
  actualizarCita,
  crearCita,
  eliminarCita,
  encontrarCita,
  listarCitaDiaActual,
  listarCitaDiasSemana,
  listarCitas,
} from '../controllers/citaControllers.js';
import { validarToken } from '../middlewares/validateJWT.js';

const router = Router();

router.post('/', crearCita);
router.post('/encontrar', encontrarCita);

// ADMIN ROUTES
router.delete('/:id', validarToken, eliminarCita);
router.put('/:id', validarToken, actualizarCita);
router.get('/', validarToken, listarCitas);
router.get('/citas-dia', validarToken, listarCitaDiaActual);
router.get('/citas-semana', validarToken, listarCitaDiasSemana);

export default router;