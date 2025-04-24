import { useEffect, useState, useRef } from 'react'
import Calendario from "../components/Calendario/Calendario"
import { useSwipeable } from 'react-swipeable'
import { FaRegCalendarAlt } from "react-icons/fa"
import { IoMdArrowDropdown } from "react-icons/io"
import { FaPlus } from "react-icons/fa6"
import Sidebar from '../components/Sidebar'
import ModalCrearCita from '../components/ModalCrearCita'
import clienteAxios from '../config/clienteAxios'
import { formatInTimeZone } from 'date-fns-tz'
import useAdmin from '../hooks/useAdmin'
import CalendarioCitas from '../components/CalendarioCitas'

const Citas = () => {
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState(
    formatInTimeZone(new Date(), 'Europe/Madrid', 'yyyy-MM-dd HH:mm:ss zzz').split(' ')[0]
  )
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { citaCalendario, setCitaCalendario, setFechaCalendario } = useAdmin()

  const calendarRef = useRef(null)
  const toggleRef = useRef(null)

  useEffect(() => {
    const encontrarCitasDia = async () => {
      try {
        const { data } = await clienteAxios(`/citas/citas-dia?fecha=${selectedDate}`)
        const citasOrdenadas = data.sort((a, b) => {
          const horaA = Number((a.hora?.hora || '').replace(':', ''))
          const horaB = Number((b.hora?.hora || '').replace(':', ''))
          return horaA - horaB
        })
        setCitaCalendario(citasOrdenadas)
      } catch (error) {
        console.log(error)
      }
    }

    encontrarCitasDia()
  }, [selectedDate])

  // Cierra el calendario al hacer clic fuera (pero no en el botón)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setShowCalendar(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const onChange = (date) => {
    const fechaFormateada = formatInTimeZone(new Date(date), 'Europe/Madrid', 'yyyy-MM-dd HH:mm:ss zzz').split(' ')[0]
    setSelectedDate(fechaFormateada)
    setFechaCalendario(fechaFormateada)
  }

  const handlers = useSwipeable({
    onSwipedUp: () => setShowCalendar(false)
  })

  const handleCloseModal = () => setShowCreateModal(false)

  return (
    <div className="dark:bg-zinc-900 min-h-screen">
      {/* Barra superior */}
      <div className="fixed top-0 right-0 w-full bg-slate-100 dark:bg-zinc-800 z-40 shadow-md">
        <div className="flex flex-col justify-center items-center mb-3">
          <Sidebar />
        </div>

        {/* Toggle calendario */}
        <div
          ref={toggleRef}
          className='flex items-center justify-between p-3 bg-blue-500 dark:bg-indigo-800 text-white dark:text-slate-100 cursor-pointer'
          onClick={() => setShowCalendar(prev => !prev)}
        >
          <div className='flex justify-center items-center gap-2'>
            <FaRegCalendarAlt className='text-2xl' />
            <span className='uppercase font-semibold'>Calendario</span>
          </div>
          <IoMdArrowDropdown className={`text-3xl ${showCalendar ? 'rotate-180' : ''} transition-all`} />
        </div>

        {/* Calendario */}
        <div {...(showCalendar ? handlers : {})}>
          <div ref={calendarRef}>
            <Calendario
              className={showCalendar
                ? 'xsm:h-[392px] 2xsm:h-[380px] 3xsm:h-[350px] 4xsm:h-[330px] h-[300px]'
                : 'h-0'}
              onChange={onChange}
            />
          </div>
        </div>
      </div>

      {/* Espaciador debajo del header */}
      <div className='h-[123px]'></div>

      {/* Citas del día */}
      {citaCalendario?.length ? (
        <>
          <CalendarioCitas />
          <div className="h-[100px]"></div>
        </>
      ) : (
        <h2 className='pt-3 pb-6 w-full text-center text-xl text-slate-300 dark:text-zinc-500'>
          No hay citas para este día
        </h2>
      )}

      {/* Botón para crear cita */}
      <div
        className='fixed right-0 bottom-28 p-2 text-3xl rounded-full border border-slate-500 dark:border-zinc-600 mr-5 z-30 shadow-md
        bg-blue-500 dark:bg-indigo-800 text-white dark:text-slate-100 cursor-pointer'
        onClick={() => setShowCreateModal(true)}
      >
        <FaPlus className={`transition-all duration-300 ${showCreateModal ? 'rotate-180' : ''}`} />
      </div>

      <div className="h-[90px]"></div>

      {/* Modal para crear cita */}
      {showCreateModal && <ModalCrearCita onClose={handleCloseModal} />}
    </div>
  )

}

export default Citas
