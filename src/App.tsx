import DashBroad from './Features/Dashbroad';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRouter from './Router/ProtectedRouter';
import Login from './Features/UserLogin';
import AuthProvider from './context/AuthContext';
import Register from './Features/UserRegister';
import { Toaster } from 'react-hot-toast'
export default function App() {
  return (
    <AuthProvider>
      <Toaster position='top-right'></Toaster>

      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          <Route element={<ProtectedRouter />}>
            <Route path='/' element={<DashBroad />} />
          </Route>

          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

