import mongoose from "mongoose";

const citaSchema = new mongoose.Schema({
  fecha: {
    type: String,
    require: true
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
  }
}, {
  timestamps: true
});

const Cita = mongoose.model("Cita", citaSchema);

export default Cita;