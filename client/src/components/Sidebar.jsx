import { useState } from 'react'
import { GoGear } from "react-icons/go";
import { GrClose } from "react-icons/gr";
import { BsBoxArrowLeft } from "react-icons/bs";
import useAuth from '../hooks/useAuth';
import Cookies from 'js-cookie';
import useAdmin from '../hooks/useAdmin';
import Modal from './Modal';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const { logout } = useAuth()

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

      <div className='mt-4 p-2 text-2xl active:animate-spin'>
        <GoGear onClick={() => setIsOpen(!isOpen)} />
      </div>

      <div onClick={() => setIsOpen(!isOpen)} className={`fixed bg-black/70 min-h-screen w-full inset-0 ${!isOpen && 'hidden'}`}></div>

      <div className={`fixed z-50 min-h-screen sm:max-w-sm w-7/12 pt-6 border-l border-zinc-600 border-opacity-60 inset-y-0 right-0 
      bg-slate-100 transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        <div className='flex w-full justify-end'>
          <button
            className='active:scale-125 transition-transform opacity-70 hover:opacity-100 px-4'
            onClick={() => setIsOpen(!isOpen)}
          >
            <GrClose className='font-bold' />
          </button>
        </div>

        {/* SIDEBAR CONTENT */}
        <div className="fixed w-full bottom-0">
          <button
            className="flex items-center w-full px-2 py-3 text-xl border-y border-slate-300 active:bg-slate-300 transition-colors"
            onClick={() => {
              setIsOpen(!isOpen)
              setShowModal(true)
            }}
          >
            <BsBoxArrowLeft className="mx-3" /> <span className="">Salir</span>
          </button>
        </div>
      </div>

      {/* LOGOUT MODAL */}

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