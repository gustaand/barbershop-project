import { IoHomeOutline } from "react-icons/io5";
import { LuCalendarCheck2 } from "react-icons/lu";
import { GoClock } from "react-icons/go";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  return (
    <nav className='fixed bottom-0 left-0 w-full bg-slate-100 dark:bg-zinc-900 shadow-md shadow-black'>
      <div className='flex justify-between border-t border-gray-300 dark:border-zinc-700 px-5 py-2 w-full select-none'>

        <Link
          to='/admin'
          className="flex flex-col items-center text-center p-2 active:text-blue-700 active:scale-110 transition-all ease-linear"
        >
          <IoHomeOutline className="text-3xl scale-105 text-slate-700 dark:text-white" />
          <h3 className="text-sm font-medium text-slate-700 dark:text-white">Inicio</h3>
        </Link>

        <Link
          to='/admin/citas'
          className="flex flex-col items-center text-center p-2 active:text-blue-700 active:scale-110 transition-all ease-linear"
        >
          <LuCalendarCheck2 className="text-3xl scale-105 text-slate-700 dark:text-white" />
          <h3 className="text-sm font-medium text-slate-700 dark:text-white">Citas</h3>
        </Link>

        <Link
          to='/admin/horarios'
          className="flex flex-col items-center text-center p-2 active:text-blue-700 active:scale-110 transition-all ease-linear"
        >
          <GoClock className="text-3xl scale-105 text-slate-700 dark:text-white" />
          <h3 className="text-sm font-medium text-slate-700 dark:text-white">Horario</h3>
        </Link>
      </div>
    </nav>
  );

}

export default AdminNavbar