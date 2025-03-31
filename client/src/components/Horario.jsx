import { useState } from "react";
import Separator from "./Separator"
import Switch from "./Switch";
import useAdmin from "../hooks/useAdmin";
import clienteAxios from "../config/clienteAxios";

const Horario = ({ horario }) => {

  const [horarioActivo, setHorarioActivo] = useState(horario.activo)

  //! TERMINAR DESPUÉS
  const handleActivarHorario = async () => {
    try {
      const nuevoEstado = !horarioActivo;

      await clienteAxios.put(`/horarios/${horario._id}`, { activo: nuevoEstado });

      setHorarioActivo(nuevoEstado);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div
      className="flex flex-col justify-center items-center p-2 bg-white rounded-md m-2 shadow-md box-border"
    >
      <div
        className="font-semibold text-2xl text-neutral-700 w-full text-center
        active:text-blue-700 active:scale-110 transition-all ease-linear"
        onClick={() => setHorarioID(horario._id)}
      >{horario.hora}</div>

      <Separator className={`py-1`} />

      <div className="flex justify-between gap-2 pt-2">
        <Switch
          label="Activo"
          onClick={handleActivarHorario}
          check={horarioActivo ? true : false}
        />
      </div>
    </div>
  )
}

export default Horario