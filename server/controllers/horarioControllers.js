import Horario from "../models/Horario.js";

export const listarHorarios = async (req, res) => {
  try {
    const horarios = await Horario.find();

    if (!horarios) return res.json({ msg: "No hay horarios" });

    res.json(horarios);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

export const crearHorarios = async (req, res) => {

  const { hora } = req.body

  try {
    const existeHorario = await Horario.findOne({ hora });

    if (existeHorario) return res.json({ msg: "El horario ya existe" });

    const nuevoHorario = new Horario({ hora });
    await nuevoHorario.save();
    res.status(201).json(nuevoHorario);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

export const actualizarHorario = async (req, res) => {
  try {
    const horario = await Horario.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!horario) return res.status(404).json({ msg: "Horario no encontrado." });

    res.status(200).json(horario);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

export const eliminarHorario = async (req, res) => {
  try {
    const horario = await Horario.findByIdAndDelete(req.params.id);

    if (!horario) return res.status(404).json({ msg: "Horario no encontrado." });

    res.status(200).json({ msg: "Horario eliminado correctamente." });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

export const agregarFechaHorario = async (req, res) => {
  const { id } = req.params;
  const { fecha } = req.body;

  try {
    const horario = await Horario.findById(id);

    if (!horario) {
      return res.status(404).json({ msg: "Horario no encontrado" });
    }

    if (!horario.fecha.includes(fecha)) {
      horario.fecha.push(fecha);
      await horario.save();
    }

    res.status(200).json(horario);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
}

export const eliminarFechaHorario = async (req, res) => {
  try {
    const { horaID, fecha } = req.body

    const horario = await Horario.findById(horaID);
    if (!horario) return res.status(404).json({ message: "Horario no encontrado" });

    horario.fecha = horario.fecha.filter(f => f !== fecha);
    await horario.save()

    res.json(horario)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}