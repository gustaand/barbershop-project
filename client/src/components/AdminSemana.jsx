import { useState, useEffect } from "react";
import useAdmin from "../hooks/useAdmin"
import Separator from "./Separator"
import { FaRegEdit } from "react-icons/fa";
import { MdDoneOutline } from "react-icons/md";
import Modal from "./Modal";
import ModalActualizarCita from "./ModalActualizarCita";

const AdminSemana = ({ fecha }) => {

  const [citasPorFecha, setCitasPorFecha] = useState()
  const [showModal, setShowModal] = useState(false)
  const [showModalActualizar, setShowModalActualizar] = useState(false)
  const [citaId, setCitaId] = useState('')

  const { citaSemana, completarCita, setCitaParaActualizar } = useAdmin()

  useEffect(() => {
    const citasFiltradas = citaSemana.filter(cita => cita.fecha === fecha)
    citasFiltradas.sort((a, b) => a.hora.localeCompare(b.hora))
    setCitasPorFecha(citasFiltradas)
  }, [citaSemana, fecha])

  console.log(citasPorFecha)

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleCloseModalActualizar = () => {
    setShowModalActualizar(false)
  }

  return (
    <div className='mt-2 flex flex-col gap-2'>

      {citasPorFecha?.length ?
        citasPorFecha?.map(cita => (
          <div
            key={cita._id}
            className="flex w-full justify-between px-5 py-2 bg-white shadow-md"
          >
            <div className="flex flex-col w-full">
              <div className="flex gap-5">
                <p>Horario: <span className="font-bold">{cita.hora}</span></p>
              </div >

              <Separator className='my-1' />

              <div>
                <p>Cliente: <span className="font-bold">{cita.nombreCliente}</span></p>
                <Separator className='my-1' />
                <p>Telefono: <span className="font-bold">{cita.telefono}</span></p>
              </div>
            </div>

            <div className="flex flex-col justify-around items-center gap-5">
              <button
                className="text-xl"
                onClick={() => {
                  setCitaParaActualizar(cita)
                  setShowModalActualizar(true)
                }}
              ><FaRegEdit /></button>
              <button
                className="text-xl text-green-800"
                onClick={() => {
                  setShowModal(true)
                  setCitaId(cita._id)
                }}
              ><MdDoneOutline /></button>
            </div>
          </div>
        )) : (
          <div className="text-center mt-10 text-xl font-medium text-slate-300">
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
            completarCita(citaId)
            setShowModal(false)
          }}
          onClose={handleCloseModal}
        />
      }

      {showModalActualizar &&
        <ModalActualizarCita
          onClose={handleCloseModalActualizar}
        />
      }
    </div>
  )
}

export default AdminSemana