import Cita from "../models/Cita.js";

export const crearCita = async (req, res) => {
  try {
    const { fecha, hora, nombreCliente, telefono } = req.body;

    const existeCita = await Cita.findOne({ fecha, hora });

    if (existeCita) {
      const error = new Error('Cita ya reservada.');
      return res.status(401).json({ msg: error.message });
    }

    const nuevaCita = new Cita({ fecha, hora, nombreCliente, telefono });

    const citaCreada = await nuevaCita.save();
    res.json(citaCreada);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const encontrarCita = async (req, res) => {

  const { fecha } = req.body;
  try {
    const existeCita = await Cita.find({ fecha });

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
    const cita = await Cita.findByIdAndUpdate(req.params.id, req.body, { new: true });

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
    const citas = await Cita.find();

    if (!citas) return res.json({ msg: "No hay citas" });

    res.status(200).json(citas);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const listarCitaDiaActual = async (req, res) => {
  try {
    const fechaActual = new Date(req.query.fecha)
    const fechaFormateada = fechaActual.toISOString().split('T')[0]
    console.log(fechaFormateada) //todo: arreglar el problema con esta fecha que se está enviando
    const citasDiaActual = await Cita.find({ fecha: fechaFormateada });

    res.json(citasDiaActual);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
}

export const listarCitaDiasSemana = async (req, res) => {
  try {
    // Obtener la fecha actual
    const fechaActual = new Date(req.query.fecha)
    console.log(fechaActual);

    // Obtener el número del día de la semana (0: Domingo, 1: Lunes, ..., 6: Sábado)
    const numeroDiaSemana = fechaActual.getDay();

    // Calcular la fecha de inicio de la semana actual (lunes)
    const primerDiaSemana = new Date(fechaActual);
    primerDiaSemana.setDate(fechaActual.getDate() - numeroDiaSemana + 1);

    // Calcular la fecha de fin de la semana actual (domingo)
    const ultimoDiaSemana = new Date(fechaActual);
    ultimoDiaSemana.setDate(fechaActual.getDate() - numeroDiaSemana + 7);

    // Convertir las fechas al formato requerido (YYYY-MM-DD)
    const fechaInicioSemana = primerDiaSemana.toISOString().split('T')[0];
    const fechaFinSemana = ultimoDiaSemana.toISOString().split('T')[0];

    // Buscar las citas de la semana actual en la base de datos
    const citasSemanaActual = await Cita.find({
      fecha: { $gte: fechaInicioSemana, $lte: fechaFinSemana }
    });

    res.status(200).json(citasSemanaActual);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};