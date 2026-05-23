import { supabase } from '../lib/supabase'
import type { ICategory } from '../types/ICategories'
export async function createCategory(category: ICategory, userId?: string) {
    const { data, error } = await supabase.from('categories').insert(
        [{
            ...category,
            user_id: userId,
            is_default: false,
        }]
    ).select()
        .single();
    if (error) {
        throw error;
    }
    return data;
}
export async function getCategories(userId?: string) {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .or(`user_id.eq.${userId},is_default.eq.true`)
        .eq('is_deleted', false)
        .order('create_at', { ascending: true })
    if (error) {
        throw error;
    }
    return data;
}
export async function updateCategory(categoryId: string, updates: Partial<ICategory>, userId?: string) {
    const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', categoryId)
        .eq('user_id', userId)
        .select()
        .single();
    if (error) {
        throw error;
    }
    return data;
}
export async function deleteCategory(categoryId: string, userId?: string) {
    const { error } = await supabase
        .from('categories')
        .update({ is_deleted: true })
        .eq('id', categoryId)
        .eq('user_id', userId);
    if (error) {
        throw error;
    }
}

