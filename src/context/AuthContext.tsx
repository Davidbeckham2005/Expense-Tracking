import { useState, useEffect, createContext, useMemo, useContext } from 'react';
import type { User } from "@supabase/supabase-js";
import { getSession, subscribeToAuthChanges, signOut } from '../services/user';

interface IAuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    logout: () => Promise<void>;
}
interface IAuthProviderProps {
    children: React.ReactNode;
}
const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: IAuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const session = await getSession();
                setUser(session?.user || null);
            } catch (err) {
                console.error("Error fetching session:", err);
            } finally {
                setIsLoading(false);
            }
        }
        checkSession();
        const subscription = subscribeToAuthChanges((_event, session) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        // HỦY ĐĂNG KÝ CHUẨN: Gọi hàm .unsubscribe() khi component bị hủy (unmount)
        return () => {
            subscription.unsubscribe();
        };
    }, []);
    const logout = async () => {
        setIsLoading(true);
        try {
            await signOut();
        } catch (err) {
            console.error("Error signing out:", err);
        } finally {
            setIsLoading(false);
        }
    }
    const isAuthenticated = !!user;
    const authValue = useMemo(() => ({
        user,
        isAuthenticated,
        isLoading,
        logout,
    }), [user, isAuthenticated, isLoading]);
    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}