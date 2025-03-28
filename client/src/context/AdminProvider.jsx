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

  const location = useLocation()
  const token = Cookies.get('token')

  // CITAS DEL DIA
  useEffect(() => {

    if (location.pathname === '/admin' && token) {

      // todo: Agregat un loading

      // CITAS DIA ACTUAL
      // TODO: Agregar un actualizador a cada cierto tiempo (Talvez una dependencia des del Calendario del usuario, Un gatillo que haz con que cambie)
      // Agregar un gatillo que cuando cambie las citas, se llama otra vez este useEffect?
      // TODO: Separar las dos funciones en useEffects diferentes.
      const listarCitasDiaActual = async () => {

        try {
          const fechaActual = new Date()
          const { data } = await clienteAxios(`/citas/citas-dia?fecha=${fechaActual}`)
          // Ordenar las citas por horario de menor a mayor
          const citasOrdenadas = data.sort((a, b) => {
            const horaA = Number((a.hora?.hora || '').replace(':', ''));
            const horaB = Number((b.hora?.hora || '').replace(':', ''));
            return horaA - horaB;
          });
          console.log(citasOrdenadas)
          setCitaHoy(citasOrdenadas);
        } catch (error) {
          console.log(error)
        }
      }

      // CITAS SEMANA
      const listarCitasDiaSemana = async () => {
        try {
          const fechaActualSemana = new Date();
          const { data } = await clienteAxios(`/citas/citas-semana?fecha=${fechaActualSemana}`);
          setCitaSemana(data)
        } catch (error) {
          console.log(error)
        }
      }

      listarCitasDiaActual()
      listarCitasDiaSemana()
    }
  }, [token])

  // PROXIMA CITA
  useEffect(() => {

    if (location.pathname === '/admin' && token) {
      const mostrarProximaCita = async () => {
        const horaActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const proximaCitaEncontrada = citaHoy.find(cita => cita.hora?.hora > horaActual);
        console.log(proximaCitaEncontrada?.hora?.hora)
        setProximaCita(proximaCitaEncontrada);
      }

      mostrarProximaCita()
      const intervalo = setInterval(() => {
        mostrarProximaCita()
      }, 10 * 60 * 1000)

      return () => clearInterval(intervalo);
    }
  }, [citaHoy, location.pathname])

  useEffect(() => {

    // HORARIOS
    const listarHorarios = async () => {
      try {
        const { data } = await clienteAxios(`/horarios`)

        const newHorarios = data.sort((a, b) => {
          const [horaA, minA] = a.hora?.hora.split(":").map(Number) || [0, 0];
          const [horaB, minB] = b.hora?.hora.split(":").map(Number) || [0, 0];

          return horaA !== horaB ? horaA - horaB : minA - minB;
        });

        setHorarios(newHorarios)

      } catch (error) {
        console.log(error)
      }
    }

    listarHorarios()
  }, [])

  // OBTENER HORARIOS
  const obtenerHorarios = async () => {
    try {
      const { data } = await clienteAxios.get("/horarios"); // <--- Asegúrate de que este endpoint sea correcto
      setHorarios(data);
    } catch (error) {
      console.error("Error al obtener horarios:", error);
    }
  };

  useEffect(() => {
    obtenerHorarios();
  }, []);

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
        obtenerHorarios
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export default AdminContext