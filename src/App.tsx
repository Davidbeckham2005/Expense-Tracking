import { useEffect } from 'react'
import AuthProvider from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import AppRouter from './Routes';
export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') || 'default';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const savedMode = localStorage.getItem('theme-mode');
    if (savedMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  return (
    <AuthProvider>
      <Toaster position='bottom-right'></Toaster>
      <AppRouter></AppRouter>
    </AuthProvider>
  );
}
