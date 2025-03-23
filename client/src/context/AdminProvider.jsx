import { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import axios from "axios";
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
            const horaA = Number(a.hora.replace(':', ''));
            const horaB = Number(b.hora.replace(':', ''));
            return horaA - horaB;
          })
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

        const proximaCitaEncontrada = citaHoy.find(cita => cita.hora > horaActual);
        console.log(proximaCitaEncontrada?.hora)
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
          const [horaA, minA] = a.hora.split(":").map(Number);
          const [horaB, minB] = b.hora.split(":").map(Number);

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
  const completarCita = async (id) => {
    try {
      await clienteAxios.delete(`/citas/${id}`)
      const citasActualizadas = citaHoy.filter(cita => cita._id !== id)
      const semanaActualizada = citaSemana.filter(cita => cita._id !== id)
      const calendarioActualizado = citaCalendario.filter(cita => cita._id !== id)
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
  const editarCita = async (cita) => {
    console.log(cita.id)
    try {
      const { data } = await clienteAxios.put(`/citas/${cita.id}`, cita)
      const citasActualizadas = citaHoy.map(c => c._id === cita.id ? data : c)
      const semanaActualizada = citaSemana.map(c => c._id === cita.id ? data : c)
      const calendarioActualizado = citaCalendario.map(c => c._id === cita.id ? data : c)
      console.log(citasActualizadas)
      console.log(semanaActualizada)
      setCitaHoy(citasActualizadas)
      setCitaSemana(semanaActualizada)
      setCitaCalendario(calendarioActualizado)
    } catch (error) {
      console.log(error)
    }
  }

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
          const horaA = Number(a.hora.replace(':', ''));
          const horaB = Number(b.hora.replace(':', ''));
          return horaA - horaB;
        })
        setCitaCalendario(citasActualizadas);
      }

      // Actualizar citas fecha actual
      if (data.fecha === fechaActual) {
        const citasActualizadas = [...citaHoy, data].sort((a, b) => {
          const horaA = Number(a.hora.replace(':', ''));
          const horaB = Number(b.hora.replace(':', ''));
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
          const [horaA, minA] = a.hora.split(":").map(Number);
          const [horaB, minB] = b.hora.split(":").map(Number);

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