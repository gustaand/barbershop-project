import ReactCalendar from 'react-calendar'
import './Calendar.css'

const Calendario = ({ className, onChange }) => {

  return (
    <div >
      <ReactCalendar
        //todo: Criar um prop para passar a "minDate" para definir a data minima seleccionavel dependendo de cada caso. Em "citas" a data minima é 30 dias anteriores. 
        minDate={new Date()}
        className={`REACT-CALENDAR px-2 rounded-none transition-all overflow-hidden ${className} `}
        view='month'
        // onClickDay={(date) => console.log(date)}
        onChange={onChange}
      />
    </div >
  )
}

export default Calendario


// Hacer un REACT-CALENDAR-DARK para adicionar cuando se cambie a modo oscuro