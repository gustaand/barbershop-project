import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { AdminProvider } from './context/AdminProvider'
import LoginAdmin from './pages/LoginAdmin'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import Citas from './pages/Citas'
import Horarios from './pages/Horarios'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <Routes>
            {/* AREA PUBLICA */}
            <Route path="/" element={<PublicLayout />} >     {/* PublicLayout */}
              <Route index element={<></>} />     {/* LandingPage */}
              <Route path='reservar' element={<></>} />     {/* ReservationPage */}
            </Route>

            {/* AREA PRIVADA */}
            <Route path='login-admin' element={<LoginAdmin />} />    {/* LoginAdmin */}
            <Route path='/admin' element={<AdminLayout />} >      {/* AdminLayout */}
              <Route index element={<Home />} />     {/* Home */}
              <Route path='citas' element={<Citas />} />       {/* Citas */}
              <Route path='citas/:id' element={<></>} />       {/* Cita */}
              <Route path='horarios' element={<Horarios />} />     {/* Horarios */}
              <Route path='horarios/:id' element={<></>} />     {/* Horario */}
            </Route>
          </Routes>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
