import { useState } from "react";
import Separator from "./Separator"
import Switch from "./Switch";
import useAdmin from "../hooks/useAdmin";
import clienteAxios from "../config/clienteAxios";
import ModalCrearHorario from "./ModalCrearHorario";

const Horario = ({ horario }) => {

  const [horarioActivo, setHorarioActivo] = useState(horario.activo);
  const [openModalHorario, setOpenModalHorario] = useState(false)
  const { setHorarioParaActualizar } = useAdmin();

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

  const handleOpenCloseModalHorario = () => {
    setOpenModalHorario(!openModalHorario);
  }

  return (
    <div
      className="flex flex-col justify-center items-center p-2 bg-white dark:bg-zinc-800 rounded-md m-2 shadow-md box-border"
    >
      <div
        className="font-semibold text-2xl text-neutral-700 dark:text-slate-100 w-full text-center
        active:text-blue-700 dark:active:text-indigo-400 active:scale-110 transition-all ease-linear"
        onClick={() => {
          handleOpenCloseModalHorario();
          setHorarioParaActualizar(horario);
        }}
      >
        {horario.hora}
      </div>

      <Separator className="py-1" />

      <div className="flex justify-between gap-2 pt-2">
        <Switch
          label="Activo"
          onClick={handleActivarHorario}
          check={horarioActivo ? true : false}
        />
      </div>

      {openModalHorario && (
        <ModalCrearHorario onClose={handleOpenCloseModalHorario} />
      )}
    </div>
  );

}

export default Horario