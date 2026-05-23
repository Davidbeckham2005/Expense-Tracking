import { create } from 'zustand';
import { getCategories, createCategory, updateCategory } from '../services/categories';
import type { ICategory } from '../types/ICategories';
interface CategoryState {
    categories: ICategory[]
    fetchCategories: (userId?: string) => Promise<void>
    isLoading: boolean
    addCategory: (category: ICategory, userId?: string) => Promise<void>
    updateCategory: (categoryId: string, updates: Partial<ICategory>, userId?: string) => Promise<void>
}
export const useCategoryStore = create<CategoryState>((set) => ({
    categories: [],
    isLoading: false,
    fetchCategories: async (userId?: string) => {
        try {
            set({ isLoading: true });

            const categories = await getCategories(userId);

            set({ categories: categories || [] });
            console.log('Fetched categories:', categories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);

        } finally {
            set({ isLoading: false });
        }
    },
    addCategory: async (category: ICategory, userId?: string) => {
        try {
            set({ isLoading: true });
            const newCategory = await createCategory(category, userId);
            set((state) => ({
                categories: [...state.categories, newCategory],
            }));
        } catch (error) {
            console.error('Failed to add category:', error);
        } finally {
            set({ isLoading: false });

        }
    },
    updateCategory: async (categoryId: string, updates: Partial<ICategory>, userId?: string) => {
        try {
            set({ isLoading: true });
            const updatedCategory = await updateCategory(categoryId, updates, userId);
            set((state) => ({
                categories: state.categories.map((cat) =>
                    cat.id === categoryId ? updatedCategory : cat
                ),
            }));
        } catch (error) {
            console.error('Failed to update category:', error);
        } finally {
            set({ isLoading: false });
        }
    }
}));