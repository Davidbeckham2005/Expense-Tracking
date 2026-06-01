import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldCheck } from 'lucide-react';
import { motion } from "motion/react"
import { Card } from "@/components/ui/card"

export default function ProtectedRouter() {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden"
            >
                <div className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 bg-primary/10 rounded-full blur-[80px]" />
                <Card className="flex flex-col items-center px-10 py-8 shadow-2xl z-10 max-w-xs w-full text-center">
                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="p-3 bg-primary/10 border border-primary/20 text-primary rounded-2xl mb-4"
                    >
                        <ShieldCheck className="w-8 h-8" />
                    </motion.div>
                    <Loader2 className="w-7 h-7 text-primary animate-spin mb-3" />
                    <p className="text-xs text-muted-foreground mt-1">Vui lòng đợi trong giây lát...</p>
                </Card>
            </motion.div>);
    }
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
