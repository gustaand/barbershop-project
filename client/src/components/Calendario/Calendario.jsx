import React, { useState } from 'react';
import ReactCalendar from 'react-calendar';
import { useSwipeable } from 'react-swipeable';
import './Calendar.css';
import useTheme from '../../hooks/useTheme';

const Calendario = ({ className, onChange }) => {
  const [value, setValue] = useState(new Date());

  const { theme } = useTheme()

  const handleDateChange = (date) => {
    setValue(date);
    onChange && onChange(date);
  };

  // Cambiar al mes siguiente
  const nextMonth = () => {
    const next = new Date(value);
    next.setMonth(next.getMonth() + 1);
    setValue(next);
  };

  // Cambiar al mes anterior
  const prevMonth = () => {
    const prev = new Date(value);
    prev.setMonth(prev.getMonth() - 1);
    setValue(prev);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextMonth,
    onSwipedRight: prevMonth,
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: false
  });

  return (
    <div {...swipeHandlers}>
      <ReactCalendar
        minDate={new Date()}
        value={value}
        onChange={handleDateChange}
        className={`${theme === 'dark' ? 'dark' : ''} px-2 rounded-none transition-all overflow-hidden ${className}`}
        view='month'
      />
    </div>
  );
};

export default Calendario;
