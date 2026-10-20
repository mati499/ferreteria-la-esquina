import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT ?? '3000', 10),
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtSecret: process.env.JWT_SECRET ?? 'default-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '24h',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  whatsappDefaultNumber: process.env.WHATSAPP_DEFAULT_NUMBER ?? '',
};
