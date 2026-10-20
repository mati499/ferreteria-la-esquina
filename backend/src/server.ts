import { config } from './config';
import app from './app';

app.listen(config.port, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${config.port}`);
});
