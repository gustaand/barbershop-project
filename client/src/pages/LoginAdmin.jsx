import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { GoEye, GoEyeClosed } from 'react-icons/go'
import useAuth from "../hooks/useAuth";
import clienteAxios from "../config/clienteAxios";
import Cookies from "js-cookie";

const LoginAdmin = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verPassword, setVerPassword] = useState(false)

  const { setAuth } = useAuth()

  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const { data } = await clienteAxios.post('/admin/login', { email, password })
      Cookies.set('token', data.token, { expires: 30 })
      setAuth(data)
      navigate('/admin')
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-white dark:bg-zinc-900 transition-colors'>

      <h1 className="text-neutral-800 dark:text-white font-black text-4xl md:text-6xl capitalize">
        inicia sesión
      </h1>

      <div>
        <form
          className="flex flex-col justify-center items-center p-4 min-w-[300px] md:min-w-[400px]"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Administrador"
            className="w-full border border-slate-700 dark:border-zinc-600 outline-none p-2 rounded-lg placeholder:text-slate-400 dark:placeholder:text-slate-400 bg-white dark:bg-zinc-800 text-black dark:text-white mb-2 transition-colors"
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex justify-between items-center w-full border border-slate-700 dark:border-zinc-600 outline-none p-2 rounded-lg bg-white dark:bg-zinc-800 placeholder:text-slate-400 my-2 transition-colors">
            <input
              type={verPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              className="outline-none w-full bg-transparent text-black dark:text-white"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setVerPassword(!verPassword)}
              className="text-xl text-gray-500 dark:text-gray-400"
            >
              {verPassword ? <GoEyeClosed /> : <GoEye />}
            </button>
          </div>

          <input
            type="submit"
            value="Iniciar Sesión"
            className="bg-neutral-700 dark:bg-indigo-600 w-full py-3 mb-5 text-white uppercase font-bold rounded-lg hover:cursor-pointer my-4
            hover:bg-neutral-800 dark:hover:bg-indigo-700 transition-colors"
          />
        </form>
      </div>
    </div>
  )

}

export default LoginAdmin