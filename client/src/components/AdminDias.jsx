import { useState } from "react";
import useAdmin from "../hooks/useAdmin"
import Modal from "./Modal";
import ModalCrearCita from "./ModalCrearCita.jsx";
import CitaCard from "./CitaCard.jsx";

const AdminDias = () => {

  const [showModal, setShowModal] = useState(false)
  const [showModalCrearActualizar, setShowModalCrearActualizar] = useState(false)
  const [citaId, setCitaId] = useState('')
  const [fechaCita, setFechaCita] = useState('')
  const [horarioID, setHorarioID] = useState('')

  const { citaHoy, completarCita, setCitaParaActualizar } = useAdmin()

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
    setCitaId(cita._id);
    setFechaCita(cita.fecha);
    setHorarioID(cita?.hora?._id || '');
    setShowModal(true);
  };

  return (
    <div className="flex flex-col gap-3 pt-3">

      {citaHoy.length ?
        citaHoy?.map(cita => (
          <CitaCard
            key={cita._id}
            actualizar={() => handleActualizar(cita)}
            eliminar={() => handleEliminar(cita)}
            cita={cita}
          />
        )) : (
          <div className="text-center mt-10 text-xl font-medium text-slate-300">No hay citas hoy</div>
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

export default AdminDias