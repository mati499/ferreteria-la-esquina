import { Request, Response } from 'express';
import { AuthService, LoginCredentials } from '../services/auth.service';

export class AuthController {
  /**
   * POST /auth/login
   * Autentica al administrador y devuelve un JWT.
   */
  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body as LoginCredentials;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
      }

      const { user, token } = await AuthService.login({ email, password });

      return res.status(200).json({
        message: 'Autenticación exitosa',
        user,
        token,
      });
    } catch (error: any) {
      return res.status(401).json({ error: error.message || 'Error de autenticación' });
    }
  }

  /**
   * POST /auth/register (seed inicial / creación de admin)
   * Crea el primer administrador. Solo para uso en setup.
   */
  static async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body as LoginCredentials;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
      }

      const user = await AuthService.createAdmin(email, password);

      return res.status(201).json({
        message: 'Administrador creado',
        user,
      });
    } catch (error: any) {
      if (error.message.includes('Ya existe')) {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message || 'Error al crear administrador' });
    }
  }

  /**
   * GET /auth/me
   * Valida el token y devuelve el usuario autenticado.
   */
  static async me(req: Request, res: Response): Promise<Response> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      const token = authHeader.substring(7);
      const user = AuthService.verifyToken(token);

      return res.status(200).json({ user });
    } catch (error: any) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
  }
}
