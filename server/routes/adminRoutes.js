import { Router } from 'express';
import { adminPerfil, login, logout, register } from '../controllers/adminControllers.js';
import { validarToken } from '../middlewares/validateJWT.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/admin-perfil', validarToken, adminPerfil);

export default router;
