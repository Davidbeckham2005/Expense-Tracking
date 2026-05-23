import AuthProvider from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import AppRouter from './Routes';
export default function App() {
  return (
    <AuthProvider>
      <Toaster position='top-right'></Toaster>
      <AppRouter></AppRouter>
    </AuthProvider>
  );
}

