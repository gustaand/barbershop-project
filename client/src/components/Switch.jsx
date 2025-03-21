import { useState } from 'react';

//  Accept the onClick prop
const BasicSwitch = ({ label, onClick, className }) => {
  const [isChecked, setIsChecked] = useState(false);

  const toggleSwitch = () => {
    setIsChecked(!isChecked);
  };

  return (
    <label
      className={`flex items-center space-x-2 ${className}`}
      onClick={onClick}
    >
      <span className='font-medium leading-none'>{label}</span>
      <button
        className={`flex items-center w-14 h-7 rounded-full outline-none shadow
      transition-all ease-in-out ${isChecked ? 'bg-indigo-700' : 'bg-gray-300'}`}
        onClick={toggleSwitch}
      >
        <span className={`inline-block rounded-full transition-all ease-in-out shadow
      bg-white w-5 h-5 ${isChecked ? 'ml-8' : 'ml-1'}`} />
      </button>
    </label>
  );
};

export default BasicSwitch;