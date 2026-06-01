import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '../services/user';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Wallet, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from "motion/react"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
};

const orbAnimation = (duration: number, x: number, y: number) => ({
    x: [0, x, 0],
    y: [0, y, 0],
    transition: { duration, repeat: Infinity, ease: "easeInOut" as const }
});

export default function Login() {
    const Navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { return; }
        try {
            setIsLoading(true);
            await signIn(email, password);
            Navigate('/', { replace: true });
            toast.success("Đăng nhập thành công!");
        } catch (err) {
            console.error(err);
            toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-sky-50 p-4 relative overflow-hidden">

            <motion.div
                className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300/20 rounded-full blur-[120px]"
                animate={orbAnimation(12, 40, 30)}
            />
            <motion.div
                className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-300/15 rounded-full blur-[110px]"
                animate={orbAnimation(10, -30, 20)}
            />
            <motion.div
                className="absolute top-1/2 right-1/3 w-48 h-48 bg-purple-300/10 rounded-full blur-[90px]"
                animate={orbAnimation(14, 20, -40)}
            />

            <motion.form
                onSubmit={handleLogin}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white/40 p-8 rounded-3xl shadow-2xl relative z-10"
            >
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-5"
                >
                    <motion.div variants={itemVariants} className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-3 bg-theme/10 rounded-2xl border border-theme/20 mb-3 text-theme shadow-sm">
                            <Wallet className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Chào quay trở lại</h2>
                        <p className="text-slate-500 text-sm">Quản lý chi tiêu cá nhân thông minh</p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Mail className="w-5 h-5" />
                            </span>
                            <input
                                type="email"
                                placeholder="name@domain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none focus:border-theme focus:ring-2 focus:ring-theme/10 transition-all font-medium"
                                required
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mật khẩu</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Lock className="w-5 h-5" />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl py-3 pl-12 pr-12 text-slate-900 placeholder-slate-400 outline-none focus:border-theme focus:ring-2 focus:ring-theme/10 transition-all font-medium"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </motion.div>

                    <motion.button
                        variants={itemVariants}
                        type="submit"
                        disabled={isLoading}
                        whileTap={{ scale: 0.97 }}
                        className="w-full mt-8 bg-theme hover:opacity-95 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-theme/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span>Đăng nhập</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </motion.button>

                    <motion.p variants={itemVariants} className="text-center mt-6 text-sm text-slate-500">
                        Đã chưa có tài khoản?{" "}
                        <Link to="/Register" className="text-theme hover:opacity-80 font-semibold transition-colors">
                            Đăng ký
                        </Link>
                    </motion.p>
                </motion.div>
            </motion.form>
        </div>
    );
}