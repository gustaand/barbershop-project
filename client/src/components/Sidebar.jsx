import { useState } from 'react'
import { GoGear } from "react-icons/go";
import { GrClose } from "react-icons/gr";
import { BsBoxArrowLeft } from "react-icons/bs";
import useAuth from '../hooks/useAuth';
import Cookies from 'js-cookie';
import useTheme from '../hooks/useTheme';
import Modal from './Modal';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const { logout } = useAuth()
  const { toggleTheme, theme } = useTheme()

  const handleLogout = () => {
    setShowModal(false)
    logout()
    Cookies.remove('token')
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <div>
      {/* Botón de engranaje */}
      <div className='mt-4 p-2 text-2xl active:animate-spin text-zinc-700 dark:text-zinc-100'>
        <GoGear onClick={() => setIsOpen(!isOpen)} />
      </div>

      {/* Overlay */}
      <div onClick={() => setIsOpen(!isOpen)} className={`fixed bg-black/70 min-h-screen w-full inset-0 ${!isOpen && 'hidden'}`}></div>

      {/* Sidebar */}
      <div className={`fixed z-50 min-h-screen sm:max-w-sm w-7/12 pt-3 border-l border-zinc-600 border-opacity-60 inset-y-0 right-0 
        bg-slate-100 dark:bg-zinc-900 transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Botón cerrar */}
        <div className='flex w-full justify-end'>
          <button
            className='active:scale-125 transition-transform opacity-70 hover:opacity-100 p-3 text-zinc-700 dark:text-zinc-100'
            onClick={() => setIsOpen(!isOpen)}
          >
            <GrClose className='font-bold' />
          </button>
        </div>

        {/* Toggle tema */}
        <div
          onClick={toggleTheme}
          className="flex justify-between items-center w-full px-3 py-3 text-xl border-y border-slate-300 dark:border-zinc-700 active:bg-slate-200 dark:active:bg-zinc-700 transition-colors mt-2"
        >
          <span className="text-base text-zinc-800 dark:text-zinc-100">
            {theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}
          </span>
          <button
            className={`flex items-center w-14 h-7 rounded-full outline-none shadow transition-all ease-in-out 
              ${theme === 'light' ? 'bg-indigo-700' : 'bg-gray-300 dark:bg-zinc-700'}`}
          >
            <span className={`inline-block rounded-full transition-all ease-in-out shadow bg-white dark:bg-zinc-300 w-5 h-5 
              ${theme === 'dark' ? 'ml-8' : 'ml-1'}`} />
          </button>
        </div>

        {/* Botón salir */}
        <div className="fixed w-full bottom-0">
          <button
            className="flex items-center w-full px-2 py-3 text-xl border-y border-slate-300 dark:border-zinc-700 active:bg-slate-200 dark:active:bg-zinc-700 transition-colors text-zinc-800 dark:text-zinc-100 bg-slate-100 dark:bg-zinc-900"
            onClick={() => {
              setIsOpen(!isOpen)
              setShowModal(true)
            }}
          >
            <BsBoxArrowLeft className="mx-3" /> <span>Salir</span>
          </button>
        </div>
      </div>

      {/* Modal de salida */}
      {showModal &&
        <Modal
          title='Atención!'
          p='¿Seguro que quieres salir?'
          btConfirmValue='Salir'
          onClick={handleLogout}
          onClose={handleCloseModal}
        />
      }
    </div>
  )

}

export default Sidebar