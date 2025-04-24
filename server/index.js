// Importar dependencias
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
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Configuración de CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://192.168.1.143:5173',
  'http://192.168.1.143:4173',
  'https://barbershop-frontend.pages.dev'
];

// Crear instancia de socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    // credentials: true
  }
});

// Middleware para permitir `req.io` en rutas
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

// Rutas
app.use('/api/citas', citaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/horarios', horarioRoutes);
app.use('/api/diaSemana', diaSemanaRoutes);

// Conexión con clientes WebSocket
io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
