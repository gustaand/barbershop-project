import mongoose from "mongoose";

const citaSchema = new mongoose.Schema({
  fecha: {
    type: String,
    require: true
  },
  hora: {
    type: String,
    required: true
  },
  nombreCliente: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Cita = mongoose.model("Cita", citaSchema);

export default Cita;