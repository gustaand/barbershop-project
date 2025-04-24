import { useState, useEffect } from "react";
import useAdmin from "../hooks/useAdmin"
import Modal from "./Modal";
import ModalCrearCita from "./ModalCrearCita.jsx";
import CitaCard from "./CitaCard.jsx";

const AdminSemana = ({ fecha }) => {

  const [citasPorFecha, setCitasPorFecha] = useState()
  const [showModal, setShowModal] = useState(false)
  const [showModalCrearActualizar, setShowModalCrearActualizar] = useState(false)
  const [citaId, setCitaId] = useState('')
  const [fechaCita, setFechaCita] = useState('')
  const [horarioID, setHorarioID] = useState('')

  const { citaSemana, completarCita, setCitaParaActualizar } = useAdmin()

  useEffect(() => {
    const citasFiltradas = citaSemana.filter(cita => cita.fecha === fecha);

    citasFiltradas.sort((a, b) => {
      const horaA = a.hora?.hora || ""; // Asegura que no sea undefined
      const horaB = b.hora?.hora || "";
      return horaA.localeCompare(horaB);
    });

    setCitasPorFecha(citasFiltradas);
  }, [citaSemana, fecha]);

  console.log(citasPorFecha)

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleCloseModalActualizar = () => {
    setShowModalCrearActualizar(false)
    setCitaParaActualizar({})
  }

  const handleActualizar = (cita) => {
    setCitaParaActualizar(cita)
    setShowModalCrearActualizar(true)
  }

  const handleEliminar = (cita) => {
    setCitaId(cita._id)
    setFechaCita(cita.fecha)
    setHorarioID(cita.hora._id)
    setShowModal(true)
  }

  return (
    <div className='mt-2 flex flex-col gap-2'>

      {citasPorFecha?.length ?
        citasPorFecha?.map(cita => (
          <CitaCard
            key={cita._id}
            actualizar={() => handleActualizar(cita)}
            eliminar={() => handleEliminar(cita)}
            cita={cita}
          />
        )) : (
          <div className="text-center mt-10 text-xl font-medium text-slate-300 dark:text-slate-700">
            <p>No hay citas para el dia: </p>
            <p>{fecha.split("-").reverse().join("-")}</p>
          </div>
        )}

      {showModal &&
        <Modal
          title='Atención!'
          p='¿Quieres eliminar esta cita?'
          btConfirmValue='Eliminar'
          onClick={() => {
            completarCita(citaId, horarioID, fechaCita)
            setShowModal(false)
          }}
          onClose={handleCloseModal}
        />
      }
      {showModalCrearActualizar &&
        <ModalCrearCita
          onClose={handleCloseModalActualizar}
        />
      }
    </div>
  )
}

export default AdminSemana