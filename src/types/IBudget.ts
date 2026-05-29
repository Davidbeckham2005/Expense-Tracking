import type { ICategory } from "./ICategories";

export interface IBudget {
    id: string;
    user_id: string;
    limit_amount: number;
    name: string;
    description?: string;
    start_date: string;
    end_date: string;
    period: TPeriod;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    budget_categories: {
        categories: ICategory;
    }[]
}
export interface ICreateBudget {
    limit_amount: number;
    name: string;
    description?: string;
    period: TPeriod;
    start_date: string;
    end_date: string;
    categories_ids: string[]
}
export interface IUpdateBudget {
    name?: string;
    description?: string;
    period?: TPeriod;
    start_date?: string;
    end_date?: string;
    categories_ids?: string[]
}
export type TPeriod = 'weekly' | 'monthly' | 'yearly' | 'daily';