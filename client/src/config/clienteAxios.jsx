import axios from 'axios'

const clienteAxios = axios.create({
  // baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  // baseURL: `http://192.168.1.143:4000/api`,
  baseURL: `https://barbershop-backend-jgst.onrender.com/api`,
  withCredentials: true,  // <--- Permite enviar las cookies directamente en la solicitud.
})

export default clienteAxios