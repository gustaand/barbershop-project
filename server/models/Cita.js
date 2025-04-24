import mongoose from "mongoose";

const citaSchema = new mongoose.Schema({
  fecha: {
    type: String,
    required: true
  },
  hora: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Horario'
  },
  nombreCliente: {
    type: String,
  },
  telefono: {
    type: String,
  },
  servicio: {
    type: String,
  },
}, {
  timestamps: true
});

// Índice TTL: borra la cita 30 días después de su creación
citaSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

const Cita = mongoose.model("Cita", citaSchema);

export default Cita;
