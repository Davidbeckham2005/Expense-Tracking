export interface ICategory {
    id: string;
    user_id: string;
    name: string;
    type: 'income' | 'expense';
    icon?: string;
    color?: string;
    create_at?: string;
    is_default: boolean;
    is_deleted: boolean;
}

export interface ICreateCategory {
    name: string;
    type: 'income' | 'expense';
    icon?: string;
    color?: string;
}

export interface IUpdateCategoryDto {
    name?: string;
    type?: 'income' | 'expense';
    icon?: string;
    color?: string;
}

export interface ICategoryFormData {
    name: string;
    type: 'income' | 'expense';
    icon?: string;
    color?: string;
}
export type TCategoryType = 'income' | 'expense';