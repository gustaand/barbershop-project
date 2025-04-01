import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import citaRoutes from './routes/citaRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import horarioRoutes from './routes/horarioRoutes.js';
import diaSemanaRoutes from './routes/diaSemanaRoutes.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173',
  'http://192.168.1.143:5173',
  'https://barbershop-frontend.pages.dev'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite solicitudes sin origen (como Postman, apps móviles) o si el origen está en la lista
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`CORS Denegado para origen: ${origin}`);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

dotenv.config();

connectDB();

// ROUTES
app.use("/api/citas", citaRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/horarios", horarioRoutes);
app.use("/api/diaSemana", diaSemanaRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puesto ${PORT}`);
});