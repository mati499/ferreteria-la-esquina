import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config';
import authRoutes from './routes/auth.routes';

const app: Application = express();

// CORS
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));

// JSON body parser
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas de autenticación (admin)
app.use('/auth', authRoutes);

// Ruta base
app.get('/', (_req, res) => {
  res.json({ name: 'Ferretería La Esquina API', version: '1.0.0' });
});

export default app;
