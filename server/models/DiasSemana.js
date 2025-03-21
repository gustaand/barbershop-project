import mongoose from "mongoose";
import Horario from "./Horario";

const diaSemanaSchema = new mongoose.Schema({
  dia: {
    type: String,
    required: true
  },
  horarios: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Horario'
    }
  ]
}, {
  timestamps: true
})

const DiaSemana = mongoose.model('DiaSemana', diaSemanaSchema);
export default DiaSemana;