import DashBroad from './Features/Dashbroad';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRouter from './Router/ProtectedRouter';
import Login from './Features/UserLogin';
import AuthProvider from './context/AuthContext';
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />

          <Route element={<ProtectedRouter />}>
            <Route path='/' element={<DashBroad />} />
          </Route>

          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

