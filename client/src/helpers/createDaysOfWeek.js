// VERSIÓN CON EL DOMINGO EN EL CALENDÁRIO

const createDaysOfWeek = (day) => {
  const inputDate = new Date(day);
  inputDate.setHours(0, 0, 0, 0); // Limpiar horas

  const dayOfWeek = inputDate.getDay(); // 0 = domingo, ..., 6 = sábado

  const sunday = new Date(inputDate);
  sunday.setDate(inputDate.getDate() - dayOfWeek); // Retroceder al domingo anterior o igual

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });

  return daysOfWeek;
};

export default createDaysOfWeek;





// VERSIÓN SIN EL DOMINGO EN EL CALENDARIO

/*
const createDaysOfWeek = (day) => {
  // Obtener la fecha actual
  const newDate = new Date()
  newDate.setDate(5)
  const diaActual = newDate;

  // Obtener el día de la semana actual (0 para Domingo, 1 para Lunes, ..., 6 para Sábado)
  const diaActualDeLaSemana = diaActual.getDay();

  // Calcular la fecha del primer día de la semana (Lunes)
  const primerDiaDeLaSemana = new Date(diaActual);
  primerDiaDeLaSemana.setDate(diaActual.getDate() - diaActualDeLaSemana + 1);

  // Generar los días de la semana con sus fechas
  const daysOfWeek = [...Array(6)].map((_, index) => {
    const date = new Date(primerDiaDeLaSemana);
    date.setDate(primerDiaDeLaSemana.getDate() + index);
    return date;
  });
  return daysOfWeek;
};

export default createDaysOfWeek;
*/