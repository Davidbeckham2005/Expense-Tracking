import { supabase } from '../lib/supabase';
import type { ICreateTransaction, IUpdateTransactionDto } from '../types/Transactions';

export async function createTransaction(transaction: ICreateTransaction, userId?: string) {
    const { data, error } = await supabase
        .from('transactions')
        .insert([
            {
                ...transaction,
                user_id: userId,
                is_deleted: false,
            }
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getTransactions(userId?: string) {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_deleted', false)
        .order('transaction_date', { ascending: false });
        // console.log("getTransactions", data);
    if (error) throw error;
    return data;
}
export async function updateTransaction(transactionId: string, updates: IUpdateTransactionDto, userId?: string) {
    const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', transactionId)
        .eq('user_id', userId)
        .eq('is_deleted', false)
        .select()
        .single();
    if (error) throw error;
    return data;
}
export async function deleteTransaction(transactionId: string, userId?: string) {
    const { error } = await supabase
        .from('transactions')
        .update({ is_deleted: true })
        .eq('id', transactionId)
        .eq('user_id', userId)
        .eq('is_deleted', false);
    if (error) throw error;
}
export async function deleteTransactions(transactionIDs: string[], userId?: string) {
    const {error} = await supabase 
    .from('transactions')
    .update({is_deleted: true})
    .in('id',transactionIDs)
    .eq('user_id', userId)
    .eq('is_deleted',false)
    if(error) throw error;
}