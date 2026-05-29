import { supabase } from "../lib/supabase";
import type { ICreateBudget, IUpdateBudget } from "../types/IBudget";

export async function createBudget(payload: ICreateBudget, user_id: string) {
    const { categories_ids, ...budgetData } = payload;
    const { data: budget, error } = await supabase
        .from('budgets')
        .insert({
            ...budgetData,
            user_id,
        })
        .select()
        .single();
    if (error) throw error;
    if (categories_ids.length > 0) {
        const relations = categories_ids.map((category_id) => ({
            budget_id: budget.id,
            category_id
        }))
        const { error: relationError } = await supabase
            .from('budget_categories')
            .insert(relations);
        if (relationError) throw relationError;
    }
    return budget;
}

export async function getBudgets(user_id?: string) {
    const { data, error } = await supabase
        .from('budgets')
        .select(`
        *,
        budget_categories (
            categories_id,
            categories (*)
        )
`)
        .eq('user_id', user_id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}
export async function updateBudget(budgetId: string, payload: IUpdateBudget, user_id: string) {
    const { categories_ids, ...budgetData } = payload;
    const { data, error } = await supabase
        .from('budgets')
        .update({ ...budgetData, updated_at: new Date().toISOString() })
        .eq('id', budgetId)
        .eq('is_active', true)
        .eq('user_id', user_id)
    if (error) throw error;

    const { error: deleteRelationError } = await supabase
        .from('budget_categories')
        .delete()
        .eq('budget_id', budgetId);
    if (deleteRelationError) throw deleteRelationError;

    if (categories_ids && categories_ids.length > 0) {
        const relations = categories_ids.map((category_id) => (
            {
                budget_id: budgetId,
                category_id
            }
        ))
        const { error: insertRelationError } = await supabase
            .from('budget_categories')
            .insert(relations);

        if (insertRelationError) throw insertRelationError;

    }
    return data;
}

export async function deleteBudget(budgetId: string, user_id: string) {
    const { error } = await supabase
        .from('budgets')
        .update({ is_active: false })
        .eq('id', budgetId)
        .eq('user_id', user_id)
    if (error) throw error;
}