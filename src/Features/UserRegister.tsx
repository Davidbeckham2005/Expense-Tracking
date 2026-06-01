import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from '../services/user'
import { registerSchema } from '../Schemas/auth.schema';
import type { RegisterInput } from '../Schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { motion } from "motion/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.07 }
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

export default function Register(): React.JSX.Element {
    const Navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema), mode: "onChange"
    });

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

            <motion.div
                className="absolute -top-32 -right-32 w-96 h-96 bg-amber-300/20 rounded-full blur-[120px]"
                animate={orbAnimation(12, -40, 30)}
            />
            <motion.div
                className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-orange-300/15 rounded-full blur-[110px]"
                animate={orbAnimation(10, 30, 20)}
            />
            <motion.div
                className="absolute top-1/2 left-1/3 w-48 h-48 bg-rose-300/10 rounded-full blur-[90px]"
                animate={orbAnimation(14, -20, -40)}
            />

            <motion.form
                onSubmit={handleSubmit(handleRegister)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-card text-card-foreground border p-8 rounded-3xl shadow-xl relative z-10"
            >
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-5"
                >
                    <motion.div variants={itemVariants} className="text-center mb-6">
                        <h2 className="text-3xl font-black tracking-tight text-foreground mb-2">Đăng ký</h2>
                        <p className="text-muted-foreground text-sm">Bắt đầu hành trình tích lũy thông minh</p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-1.5">
                        <Label>Họ và tên</Label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <User className="w-5 h-5" />
                            </span>
                            <Input
                                type="text"
                                placeholder="Nguyễn Văn A"
                                {...register("name")}
                                className={`pl-12 h-12 rounded-xl ${errors.name ? "border-destructive focus-visible:border-destructive" : ""}`}
                                required
                            />
                        </div>
                        {errors.name && <p className="text-destructive text-xs pl-1">{errors.name.message}</p>}
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-1.5">
                        <Label>Email</Label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Mail className="w-5 h-5" />
                            </span>
                            <Input
                                type="email"
                                placeholder="name@domain.com"
                                {...register("email")}
                                className={`pl-12 h-12 rounded-xl ${errors.email ? "border-destructive focus-visible:border-destructive" : ""}`}
                                required
                            />
                        </div>
                        {errors.email && <p className="text-destructive text-xs pl-1">{errors.email.message}</p>}

                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-1.5">
                        <Label>Mật khẩu</Label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Lock className="w-5 h-5" />
                            </span>
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("password")}
                                className={`pl-12 pr-12 h-12 rounded-xl ${errors.password ? "border-destructive focus-visible:border-destructive" : ""}`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                        </div>
                        {errors.password && <p className="text-destructive text-xs pl-1">{errors.password.message}</p>}

                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-1.5">
                        <Label>Xác nhận mật khẩu</Label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Lock className="w-5 h-5" />
                            </span>
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("confirmPassword")}
                                className={`pl-12 pr-12 h-12 rounded-xl ${errors.confirmPassword ? "border-destructive focus-visible:border-destructive" : ""}`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition cursor-pointer"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                        </div>
                        {errors.confirmPassword && <p className="text-destructive text-xs pl-1">{errors.confirmPassword.message}</p>}

                    </motion.div>

                    <motion.button
                        variants={itemVariants}
                        type="submit"
                        disabled={isLoading}
                        whileTap={{ scale: 0.97 }}
                        className="w-full mt-8 bg-primary text-primary-foreground hover:bg-primary/80 font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span>Đăng ký ngay</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </motion.button>

                    <motion.p variants={itemVariants} className="text-center mt-6 text-sm text-muted-foreground">
                        Đã có tài khoản?{" "}
                        <Link to="/Login" className="text-primary hover:opacity-80 font-semibold transition-colors">
                            Đăng nhập
                        </Link>
                    </motion.p>
                </motion.div>
            </motion.form>
        </div>
    );
}
