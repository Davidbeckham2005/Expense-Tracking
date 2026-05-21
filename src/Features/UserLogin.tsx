import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../services/user';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Wallet } from 'lucide-react';
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
            const res = await signIn(email, password);
            console.log(res);
            Navigate('/', { replace: true });
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 relative overflow-hidden">

            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px]" />

            <form
                onSubmit={handleLogin}
                className="w-full max-w-md backdrop-blur-xl border border-blue-500/50 p-8 rounded-3xl shadow-2xl relative z-10"
            >
                {/* Logo & Tiêu đề */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-3 text-blue-400 shadow-inner">
                        <Wallet className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-white mb-2">Chào Quay Trở Lại</h2>
                    <p className="text-slate-400 text-sm">Quản lý chi tiêu cá nhân thông minh</p>
                </div>

                <div className="space-y-5">
                    {/* Ô nhập Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                <Mail className="w-5 h-5" />
                            </span>
                            <input
                                type="email"
                                placeholder="name@domain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    {/* Ô nhập Mật khẩu */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Mật Khẩu</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                <Lock className="w-5 h-5" />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
                                required
                            />
                            {/* Nút bấm ẩn hiện mật khẩu nhanh */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
                {/* Nút Submit Đăng Nhập */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                >
                    <span>{isLoading ? "Đang xử lý..." : "Đăng nhập"}</span>
                    {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>
            </form>
        </div>

    );

}
