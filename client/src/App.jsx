import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { AdminProvider } from './context/AdminProvider';
import { ThemeProvider } from './context/ThemeProvider';
import LoginAdmin from './pages/LoginAdmin';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Citas from './pages/Citas';
import Horarios from './pages/Horarios';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <ThemeProvider>
            <Routes>
              {/* Redirige la raíz '/' a '/login-admin' */}
              <Route path='/' element={<Navigate to="/login-admin" replace />} />

              <Route path='/login-admin' element={<LoginAdmin />} />

              <Route path='/admin' element={<AdminLayout />}>
                <Route index element={<Home />} />
                <Route path='citas' element={<Citas />} />
                <Route path='citas/:id' element={<></>} />
                <Route path='horarios' element={<Horarios />} />
                <Route path='horarios/:id' element={<></>} />
              </Route>
            </Routes>
          </ThemeProvider>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
