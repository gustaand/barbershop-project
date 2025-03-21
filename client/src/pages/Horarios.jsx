import Sidebar from "../components/Sidebar"
import { useState } from "react"
import ModalCrearHorario from "../components/ModalCrearHorario"
import { TbClockHour5 } from "react-icons/tb";
import { FaPlus } from "react-icons/fa6";
import useAdmin from "../hooks/useAdmin";
import Switch from "../components/Switch";
import Separator from "../components/Separator";


const Horarios = () => {

  const [modalHorario, setModalHorario] = useState(false)
  const { horarios } = useAdmin()

  const handleCloseModal = () => {
    setModalHorario(false)
  }

  return (
    <div>
      <div className="fixed top-0 right-0 w-full bg-slate-100 z-40 shadow-md">
        <div className="flex flex-col justify-center items-center mb-3">
          <Sidebar />
        </div>

        <div
          className='flex items-center justify-between p-3 bg-indigo-500 text-white uppercase font-semibold active:bg-indigo-600'
          onClick={() => setModalHorario(true)}
        >
          <div className='flex justify-center items-center gap-2'>
            <TbClockHour5 className='text-3xl' /> <span className='uppercase font-semibold'>crear horário</span>
          </div>

          <FaPlus className={`transition-all duration-300 text-2xl ${modalHorario ? 'rotate-180' : ''}`} />
        </div>
      </div>

      <div className='h-[123px]'></div>

      <div className="grid grid-cols-2 ">

        {horarios && horarios.length > 0 ? (
          horarios.map(horario => (
            <div
              key={horario._id}
              className="flex flex-col justify-center items-center p-2 bg-white rounded-md m-2 shadow-md box-border"
            >
              <h2 className="font-semibold text-2xl text-neutral-700">{horario.hora}</h2>
              <Separator className={`py-1`} />
              <div className="flex justify-between gap-2 pt-2">
                <Switch label="Activo" />
              </div>
            </div>
          ))
        ) : (
          <div>No hay horarios</div>
        )}

      </div>

      {modalHorario &&
        <ModalCrearHorario onClose={handleCloseModal} />
      }
    </div>
  )
}

export default Horarios