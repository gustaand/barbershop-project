import { useEffect, useState } from "react"
import { FaTrashAlt } from "react-icons/fa";
import Modal from "./Modal";
import useAdmin from "../hooks/useAdmin"

const ModalCrearHorario = ({ onClose }) => {

  const horaActual = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  const [hora, setHora] = useState(horaActual)
  const [fechasDesactivadas, setFechasDesactivadas] = useState([])
  const [showModal, setShowModal] = useState(false)

  const {
    crearHorario,
    horarioParaActualizar,
    setHorarioParaActualizar,
    actualizarHorario,
    eliminarHorario
  } = useAdmin()

  useEffect(() => {
    if (horarioParaActualizar?._id) {
      setHora(horarioParaActualizar?.hora)
    }
  }, [horarioParaActualizar])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      const dataHora = { hora, fecha: fechasDesactivadas }
      if (horarioParaActualizar?._id) {
        await actualizarHorario({ id: horarioParaActualizar._id, ...dataHora });
        setHora(horaActual)
        setHorarioParaActualizar({})
      } else {
        await crearHorario(dataHora)
        setHora(horaActual)
      }

      onClose()
    } catch (error) {
      console.log(error)
    }
  }

  const handleCloseModal = () => {
    onClose()
    setHorarioParaActualizar({})
  }

  return (
    <div className='fixed flex justify-center items-center inset-0 z-40'>
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleCloseModal}
      ></div>

      <form
        className='flex flex-col box-border gap-4 items-center w-4/5 bg-slate-100 rounded-md shadow-md z-10 px-2'
      >
        <div className={`flex flex-col w-full items-center justify-center ${horarioParaActualizar?._id ? 'pb-3' : 'py-5'} mb-3 border-b border-slate-300`}>
          {horarioParaActualizar?._id && (
            <div
              className="w-full flex text-start text-xl pt-2 select-none"
              onClick={() => {
                setShowModal(!showModal)
              }}
            >
              <FaTrashAlt className="active:scale-110 transition-all ease-linear" />
            </div>
          )}
          <h2 className="text-xl text-center select-none">{horarioParaActualizar?._id ? 'Actualizar Horario' : 'Crear Horario'}</h2>
        </div>

        <label className="m-2 w-full items-center flex justify-center bg-white rounded-md">
          <input
            type="time"
            value={hora}
            className="text-4xl w-full p-2 rounded-md flex bg-white items-center justify-center"
            onChange={e => setHora(e.target.value)}
          />
        </label>

        <div className='flex justify-between items-center w-full border-t border-slate-300 mt-3'>
          <button
            type="button"
            className='p-4 w-1/2 text-black rounded-b-md active:bg-gray-200 transition-all'
            onClick={handleSubmit}
          >{horarioParaActualizar?._id ? 'Actualizar' : 'Crear'}</button>

          <div className='border-l h-9 border-slate-300'></div>

          <button
            type="button"
            className='p-4 w-1/2 text-black rounded-b-md active:bg-gray-200 transition-all'
            onClick={handleCloseModal}
          >Cancelar</button>
        </div>
      </form>

      {showModal && (
        <Modal
          title="¿Eliminar horario?"
          p="¿Estas seguro de eliminar el horario?"
          btConfirmValue="Eliminar"
          zIndex={"z-50"}
          onClick={() => {
            eliminarHorario(horarioParaActualizar._id)
            setShowModal(false)
          }}
          onClose={() => setShowModal(false)}
        />
      )}

    </div>
  )
}

export default ModalCrearHorario