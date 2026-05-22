import { supabase } from "../lib/supabase";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
export async function signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name, // Lưu tên người dùng vào metadata của Supabase Auth
            },
        },
    });
    if (error) {
        throw error;
    }
  
    return data;
}
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        throw error;
    }

    return data;
}
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw error;
    }
    return true;
}
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
        throw error;
    }
    return user;
}
export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
        throw error;

    }
    return session;
}
// ????? 
export function subscribeToAuthChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
) {
    // Bóc tách lấy thẳng 'subscription' ra từ data
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });

    return subscription; // Trả về object subscription chuẩn
}