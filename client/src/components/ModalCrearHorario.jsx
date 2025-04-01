import { useEffect, useState } from "react"
import useAdmin from "../hooks/useAdmin"

const ModalCrearHorario = ({ onClose }) => {

  const horaActual = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  const [hora, setHora] = useState(horaActual)
  const [fechasDesactivadas, setFechasDesactivadas] = useState([])

  const {
    crearHorario,
    horarioParaActualizar,
    setHorarioParaActualizar,
    actualizarHorario
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
        className='flex flex-col box-border gap-2 items-center w-4/5 bg-slate-100 pt-5 rounded-md shadow-md z-10 px-2'
      >

        <div className="flex flex-col w-full items-center justify-center pt-2 py-3 mb-3 border-b border-slate-300">
          <h2 className="text-xl text-center">Crear Horario</h2>
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
    </div>
  )
}

export default ModalCrearHorario