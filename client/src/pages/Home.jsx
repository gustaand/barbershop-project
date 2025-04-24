import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import AdminDias from "../components/AdminDias";
import AdminSemana from "../components/AdminSemana";
import useAdmin from "../hooks/useAdmin";
import createDaysOfWeek from '../helpers/createDaysOfWeek';
import { formatInTimeZone } from 'date-fns-tz';

// !!!!!!! ------ PROBAR SOLUCIÓN MAÑANA A LAS 00:00 --------- !!!!!!!
//* !!!!!! ------ PROBAR SOLUCIÓN MAÑANA A LAS 00:00 --------- !!!!!!!
// !!!!!!! ------ PROBAR SOLUCIÓN MAÑANA A LAS 00:00 --------- !!!!!!!
// TODO: USAR formatInTimeZone de 'date-fns-tz' en todas las formataciones de data del frontend!

const Home = () => {

  const [semana, setSemana] = useState(false)
  const [todaSemana, setTodaSemana] = useState([])
  const [diaSemana, setDiaSemana] = useState(formatInTimeZone(new Date(), 'Europe/Madrid', 'yyyy-MM-dd HH:mm:ss zzz').split(' ')[0])
  const { proximaCita } = useAdmin()

  useEffect(() => {
    const daysOfWeek = () => {
      const diaActual = new Date()
      const listaDiasSemana = createDaysOfWeek(diaActual)
      setTodaSemana(listaDiasSemana)
    }
    daysOfWeek()
  }, [])

  // Función para manejar el clic en un día
  const handleClick = (date) => {
    const fecha = new Date(date)
    // Manejar horario local con formatInTimeZone de 'date-fns-tz'
    const fechaFormateada = formatInTimeZone(fecha, 'Europe/Madrid', 'yyyy-MM-dd HH:mm:ss zzz').split(' ')[0]
    setDiaSemana(fechaFormateada)
  };

  return (
    <div className='flex flex-col justify-center items-center dark:bg-zinc-900'>

      <div className="fixed top-0 right-0 w-full bg-slate-100 dark:bg-zinc-800 z-40 shadow-md">
        <div className="flex flex-col justify-center items-center">
          <Sidebar />

          {semana ? (
            <div className='pt-3 pb-6 w-full text-center border-b border-slate-300 dark:border-zinc-600 text-xl font-normal dark:text-white'>
              Fecha: <span className='font-semibold'> {diaSemana.split("-").reverse().join("-")}</span>
            </div>
          ) : (
            <div className="w-full">
              {proximaCita ? (
                <div className='pt-3 pb-6 w-full text-center border-b border-slate-300 dark:border-zinc-600 text-xl font-normal dark:text-white'>
                  Proxima Cita: <span className='font-semibold'>Hoy - {proximaCita?.hora?.hora}</span>
                </div>
              ) : (
                <h2 className='pt-3 pb-6 w-full text-center border-b border-slate-300 dark:border-zinc-600 text-xl text-slate-300 dark:text-zinc-500'>
                  No hay más citas hoy
                </h2>
              )}
            </div>
          )}

          <div className='flex items-center w-full justify-around border-b border-slate-300 dark:border-zinc-600'>

            <button
              type='button'
              className='w-1/2 px-2 py-3 text-lg font-semibold active:bg-slate-200 dark:active:bg-zinc-700 transition-colors dark:text-white'
              onClick={() => setSemana(false)}
            >Hoy</button>

            <div className='border-l h-12 border-slate-300 dark:border-zinc-600'></div>

            <button
              type='button'
              className='w-1/2 px-2 py-3 text-lg font-semibold active:bg-slate-200 dark:active:bg-zinc-700 transition-colors dark:text-white'
              onClick={() => setSemana(true)}
            >Semana</button>
          </div>

          {/* BOTONES SEMANA */}
          {semana &&
            <div className="w-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-around border-b border-slate-300 dark:border-zinc-600">
              {todaSemana.map((dia, index) => {
                const diaFormateado = formatInTimeZone(dia, 'Europe/Madrid', 'yyyy-MM-dd');
                return (
                  <button
                    key={index}
                    className={`w-full py-3 transition-colors ${diaSemana === diaFormateado
                      ? 'bg-blue-500 dark:bg-indigo-800 text-white'
                      : 'dark:text-white hover:bg-slate-200 dark:hover:bg-zinc-700'
                      }`}
                    onClick={() => handleClick(dia)}
                  >
                    {dia.toLocaleDateString('es-ES', { weekday: 'long' }) === 'miércoles' ? 'X' :
                      dia.toLocaleDateString('es-ES', { weekday: 'long' }).charAt(0).toUpperCase()}
                  </button>
                );
              })}
            </div>
          }
        </div>
      </div>

      <div className='w-full'>
        {!semana ? (
          <div>
            <div className="h-[173.6px]"></div>
            <AdminDias />
          </div>
        ) : (
          <div>
            <div className="h-[222.4px]"></div>
            <AdminSemana
              fecha={diaSemana}
            />
          </div>
        )}
      </div>

      <div className="h-[82.8px]"></div>

    </div>
  )
}

export default Home

//TODO: Hacer un reloj para comparar la hora local con los horarios del dia para definir la proxima cita:
