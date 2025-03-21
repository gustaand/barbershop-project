import { useEffect, useState } from "react"
import useAdmin from "../hooks/useAdmin"


const ModalActualizarCita = ({ onClick, onClose }) => {

  const [id, setId] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [nombreCliente, setNombreCliente] = useState('')
  const [telefono, setTelefono] = useState('')

  const { citaParaActualizar, editarCita } = useAdmin()


  useEffect(() => {
    if (citaParaActualizar?._id) {
      setId(citaParaActualizar._id)
      setFecha(citaParaActualizar.fecha)
      setHora(citaParaActualizar.hora)
      setNombreCliente(citaParaActualizar.nombreCliente)
      setTelefono(citaParaActualizar.telefono)

      return
    }

    setId('')
    setFecha('')
    setHora('')
    setNombreCliente('')
    setTelefono('')

  }, [citaParaActualizar])

  const handleSubmit = async (e) => {
    e.preventDefault()

    await editarCita({ id: citaParaActualizar._id, fecha, hora, nombreCliente, telefono })
    onClose()
  }

  return (
    <div className='fixed flex justify-center items-center inset-0 z-40'>

      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <form
        className='flex flex-col box-border gap-2 items-center w-4/5 bg-slate-100 pt-5 rounded-md shadow-md z-10 px-2'
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col w-full items-center justify-center pt-2 py-3 mb-3 border-b border-slate-300">
          {id ? (
            <h2 className="text-xl text-center">Editar Cita:
              <span className="font-bold"> {citaParaActualizar.fecha.split("-").reverse().slice(0, 2).join("-")},</span>
              <span className="font-bold"> {citaParaActualizar.hora}</span>
            </h2>

          ) : (
            <h2 className="text-xl text-center">Crear Cita</h2>
          )}
        </div>

        <label className="flex w-full justify-between items-center gap-3 px-2">
          <p className="text-xl">Fecha: </p>
          <input
            className="p-2 rounded w-7/12 text-center"
            type="text"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </label >

        <label className="flex w-full justify-between items-center gap-3 px-2">
          <p className="text-xl">Hora: </p>
          <input
            className="p-2 rounded w-7/12 text-center"
            type="text"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          />
        </label >

        <label className="flex w-full justify-between items-center gap-3 px-2">
          <p className="text-xl">Cliente: </p>
          <input
            className="p-2 rounded w-7/12 text-center"
            type="text"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
          />
        </label >

        <label className="flex w-full justify-between items-center gap-3 px-2">
          <p className="text-xl">Telefono: </p>
          <input
            className="p-2 rounded w-7/12 text-center"
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </label >

        <div className='flex justify-between items-center w-full border-t border-slate-300 mt-3'>
          <button
            type="submit"
            className='p-4 w-1/2 text-black rounded-b-md active:bg-gray-200 transition-all'
          >{id ? 'Actualizar' : 'Creat Cita'}</button>

          <div className='border-l h-9 border-slate-300'></div>

          <button
            type="button"
            className='p-4 w-1/2 text-black rounded-b-md active:bg-gray-200 transition-all'
            onClick={onClose}
          >Cancelar</button>
        </div>

      </form>
    </div>
  )
}

export default ModalActualizarCita

// Verificar horarios disponibles por la fecha??
// FECHA: Usar un calendario
// HORA: Usar la lista de horarios hechos por el admin