import { useState } from "react";
// Giả định bạn đang dùng lucide-react cho các icon
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from '../services/user'
import { registerSchema } from '../Schemas/auth.schema';
import type { RegisterInput } from '../Schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
export default function Register(): React.JSX.Element {
    const Navigate = useNavigate();
    // const [name, setName] = useState<string>("");
    // const [email, setEmail] = useState<string>("");
    // const [password, setPassword] = useState<string>("");
    // const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema), mode: "onChange"
    });
    // Định nghĩa kiểu FormEvent cho hàm submit để tránh lỗi 'any' trong TS
    const handleRegister = async (data: RegisterInput) => {
        try {
            setIsLoading(true);
            const res = await signUp(data.email, data.password, data.name);
            console.log(res);
            Navigate('/', { replace: true });
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-amber-50 p-4 relative overflow-hidden">

            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300/25 rounded-full blur-[110px]" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-300/20 rounded-full blur-[110px]" />
            <form
                onSubmit={handleSubmit(handleRegister)}
                className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-slate-200 p-8 rounded-3xl shadow-2xl relative z-10"
            >
                {/* Logo & Tiêu đề */}
                <div className="text-center mb-6">
                    {/* <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 mb-3 text-emerald-400 shadow-inner">
                        <Wallet className="w-8 h-8" />
                    </div> */}
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Đăng ký</h2>
                    <p className="text-slate-500 text-sm">Bắt đầu hành trình tích lũy thông minh</p>
                </div>

                <div className="space-y-5">
                    {/* Ô nhập Họ và Tên */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Họ và tên</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <User className="w-5 h-5" />
                            </span>
                            <input
                                type="text"
                                placeholder="Nguyễn Văn A"
                                {...register("name")}
                                className={`w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none focus:border-theme focus:ring-2 focus:ring-theme/10 transition-all font-medium 
                                    ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""}`}
                                required
                            />
                        </div>
                        {errors.name && <p className="text-red-500 text-xs pl-1">{errors.name.message}</p>}
                    </div>

                    {/* Ô nhập Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Mail className="w-5 h-5" />
                            </span>
                            <input
                                type="email"
                                placeholder="name@domain.com"
                                {...register("email")}
                                className={`w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none focus:border-theme focus:ring-2 focus:ring-theme/10 transition-all font-medium 
                                    ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""}`}
                                required
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs pl-1">{errors.email.message}</p>}

                    </div>

                    {/* Ô nhập Mật khẩu */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mật khẩu</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Lock className="w-5 h-5" />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("password")}
                                className={`w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none focus:border-theme focus:ring-2 focus:ring-theme/10 transition-all font-medium 
                                    ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""}`}
                                required
                            />
                            {/* Nút bấm ẩn hiện mật khẩu nhanh */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs pl-1">{errors.password.message}</p>}

                    </div>

                    {/* Ô Xác nhận Mật khẩu */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Xác nhận mật khẩu</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Lock className="w-5 h-5" />
                            </span>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("confirmPassword")}
                                className={`w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none focus:border-theme focus:ring-2 focus:ring-theme/10 transition-all font-medium 
                                    ${errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""}`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-xs pl-1">{errors.confirmPassword.message}</p>}

                    </div>
                </div>

                {/* Nút Submit Đăng Ký */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-8 bg-theme hover:opacity-95 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-theme/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                >
                    <span>{isLoading ? "Đang xử lý..." : "Đăng ký ngay"}</span>
                    {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>

                {/* Điều hướng quay lại Đăng nhập */}
                <p className="text-center mt-6 text-sm text-slate-500">
                    Đã có tài khoản?{" "}
                    <Link to="/Login" className="text-theme hover:opacity-80 font-semibold transition-colors">
                        Đăng nhập
                    </Link>
                </p>
            </form>
        </div>
    );
}