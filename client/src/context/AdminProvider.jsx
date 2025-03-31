import { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import Cookies from "js-cookie";
import { formatInTimeZone } from "date-fns-tz";

const AdminContext = createContext()

export const AdminProvider = ({ children }) => {

  const [citaHoy, setCitaHoy] = useState([])
  const [citaCalendario, setCitaCalendario] = useState([])
  const [fechaCalendario, setFechaCalendario] = useState(formatInTimeZone(new Date(), 'Europe/Madrid', 'yyyy-MM-dd HH:mm:ss zzz').split(' ')[0])
  const [citaSemana, setCitaSemana] = useState([])
  const [proximaCita, setProximaCita] = useState({})
  const [citaParaActualizar, setCitaParaActualizar] = useState({})
  const [horarios, setHorarios] = useState([])
  const [horarioParaActualizar, setHorarioParaActualizar] = useState({})

  const location = useLocation()
  const token = Cookies.get('token')

  // Obtener horarios (Corrección: Evita llamadas duplicadas)
  const obtenerHorarios = async () => {
    try {
      const { data } = await clienteAxios.get("/horarios");
      const horariosOrdenados = data.sort((a, b) => {
        const [horaA, minA] = a.hora.split(":").map(Number);
        const [horaB, minB] = b.hora.split(":").map(Number);
        return horaA !== horaB ? horaA - horaB : minA - minB;
      });

      setHorarios(horariosOrdenados);
    } catch (error) {
      console.error("Error al obtener horarios:", error);
    }
  };

  // Obtener citas del día
  const listarCitasDiaActual = async () => {
    try {
      const fechaActual = new Date().toISOString().split("T")[0]; // 📌 Formato YYYY-MM-DD
      const { data } = await clienteAxios(`/citas/citas-dia?fecha=${fechaActual}`);

      const citasOrdenadas = data.sort((a, b) => {
        const horaA = Number((a.hora?.hora || "").replace(":", ""));
        const horaB = Number((b.hora?.hora || "").replace(":", ""));
        return horaA - horaB;
      });

      setCitaHoy(citasOrdenadas);
    } catch (error) {
      console.error("Error al listar citas del día:", error);
    }
  };

  // Obtener citas de la semana
  const listarCitasDiaSemana = async () => {
    try {
      const fechaActual = new Date().toISOString().split("T")[0];
      const { data } = await clienteAxios(`/citas/citas-semana?fecha=${fechaActual}`);
      setCitaSemana(data);
    } catch (error) {
      console.error("Error al listar citas de la semana:", error);
    }
  };

  // Obtener próxima cita
  const mostrarProximaCita = () => {
    const horaActual = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const proximaCita = citaHoy.find(cita => cita.hora?.hora > horaActual);
    setProximaCita(proximaCita);
  };

  // Cargar Horarios (Se ejecuta siempre al cargar la app)
  useEffect(() => {
    obtenerHorarios();
  }, []);

  // Cargar Citas del Día y Semana (Solo si el usuario está en `/admin` y tiene token)
  useEffect(() => {
    if (location.pathname === "/admin" && token) {
      listarCitasDiaActual();
      listarCitasDiaSemana();
    }
  }, [token, location.pathname]);

  // 🔹 Actualizar Próxima Cita cada 10 minutos (Si hay citas hoy)
  useEffect(() => {
    if (location.pathname === "/admin" && token) {
      mostrarProximaCita();
      const intervalo = setInterval(mostrarProximaCita, 10 * 60 * 1000);
      return () => clearInterval(intervalo);
    }
  }, [citaHoy, location.pathname]);

  // COMPLETAR / ELIMINAR CITA
  const completarCita = async (citaID, horaID, fecha) => {
    try {
      // Eliminar Cita
      await clienteAxios.delete(`/citas/${citaID}`)
      // Eliminar fecha del horario
      await clienteAxios.post(`/horarios/${horaID}/eliminar-fecha`, { fecha })
      // Actualizar horario
      await obtenerHorarios();

      const citasActualizadas = citaHoy.filter(cita => cita._id !== citaID)
      const semanaActualizada = citaSemana.filter(cita => cita._id !== citaID)
      const calendarioActualizado = citaCalendario.filter(cita => cita._id !== citaID)
      console.log(citasActualizadas)
      console.log(semanaActualizada)
      setCitaHoy(citasActualizadas)
      setCitaSemana(semanaActualizada)
      setCitaCalendario(calendarioActualizado)
    } catch (error) {
      console.log(error)
    }
  }

  // EDITAR CITA
  const editarCita = async (cita, idHoraEliminarFecha) => {
    console.log("Nueva Hora ID:", cita.hora._id);
    console.log("Hora Anterior ID:", idHoraEliminarFecha);

    try {
      // Actualizar Cita
      const { data } = await clienteAxios.put(`/citas/${cita.id}`, cita);

      // Agregar nueva fecha al horario
      await clienteAxios.post(`/horarios/${cita.hora?._id}/agregar-fecha`, { fecha: cita.fecha });

      // Eliminar fecha anterior si existía
      if (idHoraEliminarFecha) {
        await clienteAxios.post(`/horarios/${idHoraEliminarFecha}/eliminar-fecha`, { fecha: cita.fecha });
      }

      // Actualizar lista de horarios
      await obtenerHorarios();

      // Actualizar estado de citas
      setCitaHoy((prev) => prev.map(c => (c._id === cita.id ? data : c)));
      setCitaSemana((prev) => prev.map(c => (c._id === cita.id ? data : c)));
      setCitaCalendario((prev) => prev.map(c => (c._id === cita.id ? data : c)));
    } catch (error) {
      console.log("Error al actualizar cita:", error);
    }
  };

  // CREAR CITA
  const crearCita = async (cita, horaID) => {
    const fechaActual = formatInTimeZone(new Date(), 'Europe/Madrid', 'yyyy-MM-dd HH:mm:ss zzz').split(' ')[0]
    try {
      const { data } = await clienteAxios.post("/citas", cita)
      console.log(data)
      await clienteAxios.post(`/horarios/${horaID}/agregar-fecha`, { fecha: cita.fecha })
      await obtenerHorarios(); // Actualizar horarios

      // Actualizar citas semana
      setCitaSemana(prevCitaSemana => [...prevCitaSemana, data])

      // Actualizar cita calendario en orden
      if (data.fecha === fechaCalendario) {
        const citasActualizadas = [...citaCalendario, data].sort((a, b) => {
          const horaA = Number((a.hora?.hora || '').replace(':', ''));
          const horaB = Number((b.hora?.hora || '').replace(':', ''));
          return horaA - horaB;
        })
        setCitaCalendario(citasActualizadas);
      }

      // Actualizar citas fecha actual
      if (data.fecha === fechaActual) {
        const citasActualizadas = [...citaHoy, data].sort((a, b) => {
          const horaA = Number((a.hora?.hora || '').replace(':', ''));
          const horaB = Number((b.hora?.hora || '').replace(':', ''));
          return horaA - horaB;
        })
        setCitaHoy(citasActualizadas)
      }

    } catch (error) {
      console.log(error)
    }
  }

  // CREAR HORARIO
  const crearHorario = async (horario) => {
    try {
      const { data } = await clienteAxios.post("/horarios", horario);
      console.log(data);

      setHorarios(prevHorarios => {
        const newHorarios = [...prevHorarios, data];

        return newHorarios.sort((a, b) => {
          const [horaA, minA] = a.hora?.hora.split(":").map(Number) || [0, 0];
          const [horaB, minB] = b.hora?.hora.split(":").map(Number) || [0, 0];

          return horaA !== horaB ? horaA - horaB : minA - minB;
        });
      });
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <AdminContext.Provider
      value={{
        citaHoy,
        citaCalendario,
        setCitaCalendario,
        setFechaCalendario,
        proximaCita,
        completarCita,
        citaSemana,
        citaParaActualizar,
        setCitaParaActualizar,
        editarCita,
        crearCita,
        crearHorario,
        horarios,
        obtenerHorarios,
        horarioParaActualizar,
        setHorarioParaActualizar,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export default AdminContext