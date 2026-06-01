import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldCheck } from 'lucide-react';
import { motion } from "motion/react"

export default function ProtectedRouter() {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden"
            >
                <div className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 bg-blue-500/10 rounded-full blur-[80px]" />
                <div className="flex flex-col items-center backdrop-blur-xl border border-white/30 bg-white/15 px-10 py-8 rounded-3xl shadow-2xl z-10 max-w-xs w-full text-center">
                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="p-3 bg-theme/10 border border-theme/20 text-theme rounded-2xl mb-4"
                    >
                        <ShieldCheck className="w-8 h-8" />
                    </motion.div>
                    <Loader2 className="w-7 h-7 text-theme animate-spin mb-3" />
                    <p className="text-xs text-slate-500 mt-1">Vui lòng đợi trong giây lát...</p>
                </div>
            </motion.div>);
    }
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}