import React, { useState } from 'react';
// import { Mail, Lock, Eye, EyeOff, ArrowRight, Wallet } from 'lucide-react';
import { signIn } from '../services/user';
// import {signUp,signIn,signOut} from '../services/user';
export default function Login() {
    // const [isLogin, setIsLogin] = useState(true); // Trạng thái chuyển giữa Login và Register
    // const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = async () => {
        try {
            const res = await signIn(email, password);
            console.log(res);
        } catch (err) {
            console.error(err);
        }
    }


    return (
        <div>
            <input
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                placeholder="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>
                Login
            </button>
        </div>

    );

}
