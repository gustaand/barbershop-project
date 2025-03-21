import { useState } from 'react';
import ReactCalendar from 'react-calendar'
import './Calendario/Calendar.css'
import { FaRegCalendar } from "react-icons/fa";
import { GrClose } from "react-icons/gr";
import { formatInTimeZone } from 'date-fns-tz';
import useAdmin from '../hooks/useAdmin';

const ModalCrearCita = ({ onClick, onClose }) => {

  const [showCalendario, setShowCalendario] = useState(false)
  const [fecha, setFecha] = useState(formatInTimeZone(new Date(), 'Europe/Madrid', 'yyyy-MM-dd HH:mm:ss zzz').split(' ')[0])
  const [hora, setHora] = useState('')
  const [nombreCliente, setNombreCliente] = useState('')
  const [telefono, setTelefono] = useState('')

  const { crearCita } = useAdmin()

  const handleDateCalendar = (date) => {
    const fecha = new Date(date)
    // Manejar horario local con formatInTimeZone de 'date-fns-tz'
    const fechaFormateada = formatInTimeZone(fecha, 'Europe/Madrid', 'yyyy-MM-dd HH:mm:ss zzz').split(' ')[0]
    setFecha(fechaFormateada)
    setTimeout(() => {
      setShowCalendario(false)
    }, 100);
  }

  const handleCrearCita = async () => {
    try {
      const datosCita = { fecha, hora, nombreCliente, telefono }
      await crearCita(datosCita)

      // Clear the form
      setFecha(formatInTimeZone(new Date(), 'Europe/Madrid', 'yyyy-MM-dd HH:mm:ss zzz').split(' ')[0])
      setHora('')
      setNombreCliente('')
      setTelefono('')

      onClose()
    } catch (error) {
      console.error('Error al crear la cita:', error)
    }
  }

  return (
    <div className='fixed flex justify-center items-center inset-0 z-40'>

      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <form
        className='flex flex-col box-border gap-2 items-center w-4/5 bg-slate-100 pt-5 rounded-md shadow-md z-10 px-2'
      >
        <div className="flex flex-col w-full items-center justify-center pt-2 py-3 mb-3 border-b border-slate-300">
          <h2 className="text-xl text-center">Crear cita</h2>
        </div>

        <label
          className="flex w-full justify-between items-center gap-3 px-2"
          onClick={() => setShowCalendario(true)}
        >
          <p className="text-xl">Fecha: </p>
          <div className="flex items-center justify-between rounded bg-white w-7/12 p-2">
            <div
              className="w-5/6 text-center"
            >
              <p>{fecha.split("-").reverse().join("-")}</p>
            </div>
            <FaRegCalendar className="active:text-blue-600 transition-colors justify-self-end cursor pointer w-1/6" />
          </div>
        </label >

        <label className="flex w-full justify-between items-center gap-3 px-2">
          <p className="text-xl">Hora: </p>
          <input
            className="p-2 rounded w-7/12 text-center"
            type="text"
            // value={fecha}
            onChange={(e) => setHora(e.target.value)}
          />
        </label >

        <label className="flex w-full justify-between items-center gap-3 px-2">
          <p className="text-xl">Cliente: </p>
          <input
            className="p-2 rounded w-7/12 text-center"
            type="text"
            // value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
          />
        </label >

        <label className="flex w-full justify-between items-center gap-3 px-2">
          <p className="text-xl">Telefono: </p>
          <input
            className="p-2 rounded w-7/12 text-center"
            type="text"
            // value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </label >

        <div className='flex justify-between items-center w-full border-t border-slate-300 mt-3'>
          <button
            type="button"
            className='p-4 w-1/2 text-black rounded-b-md active:bg-gray-200 transition-all'
            onClick={handleCrearCita}
          >Crear Cita</button>

          <div className='border-l h-9 border-slate-300'></div>

          <button
            type="button"
            className='p-4 w-1/2 text-black rounded-b-md active:bg-gray-200 transition-all'
            onClick={onClose}
          >Cancelar</button>
        </div>

      </form>

      {/* CALENDARIO //!ARREGLAR DESIGN (botón de cerrar) */}
      {showCalendario &&
        <div className='fixed flex-col justify-center flex w-full h-full rounded-md shadow-md z-10' >

          <div
            className="absolute inset-0"
            onClick={() => setShowCalendario(false)}
          ></div>

          <div className='bg-white z-10'>
            <div className='flex w-full justify-end px-2 py-4'>
              <button
                className='active:scale-125 transition-transform opacity-70 hover:opacity-100 px-4'
                onClick={() => setShowCalendario(false)}
              >
                <GrClose />
              </button>
            </div>

            <ReactCalendar
              minDate={new Date()}
              className={`REACT-CALENDAR border-none px-2 pb-5 rounded-none transition-all z-10 overflow-hidden`}
              view='month'
              onClickDay={(date) => handleDateCalendar(date)}
            // onChange={onChange}
            />
          </div>

        </div >
      }
    </div>
  )
}

export default ModalCrearCita