import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// POST /auth/login — iniciar sesión de admin
router.post('/login', AuthController.login);

// POST /auth/register — crear administrador (setup inicial)
router.post('/register', AuthController.register);

// GET /auth/me — validar token y obtener usuario actual
router.get('/me', authMiddleware, AuthController.me);

export default router;
