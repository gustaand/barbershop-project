import { useState, useEffect } from 'react';
import ReactCalendar from 'react-calendar';
import './Calendario/Calendar.css';
import { FaRegCalendar } from "react-icons/fa";
import { GrClose } from "react-icons/gr";
import { formatInTimeZone } from 'date-fns-tz';
import useAdmin from '../hooks/useAdmin';

const ModalCrearCita = ({ onClose }) => {
  const { crearCita, horarios, obtenerHorarios } = useAdmin(); // <-- Ahora obtenemos `obtenerHorarios`

  const fechaHoy = formatInTimeZone(new Date(), 'Europe/Madrid', 'yyyy-MM-dd');
  const [showCalendario, setShowCalendario] = useState(false);
  const [fecha, setFecha] = useState(fechaHoy);
  const [horaObject, setHoraObject] = useState({});
  const [horaID, setHoraID] = useState('');
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [nombreCliente, setNombreCliente] = useState('');
  const [telefono, setTelefono] = useState('');

  // Filtrar horarios disponibles
  useEffect(() => {
    if (!Array.isArray(horarios)) return;

    const horariosFiltrados = horarios.filter(horario => !horario.fecha.includes(fecha));

    setHorariosDisponibles(horariosFiltrados);

    // **Seleccionar automáticamente el primer horario disponible**
    if (horariosFiltrados.length > 0) {
      setHoraObject(horariosFiltrados[0]);
      setHoraID(horariosFiltrados[0]._id);
    } else {
      setHoraObject({});
      setHoraID('');
    }
  }, [fecha, horarios]); // <-- Escucha cambios en `horarios`

  // Seleccionar fecha del calendario
  const handleDateCalendar = (date) => {
    const fechaFormateada = formatInTimeZone(new Date(date), 'Europe/Madrid', 'yyyy-MM-dd');
    setFecha(fechaFormateada);
    setShowCalendario(false);
  };

  // Crear la cita
  const handleCrearCita = async () => {

    if (!horaObject || !horaID) {
      console.error('Error: No hay una hora seleccionada.');
      return;
    }
    console.log(horaObject)
    try {
      const datosCita = {
        fecha,
        hora: horaObject,
        nombreCliente,
        telefono
      };

      await crearCita(datosCita, horaID);

      // **Actualizar la lista de horarios en la API y estado global**
      await obtenerHorarios(); // Obtiene la lista actualizada desde el backend

      // **Filtrar y actualizar la lista local**
      setHorariosDisponibles(prev => prev.filter(horario => horario._id !== horaID));

      // **Seleccionar automáticamente el nuevo primer horario disponible**
      if (horariosDisponibles.length > 1) {
        setHoraObject(horariosDisponibles[1]); // Guardar el objeto completo
        setHoraID(horariosDisponibles[1]._id);
      } else {
        setHoraObject(null);
        setHoraID('');
      }

      // **Limpiar otros campos**
      setNombreCliente('');
      setTelefono('');

      onClose();
    } catch (error) {
      console.error('Error al crear la cita:', error);
    }
  };


  return (
    <div className='fixed flex justify-center items-center inset-0 z-40'>
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

      <form className='flex flex-col gap-2 items-center w-4/5 bg-slate-100 pt-5 rounded-md shadow-md z-10 px-2'>
        <h2 className="text-xl text-center mb-3 border-b border-slate-300 w-full pb-2">Crear cita</h2>

        {/* Selección de Fecha */}
        <label className="flex w-full justify-between items-center gap-3 px-2" onClick={() => setShowCalendario(true)}>
          <p className="text-xl">Fecha:</p>
          <div className="flex items-center justify-between rounded bg-white w-7/12 p-2">
            <p className="w-5/6 text-center">{fecha.split("-").reverse().join("-")}</p>
            <FaRegCalendar className="cursor-pointer w-1/6" />
          </div>
        </label>

        {/* Selección de Hora */}
        <label className="flex w-full justify-between items-center gap-3 px-2">

          <p className="text-xl">Hora:</p>

          <select
            value={horaObject?.hora || ''}
            className='rounded bg-white w-7/12 p-2'
            onChange={(e) => {
              const selectedHora = e.target.value;
              const selectedHorario = horariosDisponibles.find(horario => horario.hora === selectedHora);
              setHoraObject(selectedHorario || {}); // Asegura que no sea `undefined`
              setHoraID(selectedHorario?._id || '');
            }}
          >
            {horariosDisponibles.length ? (
              horariosDisponibles.map(horario => (
                <option key={horario._id} value={horario.hora}>
                  {horario.hora}
                </option>
              ))
            ) : (
              <option disabled>---</option>
            )}
          </select>

        </label>

        {/* Nombre del Cliente */}
        <label className="flex w-full justify-between items-center gap-3 px-2">
          <p className="text-xl">Cliente:</p>
          <input className="p-2 rounded w-7/12 text-center" type="text" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} />
        </label>

        {/* Teléfono del Cliente */}
        <label className="flex w-full justify-between items-center gap-3 px-2">
          <p className="text-xl">Teléfono:</p>
          <input className="p-2 rounded w-7/12 text-center" type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        </label>

        {/* Botones de Acción */}
        <div className='flex justify-between items-center w-full border-t border-slate-300 mt-3'>
          <button type="button" className='p-4 w-1/2 text-black active:bg-gray-200' onClick={handleCrearCita}>Crear Cita</button>
          <div className='border-l h-9 border-slate-300'></div>
          <button type="button" className='p-4 w-1/2 text-black active:bg-gray-200' onClick={onClose}>Cancelar</button>
        </div>
      </form>

      {/* Calendario */}
      {showCalendario && (
        <div className='fixed flex-col justify-center flex w-full h-full rounded-md shadow-md z-10'>
          <div className="absolute inset-0" onClick={() => setShowCalendario(false)}></div>

          <div className='bg-white z-10'>
            <div className='flex w-full justify-end px-2 py-4'>
              <button className='active:scale-125 transition-transform px-4' onClick={() => setShowCalendario(false)}>
                <GrClose />
              </button>
            </div>

            <ReactCalendar minDate={new Date()} className='border-none px-2 pb-5' view='month' onClickDay={handleDateCalendar} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalCrearCita;
