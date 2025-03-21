import mongoose from "mongoose";

const horarioSchema = new mongoose.Schema({
  hora: {
    type: String,
    required: true,
  },
  activo: {
    type: Boolean,
    default: true
  },
  fecha: {
    type: [String],
    default: []
  },
}, {
  timestamps: true,
});

const Horario = mongoose.model('Horario', horarioSchema);
export default Horario;