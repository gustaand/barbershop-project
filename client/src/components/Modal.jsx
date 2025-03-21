
//TODO: !!!USAR ESTE COMPONENTE EN EL PROYECTO DE COMPONENTES!!!

const Modal = ({ title, p, btConfirmValue, onClick, onClose }) => {

  return (
    <div
      className='fixed flex justify-center items-center inset-0'
    >
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className='flex flex-col box-border gap-2 justify-center items-center w-2/3 bg-slate-100 pt-5 rounded-md shadow-md z-10'>
        <h3 className='text-xl font-semibold'>{title}</h3>
        <p className='text-slate-800'>{p}</p>

        <div className='flex justify-between items-center w-full border-t border-slate-300 mt-3'>
          <button
            className='p-3 w-1/2 text-black rounded-b-md active:bg-gray-200 transition-all'
            onClick={onClick}
          >{btConfirmValue}</button>

          <div className='border-l h-9 border-slate-300'></div>

          <button
            className='p-3 w-1/2 text-black rounded-b-md active:bg-gray-200 transition-all'
            onClick={onClose}
          >Cancelar</button>
        </div>

      </div>
    </div>
  )
}

export default Modal