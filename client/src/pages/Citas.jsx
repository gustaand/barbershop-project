import { useEffect, useState } from 'react'
import Calendario from "../components/Calendario/Calendario"
import { useSwipeable } from 'react-swipeable'
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import Sidebar from '../components/Sidebar';
import ModalCrearCita from '../components/ModalCrearCita';
import clienteAxios from '../config/clienteAxios';
import { formatInTimeZone } from 'date-fns-tz';
import useAdmin from '../hooks/useAdmin';
import AdminDias from '../components/AdminDias';
import CalendarioCitas from '../components/CalendarioCitas';

const Citas = () => {

  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState(formatInTimeZone(new Date(), 'Europe/Madrid', 'yyyy-MM-dd HH:mm:ss zzz').split(' ')[0])
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { citaCalendario, setCitaCalendario, setFechaCalendario } = useAdmin()

  useEffect(() => {
    const encontrarCitasDia = async () => {
      try {
        const { data } = await clienteAxios(`/citas/citas-dia?fecha=${selectedDate}`)

        const citasOrdenadas = data.sort((a, b) => {
          const horaA = Number((a.hora?.hora || '').replace(':', ''));
          const horaB = Number((b.hora?.hora || '').replace(':', ''));
          return horaA - horaB;
        });
        setCitaCalendario(citasOrdenadas)
        console.log(citaCalendario)

      } catch (error) {
        console.log(error)
      }
    }

    encontrarCitasDia()
  }, [selectedDate])

  const onChange = async (date) => {
    const fecha = new Date(date)
    const fechaFormateada = formatInTimeZone(fecha, 'Europe/Madrid', 'yyyy-MM-dd HH:mm:ss zzz').split(' ')[0]
    setSelectedDate(fechaFormateada)
    setFechaCalendario(fechaFormateada)
  }

  const handlers = useSwipeable({
    onSwipedUp: () => setShowCalendar(false)
  })

  const handleCloseModal = () => {
    setShowCreateModal(false)
  }

  return (
    <div>

      <div className="fixed top-0 right-0 w-full bg-slate-100 z-40 shadow-md">
        <div className="flex flex-col justify-center items-center mb-3">
          <Sidebar />
        </div>

        <div
          className='flex items-center justify-between p-3 bg-indigo-500 text-white'
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <div className='flex justify-center items-center gap-2'>
            <FaRegCalendarAlt className='text-2xl' /> <span className='uppercase font-semibold'>Calendario</span>
          </div>

          <IoMdArrowDropdown className={`text-3xl ${showCalendar ? 'rotate-180' : ''} transition-all`} />
        </div>

        <div {...handlers}>
          <Calendario
            className={showCalendar ? 'xsm:h-[392px] 2xsm:h-[380px] 3xsm:h-[350px] 4xsm:h-[330px] h-[300px]' : 'h-0'}
            onChange={onChange}
          />
        </div>

      </div>

      <div className='h-[123px]'></div>

      {citaCalendario?.length ? (
        <div>
          <CalendarioCitas />
          <div className="h-[100px]"></div>
        </div>
      ) : (
        <h2 className='pt-3 pb-6 w-full text-center text-xl text-slate-300'>
          No hay citas para este dia
        </h2>
      )}

      <div
        className='fixed right-0 bottom-28 p-2 text-3xl rounded-full border border-slate-500 mr-5 z-30 shadow-md
        bg-indigo-500 text-white'
        onClick={() => setShowCreateModal(true)}
      ><FaPlus className={`transition-all duration-300 ${showCreateModal ? 'rotate-180' : ''}`} /></div>

      <div className="h-[90px]"></div>

      {showCreateModal &&

        //TODO: USAR EL ModalActualizarCita MODIFICANDO PARA QUE SE PUEDA USAR PARA AMBOS CREAR Y ACTUALIZAR.
        <ModalCrearCita
          onClose={handleCloseModal}
        />
      }
    </div>
  )
}

export default Citas