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
app.use(cors({
  origin: ['http://localhost:5173', 'http://192.168.1.143:5173'],
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