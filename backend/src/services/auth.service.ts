import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';

const prisma = new PrismaClient();

export interface AdminUser {
  id: number;
  email: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Crea un administrador inicial con contraseña hasheada.
   */
  static async createAdmin(email: string, password: string): Promise<AdminUser> {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error('Ya existe un administrador con ese correo');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        role: 'ADMIN',
      },
      select: { id: true, email: true, role: true },
    });

    return user;
  }

  /**
   * Autentica un administrador y devuelve un JWT firmado.
   */
  static async login(credentials: LoginCredentials): Promise<{ user: AdminUser; token: string }> {
    const user = await prisma.user.findUnique({ where: { email: credentials.email } });
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const passwordValid = await bcrypt.compare(credentials.password, user.password);
    if (!passwordValid) {
      throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'] },
    );

    return {
      user: { id: user.id, email: user.email, role: user.role },
      token,
    };
  }

  /**
   * Valida un JWT y devuelve el usuario autenticado.
   */
  static verifyToken(token: string): AdminUser {
    const decoded = jwt.verify(token, config.jwtSecret) as AdminUser;
    return decoded;
  }
}
