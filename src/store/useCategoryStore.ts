import { create } from 'zustand';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/categories';
import type { ICategory, ICreateCategory, IUpdateCategoryDto } from '../types/ICategories';
interface CategoryState {
    categories: ICategory[]
    expense_categories: ICategory[]
    income_categories: ICategory[]
    fetchCategories: (userId?: string) => Promise<void>
    isLoading: boolean
    addCategory: (category: ICreateCategory, userId?: string) => Promise<void>
    updateCategory: (categoryId: string, updates: IUpdateCategoryDto, userId?: string) => Promise<void>
    deleteCategory: (categoryId: string, userId: string) => Promise<void>
}
export const useCategoryStore = create<CategoryState>((set) => ({
    categories: [],
    expense_categories: [],
    income_categories: [],
    isLoading: false,
    fetchCategories: async (userId?: string) => {
        try {
            set({ isLoading: true });

            const categories = await getCategories(userId);

            set({ categories: categories || [] });
            set({ expense_categories: categories?.filter((cat) => cat.type === 'expense') || [] });
            set({ income_categories: categories?.filter((cat) => cat.type === 'income') || [] });
            // console.log('Fetched categories:', categories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);

        } finally {
            set({ isLoading: false });
        }
    },
    addCategory: async (category: ICreateCategory, userId?: string) => {
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
    updateCategory: async (categoryId: string, updates: IUpdateCategoryDto, userId?: string) => {
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
    },
    deleteCategory: async (categoryId: string, userId: string) => {
        try {
            set({ isLoading: true });
            await deleteCategory(categoryId, userId);
            set((state) => ({
                categories: state.categories.filter((cat) => cat.id !== categoryId),
            }));
        } catch (error) {
            console.error('Failed to delete category:', error);
        } finally {
            set({ isLoading: false });
        }
    }
}));