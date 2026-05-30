import { create } from 'zustand';
import { getBudgets, createBudget, updateBudget, deleteBudget, deactivateBudget } from '../services/budgets';
import type { IBudget, ICreateBudget, IUpdateBudget } from '../types/IBudget';
interface BudgetState {
    budgets: IBudget[]
    fetchBudgets: (userId?: string) => Promise<void>
    isLoading: boolean
    addBudget: (budget: ICreateBudget, userId?: string) => Promise<void>
    updateBudget: (budgetId: string, updates: IUpdateBudget, userId: string) => Promise<void>
    deleteBudget: (budgetId: string, userId: string) => Promise<void>,
    deactivateBudget: (userId?: string) => Promise<void>
}

export const useBudgetStore = create<BudgetState>((set) => ({
    budgets: [],
    isLoading: false,
    fetchBudgets: async (userId?: string) => {
        try {
            set({ isLoading: true });
            const budgets = await getBudgets(userId);
            set({ budgets: budgets || [] });
            console.log('Fetched budgets:', budgets);
        }
        catch (error) {
            console.error('Failed to fetch budgets:', error);
        }
        finally {
            set({ isLoading: false });
        }
    },
    addBudget: async (budget: ICreateBudget, userId?: string) => {
        try {
            set({ isLoading: true });
            const newBudget = await createBudget(budget, userId);
            set((state) => ({
                budgets: [...state.budgets, newBudget],
            }));
        }
        catch (error) {
            console.error('Failed to add budget:', error);
        }
        finally {
            set({ isLoading: false });
        }
    }
    ,
    updateBudget: async (
        budgetId: string,
        updates: IUpdateBudget,
        userId: string
    ) => {
        try {
            set({ isLoading: true });

            await updateBudget(budgetId, updates, userId);

            set((state) => ({
                budgets: state.budgets.map((budget) =>
                    budget.id === budgetId
                        ? { ...budget, ...updates }
                        : budget
                ),
            }));

        } catch (error) {
            console.error('Failed to update budget:', error);

        } finally {
            set({ isLoading: false });
        }
    },
    deleteBudget: async (budgetId: string, userId: string) => {
        try {
            set({ isLoading: true });
            await deleteBudget(budgetId, userId);
            set((state) => ({
                budgets: state.budgets.filter((budget) => budget.id !== budgetId),
            }));
        }
        catch (error) {

            console.error('Failed to delete budget:', error);
        }
        finally {
            set({ isLoading: false });
        }
    },
    deactivateBudget: async (userId?: string) => {
        try {
            set({ isLoading: true });
            await deactivateBudget(userId);
            set((state) => ({
                budgets: state.budgets.map((budget) =>
                    budget.user_id === userId
                        ? { ...budget, is_active: false }
                        : budget
                ),
            }));
        } catch (error) {
            console.error('Failed to deactivate budgets:', error);
        }
        finally {
            set({ isLoading: false });
        }
    }

}));
