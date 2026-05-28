import { create } from 'zustand';
import { createTransaction, getTransactions, updateTransaction, deleteTransaction, deleteTransactions } from '../services/transactions';
import type { IDBTransaction, ICreateTransaction, IUpdateTransactionDto } from '../types/Transactions';
interface TransactionState {
    transactions: IDBTransaction[]
    fetchTransactions: (userId?: string) => Promise<void>
    isLoading: boolean
    addTransaction: (transaction: ICreateTransaction, userId?: string) => Promise<void>
    updateTransaction: (transactionId: string, updates: IUpdateTransactionDto, userId?: string) => Promise<void>
    deleteTransaction: (transactionId: string, userId?: string) => Promise<void>
    deleteTransactions: (transactionIDs: string[], userId?: string) => Promise<void>
}

export const useTransactionStore = create<TransactionState>((set) => ({
    transactions: [],
    isLoading: false,
    fetchTransactions: async (userId?: string) => {
        try {
            set({ isLoading: true });
            const transactions = await getTransactions(userId);
            set({ transactions: transactions || [] });
        }
        catch (error) {
            console.error('Failed to fetch transactions:', error);
        }
        finally {
            set({ isLoading: false });
        }
    },
    addTransaction: async (transaction: ICreateTransaction, userId?: string) => {
        try {
            set({ isLoading: true });
            const newTransaction = await createTransaction(transaction, userId);
            set((state) => ({
                transactions: [newTransaction, ...state.transactions],
            }));
        } catch (error) {
            console.error('Failed to add transaction:', error);
        }

        finally {
            set({ isLoading: false });
        }
    },
    updateTransaction: async (transactionId: string, updates: IUpdateTransactionDto, userId?: string) => {
        try {
            set({ isLoading: true });
            const updatedTransaction = await updateTransaction(transactionId, updates, userId);
            set((state) => ({
                transactions: state.transactions.map((tx) =>
                    tx.id === transactionId ? updatedTransaction : tx
                ),
            }));
        }
        catch (error) {
            console.error('Failed to update transaction:', error);
        }
        finally {
            set({ isLoading: false });
        }
    },
    deleteTransaction: async (transactionId: string, userId?: string) => {
        try {
            set({ isLoading: true });
            await deleteTransaction(transactionId, userId);
            set((state) => ({
                transactions: state.transactions.filter((tx) => tx.id !== transactionId),
            }));
        }
        catch (error) {
            console.error('Failed to delete transaction:', error);
        }
        finally {
            set({ isLoading: false });
        }
    },
    deleteTransactions: async (transactionIDs: string[], userId?: string) => {
        try {
            set({ isLoading: true });
            await deleteTransactions(transactionIDs, userId);
            set((state) => ({
                transactions: state.transactions.filter((tx) => !transactionIDs.includes(tx.id)),
            }));
        }
        catch (error) {
            console.error('Failed to delete transactions:', error);
        }
        finally {
            set({ isLoading: false });
        }
    },
}));