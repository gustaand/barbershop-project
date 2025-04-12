import { FaRegEdit } from "react-icons/fa"
import Separator from "./Separator"
import { MdDoneOutline } from "react-icons/md"


const CitaCard = ({ cita, actualizar, eliminar }) => {
  return (
    <div
      className="flex w-full justify-between px-5 py-2 bg-white shadow-md"
    >
      <div className="flex flex-col w-full">
        <div className="flex gap-5">
          <p>Horario: <span className="font-bold">{cita?.hora.hora}</span></p>
        </div >

        <Separator className='my-1' />

        <div>
          <p>Cliente: <span className="font-bold">{cita.nombreCliente}</span></p>
          <Separator className='my-1' />
          <p>Telefono: <span className="font-bold">{cita.telefono}</span></p>
          <Separator className='my-1' />
          <p>Servicio: <span className="font-bold">{cita.servicio}</span></p>
        </div>
      </div>

      <div className="flex flex-col justify-around items-center gap-5">
        <button
          className="text-xl"
          onClick={actualizar}
        >
          <FaRegEdit />
        </button>

        <button
          className="text-xl text-green-800"
          onClick={eliminar}
        ><MdDoneOutline /> </button>
      </div>
    </div>
  )
}

export default CitaCard