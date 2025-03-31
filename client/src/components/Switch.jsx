
//  Accept the onClick prop
const BasicSwitch = ({ label, onClick, className, check }) => {

  return (
    <label className={`flex items-center space-x-2 ${className}`}>
      <span className='font-medium leading-none'>{label}</span>
      <button
        className={`flex items-center w-14 h-7 rounded-full outline-none shadow
      transition-all ease-in-out ${check ? 'bg-indigo-700' : 'bg-gray-300'}`}
        onClick={onClick} // No usamos un estado interno, solo llamamos onClick
      >
        <span className={`inline-block rounded-full transition-all ease-in-out shadow
      bg-white w-5 h-5 ${check ? 'ml-8' : 'ml-1'}`} />
      </button>
    </label>
  );
};

export default BasicSwitch;