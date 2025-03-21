import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


const Prueba = () => {
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const onChange = (newDate) => {
    setDate(newDate);
    // Ocultar el calendario después de seleccionar una fecha
    setShowCalendar(false);
  };

  return (
    <div className="max-w-lg mx-auto p-8">
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Seleccionar Fecha</h2>
          <button
            className="text-blue-500 hover:text-blue-700 focus:outline-none"
            onClick={toggleCalendar}
          >
            {showCalendar ? 'Ocultar Calendario' : 'Mostrar Calendario'}
          </button>
        </div>
        <div className={`overflow-hidden transition-all duration-500 ${showCalendar ? 'h-auto' : 'h-0'}`}>
          <Calendar
            onChange={onChange}
            value={date}
            className="shadow-lg rounded-lg p-4 bg-white mt-4"
            tileClassName={({ date, view }) =>
              view === 'month' && date.getDay() === 0 ? 'text-red-500' : ''
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Prueba;