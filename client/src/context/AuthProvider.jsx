import { createContext, useEffect, useState } from "react"
import Cookies from 'js-cookie'
import clienteAxios from "../config/clienteAxios"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState({})
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = Cookies.get('token');

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const { data } = await clienteAxios('/admin/admin-perfil')
        setAuth(data)
      } catch (error) {
        setAuth({})
      }
      setLoading(false)
    }
    autenticarUsuario()
  }, [])

  // LOGOUT
  const logout = async () => {
    await clienteAxios.post('/admin/logout')
    setAuth({})
    navigate('/login-admin')
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        loading,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext