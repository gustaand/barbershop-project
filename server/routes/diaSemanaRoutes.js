import { Router } from "express";
import { validarToken } from "../middlewares/validateJWT.js";

const router = Router()

router.get('/')

// Admin Routes
router.post('/', validarToken)
router.put('/:id', validarToken)
router.delete('/:id', validarToken)


export default router;