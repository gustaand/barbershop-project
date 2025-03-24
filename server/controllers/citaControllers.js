import Cita from "../models/Cita.js";

export const crearCita = async (req, res) => {
  try {
    const { fecha, hora, nombreCliente, telefono } = req.body;

    const existeCita = await Cita.findOne({ fecha, hora }).populate("hora", "hora");

    if (existeCita) {
      const error = new Error('Cita ya reservada.');
      return res.status(401).json({ msg: error.message });
    }

    const nuevaCita = new Cita({ fecha, hora, nombreCliente, telefono });

    const citaCreada = await nuevaCita.save();
    const citaConHorario = await Cita.findById(citaCreada._id).populate("hora", "hora");

    res.json(citaConHorario);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const encontrarCita = async (req, res) => {

  const { fecha } = req.body;
  try {
    const existeCita = await Cita.find({ fecha }).populate("hora", "hora");

    return res.status(200).json(existeCita);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};


// ADMIN CONTROLLERS
//TODO: Hacer que despues de 1 semana se elimine todas las citas anteriores a la semana actual
//TODO: O hacer con que se eliminen todas las citas del dia anterior a la fecha actual.
export const eliminarCita = async (req, res) => {
  try {
    const cita = await Cita.findByIdAndDelete(req.params.id);

    if (!cita) return res.status(404).json({ msg: "Cita no encontrada" });

    return res.status(204).json({ msg: 'Cita eliminada' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const actualizarCita = async (req, res) => {
  try {
    const cita = await Cita.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("hora", "hora");

    if (!cita) return res.status(404).json({ msg: "Cita no encontrada." });

    return res.status(200).json(cita);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// GET
export const listarCitas = async (req, res) => {
  try {
    const citas = await Cita.find().populate("hora", "hora");

    if (!citas) return res.json({ msg: "No hay citas" });

    res.status(200).json(citas);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const listarCitaDiaActual = async (req, res) => {
  try {
    if (!req.query.fecha) {
      return res.status(400).json({ message: 'Fecha requerida en query' });
    }

    const fechaActual = new Date(req.query.fecha);
    if (isNaN(fechaActual.getTime())) {
      return res.status(400).json({ message: 'Fecha inválida' });
    }

    const fechaFormateada = fechaActual.toISOString().split('T')[0];

    const citasDiaActual = await Cita.find({ fecha: fechaFormateada }).populate("hora", "hora");

    res.json(citasDiaActual);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const listarCitaDiasSemana = async (req, res) => {
  try {
    if (!req.query.fecha) {
      return res.status(400).json({ message: 'Fecha requerida en query' });
    }

    const fechaActual = new Date(req.query.fecha);
    if (isNaN(fechaActual.getTime())) {
      return res.status(400).json({ message: 'Fecha inválida' });
    }

    let numeroDiaSemana = fechaActual.getDay();

    // Si es domingo (0), restamos 6 para obtener el lunes pasado
    let primerDiaSemana = new Date(fechaActual);
    primerDiaSemana.setDate(fechaActual.getDate() - (numeroDiaSemana === 0 ? 6 : numeroDiaSemana - 1));

    let ultimoDiaSemana = new Date(primerDiaSemana);
    ultimoDiaSemana.setDate(primerDiaSemana.getDate() + 6);

    const fechaInicioSemana = primerDiaSemana.toISOString().split('T')[0];
    const fechaFinSemana = ultimoDiaSemana.toISOString().split('T')[0];

    const citasSemanaActual = await Cita.find({
      fecha: { $gte: fechaInicioSemana, $lte: fechaFinSemana }
    }).populate("hora", "hora");

    res.status(200).json(citasSemanaActual);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
