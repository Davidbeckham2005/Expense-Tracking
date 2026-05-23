import AuthProvider from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import AppRouter from './Routes';
export default function App() {
  return (
    <AuthProvider>
      <Toaster position='bottom-right'></Toaster>
      <AppRouter></AppRouter>
    </AuthProvider>
  );
}

