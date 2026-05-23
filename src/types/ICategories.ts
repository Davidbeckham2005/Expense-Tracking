export interface ICategory {
    id?: string;
    user_id?: string;
    name: string;
    type: 'income' | 'expense';
    icon?: string;
    color?: string;
    create_at?: string;
}