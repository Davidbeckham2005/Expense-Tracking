import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function ProtectedRouter() {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 bg-blue-500/10 rounded-full blur-[80px]" />
                <div className="flex flex-col items-center backdrop-blur-md border  px-10 py-8 rounded-3xl shadow-2xl z-10 max-w-xs w-full text-center">
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl mb-4 animate-pulse">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <Loader2 className="w-7 h-7 text-blue-500 animate-spin mb-3" />
                    <p className="text-xs text-slate-500 mt-1">Vui lòng đợi trong giây lát...</p>
                </div>
            </div>);
    }
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}